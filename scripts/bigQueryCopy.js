const bigQueryConfig = require("../server/bigQuery/config");
const getEvents = require("../commons/getEvents");
const getSchema = require("../server/bigquery/schema/getSchema");
const validateAgainstSchema = require("../server/bigquery/schema/validateAgainstSchema");
const flattenObj = require("../server/bigquery/flattenObj");
const setupTable = require("../server/bigquery/schema/setupTable");
const eventToSchemaFields = require("../server/bigquery/schema/eventToSchemaFields");
const timersPromises = require("timers/promises");

function chunk(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

const source = process.env.SOURCE;

const transfer = async () => {
  const events = await getEvents();

  const days = [...Array(18)].map((_, index) => {
    var d = new Date();
    d.setDate(d.getDate() - index);
    return d.toISOString().split("T")[0];
  });

  console.log(days);

  var totalInvalid = 0;
  var totalValid = 0;

  const promises = events.map(async (event) => {
    try {
      await bigQueryConfig.bigquery
        .dataset(bigQueryConfig.dataset)
        .table(event.name)
        .delete();
    } catch (err) {}

    const schemaFields = eventToSchemaFields(event);

    await setupTable(
      event.name,
      event.description,
      schemaFields,
      bigQueryConfig
    );

    await timersPromises.setTimeout(5000);

    const metadata = await getSchema(event.name, bigQueryConfig);

    for (day of days) {
      var rows = [];

      try {
        const [fetchedRows] = await bigQueryConfig.bigquery
          .dataset(source)
          .table(event.name).query(`
        SELECT * FROM \`${bigQueryConfig.projectId}.${source}.${event.name}\` where DATE_DIFF("${day}", EXTRACT(DATE FROM original_timestamp), DAY) = 0
    `);

        rows = fetchedRows;
      } catch (err) {
        console.log(err);
      }

      var rowsToInsert = [];
      var numberValid = 0;
      var numberInvalid = 0;

      for (row of rows) {
        const flatRow = flattenObj(row);
        const keys = Object.keys(flatRow).filter((key) =>
          metadata.schema.fields.find((field) => field.name == key)
        );

        var filteredRow = {
          timestamp: row["original_timestamp"],
          tracking_id: row["user_id"],
        };

        if (event.bigQuery?.noEventFields !== true) {
          filteredRow.event_id =
            row["context_hanalytics_event_id"] || flatRow["id"];
        }

        Object.keys(flatRow).forEach((key) => {
          if (
            metadata.schema.fields.find(
              (field) => field.name == `property_${key}`
            )
          ) {
            if (key == "id") {
              filteredRow[`property_${key}`] = flatRow["_id"];
            } else if (key == "member_id") {
              filteredRow[`property_${key}`] = flatRow["member_id"];
            } else {
              try {
                filteredRow[`property_${key}`] = JSON.parse(flatRow[key]);
              } catch (err) {
                filteredRow[`property_${key}`] = flatRow[key];
              }
            }
          }
        });

        for (key of keys) {
          const field = metadata.schema.fields.find(
            (field) => field.name == key
          );
          if (field) {
            if (field.type === "INTEGER" && flatRow[key]) {
              filteredRow[key] = parseFloat(flatRow[key]);
            } else if (field.type === "STRING" && flatRow[key]) {
              filteredRow[key] = `${flatRow[key]}`;
            } else {
              filteredRow[key] = flatRow[key];
            }
          }
        }

        const valid = await validateAgainstSchema(
          event.name,
          filteredRow,
          bigQueryConfig,
          metadata
        );

        if (valid) {
          rowsToInsert.push(filteredRow);
          numberValid++;
        } else {
          numberInvalid++;
        }
      }

      if (rowsToInsert.length) {
        const insertRows = async (rows) => {
          await bigQueryConfig.bigquery
            .dataset(bigQueryConfig.dataset)
            .table(event.name)
            .insert(rows);
        };

        await Promise.all(
          chunk(rowsToInsert, 500).map(async (rows) => {
            try {
              await insertRows(rows);
            } catch (err) {
              if (err.name == "PartialFailureError") {
                console.log(
                  `PartialFailureError for ${event.name}`,
                  JSON.stringify(rows, null, 2)
                );
              } else {
                await timersPromises.setTimeout(5000);
                await insertRows(rows);
              }
            }
          })
        );
      }

      console.log(
        `Done with ${event.name}: valid: ${numberValid}, invalid: ${numberInvalid}`
      );

      totalValid = totalValid + numberValid;
      totalInvalid = totalInvalid + numberInvalid;
    }
  });

  await Promise.all(promises);

  console.log(
    `Done with EVERYTHING: valid: ${totalValid}, invalid: ${totalInvalid}`
  );

  return;
};

transfer();

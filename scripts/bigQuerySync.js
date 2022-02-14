const bigQueryConfig = require("../server/bigquery/config");
const getEvents = require("../commons/getEvents");
const getSchema = require("../server/bigquery/schema/getSchema");
const validateAgainstSchema = require("../server/bigquery/schema/validateAgainstSchema");
const flattenObj = require("../server/bigquery/flattenObj");
const setupTable = require("../server/bigquery/schema/setupTable");
const eventToSchemaFields = require("../server/bigquery/schema/eventToSchemaFields");
const timersPromises = require("timers/promises");
const insertDynamicFields = require("../server/bigquery/schema/insertDynamicFields");

function chunk(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

const source = process.env.SOURCE_DATASET;

/// Takes everything from SOURCE_DATASET and puts into __sync_table_event_name
const transfer = async () => {
  const events = await getEvents();

  const days = [...Array(20)].map((_, index) => {
    var d = new Date();
    d.setDate(d.getDate() - index);
    return d.toISOString().split("T")[0];
  });

  console.log(days);

  var totalInvalid = 0;
  var totalValid = 0;

  const promises = events.map(async (event) => {
    const schemaFields = eventToSchemaFields(event);
    const tableName = `__sync_table_${event.name}`;

    await setupTable(
      tableName,
      event.description,
      schemaFields,
      bigQueryConfig
    );

    await timersPromises.setTimeout(60000);

    await getSchema(tableName, bigQueryConfig);

    for (day of days) {
      var rows = [];

      try {
        const query = `
        SELECT * FROM \`${bigQueryConfig.projectId}.${source}.${event.name}\`
        WHERE DATE_DIFF("${day}", EXTRACT(DATE FROM original_timestamp), DAY) = 0
    `;

        const [fetchedRows] = await bigQueryConfig.bigquery
          .dataset(source)
          .table(event.name)
          .query(query);

        rows = fetchedRows;
      } catch (err) {}

      var rowsToInsert = [];
      var numberValid = 0;
      var numberInvalid = 0;

      var totalDynamicFields = {};

      for (row of rows) {
        const flatRow = flattenObj(row);

        Object.keys(flatRow).forEach((key) => {
          if (flatRow[key]) {
            totalDynamicFields[key] = flatRow[key];
            totalDynamicFields[`property_${key}`] = flatRow[key];
          }
        });
      }

      const metadataPre = bigQueryConfig.cacher.get(`schema-${tableName}`);
      await insertDynamicFields(
        event.name,
        tableName,
        totalDynamicFields,
        bigQueryConfig
      );
      const metadataPost = bigQueryConfig.cacher.get(`schema-${tableName}`);

      if (
        metadataPre.schema.fields.length != metadataPost.schema.fields.length
      ) {
        console.log("Waiting a minute for schema to be distibuted");
        await timersPromises.setTimeout(60000);
      }

      for (row of rows) {
        const flatRow = flattenObj(row);
        var propertyMappedFlatRow = {};

        Object.keys(flatRow).forEach((key) => {
          propertyMappedFlatRow[key] = flatRow[key];
          propertyMappedFlatRow[`property_${key}`] = flatRow[key];
        });

        const metadata = bigQueryConfig.cacher.get(`schema-${tableName}`);

        const keys = Object.keys(propertyMappedFlatRow).filter((key) =>
          metadata.schema.fields.find((field) => field.name == key)
        );

        var filteredRow = {};

        const parseFieldValue = (field, value) => {
          if (field.mode === "NULLABLE" && value === null) {
            return null;
          } else if (field.mode === "REPEATED") {
            if (Array.isArray(value) && value.length === 0) {
              return value;
            }

            return JSON.parse(value).map((value) =>
              parseFieldValue(
                {
                  ...field,
                  mode: "REQUIRED",
                },
                value
              )
            );
          } else if (field.type === "INTEGER" && value) {
            return parseFloat(value);
          } else if (field.type === "STRING") {
            return `${value}`;
          } else if (field.type === "BOOLEAN") {
            return !!value;
          }

          return null;
        };

        keys.forEach((key) => {
          const field = metadata.schema.fields.find(
            (field) => field.name == key
          );

          if (field) {
            if (key == "id") {
              filteredRow[field.name] = parseFieldValue(field, row["_id"]);
            } else if (key == "member_id") {
              filteredRow[field.name] = parseFieldValue(
                field,
                flatRow["member_id"]
              );
            } else {
              try {
                filteredRow[field.name] = parseFieldValue(
                  field,
                  JSON.parse(flatRow[key])
                );
              } catch (err) {
                filteredRow[field.name] = parseFieldValue(
                  field,
                  propertyMappedFlatRow[key]
                );
              }
            }
          }
        });

        if (event.bigQuery?.noEventFields !== true) {
          filteredRow.event_id =
            flatRow["context_hanalytics_event_id"] || flatRow["id"];
        }

        filteredRow.timestamp = row["original_timestamp"];
        filteredRow.tracking_id = row["user_id"];

        const valid = await validateAgainstSchema(
          tableName,
          filteredRow,
          bigQueryConfig
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
            .table(tableName)
            .insert(rows);
        };

        await Promise.all(
          chunk(rowsToInsert, 500).map(async (rows) => {
            try {
              await insertRows(rows);
            } catch (err) {
              numberValid--;
              numberInvalid++;
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

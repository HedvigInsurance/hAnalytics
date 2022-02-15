const bigQueryConfig = require("../server/bigquery/config");
const getEvents = require("../commons/getEvents");
const getSchema = require("../server/bigquery/schema/getSchema");
const validateAgainstSchema = require("../server/bigquery/schema/validateAgainstSchema");
const flattenObj = require("../server/bigquery/flattenObj");
const setupTable = require("../server/bigquery/schema/setupTable");
const eventToSchemaFields = require("../server/bigquery/schema/eventToSchemaFields");
const timersPromises = require("timers/promises");
const insertDynamicFields = require("../server/bigquery/schema/insertDynamicFields");
const filterFieldsAccordingToEvent = require("../server/bigquery/schema/filterFieldsAccordingToEvent");
const uuid = require("uuid");

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

    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(tableName)
      .delete();

    await setupTable(
      tableName,
      event.description,
      [
        ...schemaFields,
        {
          name: "loaded_at",
          type: "TIMESTAMP",
          mode: "REQUIRED",
        },
      ],
      bigQueryConfig
    );

    await getSchema(tableName, bigQueryConfig);

    for (day of days) {
      var rows = [];

      try {
        var query = "";

        if (event.bigQuery?.noEventFields === true) {
          query = `
          SELECT
            source.*
            FROM
              \`${bigQueryConfig.projectId}.${source}.${event.name}\` source
            `;
        } else {
          query = `
          SELECT
            source.*
            FROM
              \`${bigQueryConfig.projectId}.${source}.${event.name}\` source
            `;
        }

        const [fetchedRows] = await bigQueryConfig.bigquery
          .dataset(source)
          .table(event.name)
          .query({
            query,
            useQueryCache: false,
          });

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

        propertyMappedFlatRow["loaded_at"] = bigQueryConfig.bigquery.datetime(
          new Date().toISOString()
        );

        Object.keys(flatRow).forEach((key) => {
          propertyMappedFlatRow[key] = flatRow[key];

          try {
            const parsedValue = JSON.parse(flatRow[key]);

            if (Array.isArray(parsedValue)) {
              propertyMappedFlatRow[`property_${key}`] = parsedValue;
              propertyMappedFlatRow[`property_${key.replace("_id", "id")}`] =
                parsedValue;
            } else {
              throw new Error("Not array");
            }
          } catch (err) {
            propertyMappedFlatRow[`property_${key}`] = flatRow[key];
            propertyMappedFlatRow[`property_${key.replace("_id", "id")}`] =
              flatRow[key];
          }
        });

        if (event.bigQuery?.noEventFields !== true) {
          propertyMappedFlatRow.event_id =
            flatRow["context_hanalytics_event_id"] || flatRow["id"];
        }

        propertyMappedFlatRow.timestamp = flatRow["original_timestamp_value"];
        propertyMappedFlatRow.tracking_id = flatRow["user_id"];

        // some early events miss a correct context_session_id
        propertyMappedFlatRow.context_session_id =
          flatRow["context_session_id"] ?? uuid.v1();

        var filteredRow = await filterFieldsAccordingToEvent(
          event.name,
          propertyMappedFlatRow,
          bigQueryConfig
        );

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

          await bigQueryConfig.bigquery
            .dataset(bigQueryConfig.dataset)
            .table("__sync_table_raw")
            .insert(
              rows.map((row) => ({
                event: "raw",
                event_id: row["event_id"],
                property_data: JSON.stringify(row),
                timestamp: row["timestamp"],
                tracking_id: row["tracking_id"],
              }))
            );
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
        `Done with ${event.name}: valid ${
          numberValid > 0
        }, invalid: ${numberInvalid}`
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

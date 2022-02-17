const bigQueryConfig = require("../server/bigquery/config");
const getEvents = require("../commons/getEvents");
const flattenObj = require("../server/bigquery/flattenObj");
const uuid = require("uuid");
const periodicIngestor = require("../server/bigQuery/periodicIngestor");
const createInMemoryBackend = require("../server/bigQuery/periodicIngestorInMemoryBackend");
const createRedisBackend = require("../server/bigQuery/periodicIngestorRedisBackend");
const trackers = require("../server/bigquery/trackers");
const { waitUntilIdle } = require("../server/bigQuery/periodicIngestor");
const timersPromises = require("timers/promises");

const source = process.env.SOURCE_DATASET;

/// Takes everything from SOURCE_DATASET and puts into __sync_table_event_name
const transfer = async () => {
  const events = (await getEvents()).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const days = [...Array(23)].map((_, index) => {
    var d = new Date();
    d.setDate(d.getDate() - index);
    return d.toISOString().split("T")[0];
  });

  bigQueryConfig.tablePrefix = `__sync_table_`;
  bigQueryConfig.injectLoadedAtField = true;

  const backend = createInMemoryBackend();

  const ingestorState = periodicIngestor.start(bigQueryConfig, backend, 100);
  await ingestorState.schemaLoaded;

  const promises = events.map(async (event) => {
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

      for (row of rows) {
        var mappedRow = {};
        mappedRow.property = {};
        mappedRow.context = {};

        Object.keys(row).forEach((key) => {
          if (key.startsWith("context_")) {
            mappedRow.context[key.replace(/^context_/, "")] = row[key];
            return;
          }

          try {
            const parsedValue = JSON.parse(row[key]);

            if (Array.isArray(parsedValue)) {
              mappedRow.property[key] = parsedValue;
              mappedRow.property[key.replace("_id", "id")] = parsedValue;
            } else {
              throw new Error("Not array");
            }
          } catch (err) {
            if (key.startsWith("store_")) {
              if (!mappedRow.property.store) {
                mappedRow.property.store = {};
              }

              mappedRow.property.store[key.replace(/^store_/, "")] = row[key];
            } else {
              mappedRow.property[key] = row[key];
              mappedRow.property[key.replace("_id", "id")] = row[key];
            }
          }
        });

        if (event.bigQuery?.noEventFields !== true) {
          mappedRow.event_id = row["context_hanalytics_event_id"] || row["id"];
        }

        mappedRow.timestamp = row["original_timestamp"].value;
        mappedRow.tracking_id = row["user_id"];

        // some early events miss a correct context_session_id
        mappedRow.context.session_id = row["context_session_id"] ?? uuid.v1();
        mappedRow.event = row.event;

        mappedRow.context.screen_density = row["context_screen_density"] ?? 0;

        await timersPromises.setTimeout(50);

        if (!mappedRow.event) {
          // probably identify
          trackers.identify(mappedRow, bigQueryConfig, ingestorState);
        } else {
          trackers.track(
            mappedRow.event,
            mappedRow,
            bigQueryConfig,
            ingestorState
          );
        }
      }
    }
  });

  await Promise.all(promises);

  await waitUntilIdle(ingestorState);

  return;
};

transfer();

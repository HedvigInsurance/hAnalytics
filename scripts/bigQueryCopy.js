const bigQueryConfig = require("../server/bigquery/config");
const getEvents = require("../commons/getEvents");
const getSchema = require("../server/bigquery/schema/getSchema");
const setupTable = require("../server/bigquery/schema/setupTable");

/// Takes everything from sync tables, and copies unique fields
const upsert = async () => {
  const events = await getEvents();

  if (typeof process.env.SOURCE_PREFIX === "undefined") {
    console.log("Set SOURCE_PREFIX");
    return;
  }

  if (typeof process.env.DESTINATION_PREFIX === "undefined") {
    console.log("Set DESTINATION_PREFIX");
    return;
  }

  for (event of events) {
    const source = `${process.env.SOURCE_PREFIX}${event.name}`;
    const destination = `${process.env.DESTINATION_PREFIX}${event.name}`;

    const sourceMetadata = await getSchema(source, bigQueryConfig);

    await setupTable(
      destination,
      event.description,
      sourceMetadata.schema.fields,
      bigQueryConfig
    );

    const destinationMetadata = await getSchema(destination, bigQueryConfig);

    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(destination)
      .setMetadata({
        ...destinationMetadata,
        schema: {
          ...destinationMetadata,
          fields: sourceMetadata.schema.fields,
        },
      });

    var query = ``;
    var fieldsInsert = sourceMetadata.schema.fields
      .map((field) => field.name)
      .join(", ");

    var fieldsToSelect = sourceMetadata.schema.fields
      .map((field) => `source.${field.name}`)
      .join(", ");

    if (event.bigQuery?.noEventFields === true) {
      query = `
      INSERT INTO \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` (${fieldsInsert})
      (SELECT
        ${fieldsToSelect}
        FROM
            \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${source}\` source
        LEFT JOIN \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` destination ON source.timestamp = destination.timestamp
        WHERE destination.timestamp IS NULL)
        `;
    } else {
      query = `
      INSERT INTO \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` (${fieldsInsert})
      (SELECT
        ${fieldsToSelect}
        FROM
            \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${source}\` source
        LEFT JOIN \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` destination ON source.event_id = destination.event_id
        WHERE destination.event_id IS NULL)
        `;
    }

    const [insertedRows] = await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(source)
      .query({
        query,
        useQueryCache: false,
      });

    console.log(
      `Inserted a total of ${insertedRows.length} rows into ${destination}`
    );
  }
};

upsert();

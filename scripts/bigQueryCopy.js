const bigQueryConfig = require("../server/bigquery/config");
const getEvents = require("../commons/getEvents");
const getSchema = require("../server/bigquery/schema/getSchema");
const setupTable = require("../server/bigquery/schema/setupTable");

/// Takes everything from sync tables, and copies unique fields
const upsert = async () => {
  const events = (await getEvents())
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .slice(
      parseInt(process.env.MATRIX_SKIP) - 10,
      parseInt(process.env.MATRIX_SKIP)
    );

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

    const fieldsExcludingLoadedAt = sourceMetadata.schema.fields.filter(
      (field) => field.name !== "loaded_at"
    );

    var query = ``;

    var fieldsInsert = fieldsExcludingLoadedAt
      .map((field) => field.name)
      .join(", ");

    var fieldsToSelect = fieldsExcludingLoadedAt
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

    var updateQuery = ``;

    var fieldsUpdate = fieldsExcludingLoadedAt
      .map((field) => `${field.name} = source.${field.name}`)
      .join(", ");

    var fieldsUpdateSelect = fieldsExcludingLoadedAt
      .map((field) => `${field.name}`)
      .join(", ");

    if (event.bigQuery?.noEventFields === true) {
      updateQuery = `
        UPDATE \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` destination
        SET ${fieldsUpdate}
        FROM (
        select ${fieldsUpdateSelect}, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY loaded_at DESC) as __row_number from \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${source}\`
        ) source
        WHERE source.timestamp = destination.timestamp AND __row_number = 1
      `;
    } else {
      updateQuery = `
        UPDATE \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${destination}\` destination
        SET ${fieldsUpdate}
        FROM (
        select ${fieldsUpdateSelect}, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY loaded_at DESC) as __row_number from \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${source}\`
        ) source
        WHERE source.event_id = destination.event_id AND __row_number = 1
      `;
    }

    const [updatedRows] = await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(source)
      .query({
        query: updateQuery,
        useQueryCache: false,
      });

    console.log(
      `Updated a total of ${updatedRows.length} rows into ${destination}`
    );
  }
};

upsert();

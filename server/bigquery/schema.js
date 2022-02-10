const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");
const typeMaps = require("../../commons/typeMaps");
const { dataset, projectId, bigquery } = require("./config");

const loadEvent = async (importPath) => {
  const fileData = await new Promise((resolve, reject) => {
    fs.readFile(importPath, "utf8", (err, file) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(file);
    });
  });

  return yaml.load(fileData);
};

const getEvents = async () =>
  await new Promise((resolve) => {
    glob("events/**/*.yml", {}, async (_, files) => {
      const events = await Promise.all(files.map(loadEvent));
      resolve(events);
    });
  });

const getMetadata = async (name) => {
  const table = bigquery.dataset(dataset).table(name);
  const [metadata] = await table.getMetadata();
  return metadata;
};

const insertDynamicFields = async (name, row) => {
  const event = (await getEvents()).find((event) => event.name == name);

  if (!event) {
    console.log(`No matching event with ${name}`);
    return;
  }

  const fields = Object.keys(row)
    .map((key) => {
      if (
        !event.inputs.find((input) => key.startsWith(`property_${input.name}`))
      ) {
        return null;
      }

      const typeMap = {
        string: "STRING",
        number: "INTEGER",
        boolean: "BOOLEAN",
      };

      const type = typeMap[typeof row[key]];

      if (!type) {
        return null;
      }

      return {
        name: key,
        type,
      };
    })
    .filter((i) => i);

  const table = bigquery.dataset(dataset).table(name);
  const metadata = await getMetadata(name);

  const schema = metadata.schema ?? {
    fields: [],
  };

  const filteredFields = fields.filter(
    (field) =>
      !schema.fields.find((schemaField) => schemaField.name == field.name)
  );

  const new_schema = schema;
  new_schema.fields = [new_schema.fields, filteredFields].flatMap((i) => i);
  metadata.schema = new_schema;

  await table.setMetadata(metadata);
};

const validateAgainstSchema = async (name, row) => {
  const metadata = await getMetadata(name);

  const schema = metadata.schema ?? {
    fields: [],
  };

  return !Object.keys(row).find((key) => {
    if (!schema.fields.find((field) => field.name == key)) {
      console.log(`missing property ${key} on ${name}`);
      return true;
    }

    return false;
  });
};

const createView = async (name) => {
  const viewQuery = `
  SELECT * EXCEPT (__row_number) FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY timestamp DESC) AS __row_number FROM \`${projectId}.${dataset}.${name}\`
  )
  WHERE __row_number = 1
`
    
const viewName = `${name}_view`

  try {
    await bigquery.dataset(dataset).createTable(viewName, {
      view: viewQuery,
    });
  } catch (err) {
    const [view] = await bigquery.dataset(dataset).table(viewName).get();

    const [metadata] = await view.getMetadata();

    metadata.view = viewQuery;

    await view.setMetadata(metadata);
  }
};

const setupTable = async (name, fields) => {
  try {
    await bigquery.dataset(dataset).createTable(name, {
      schema: {
        fields,
      },
      timePartitioning: {
        type: "DAY",
        expirationMS: "7776000000",
        field: "timestamp",
      },
    });
  } catch (err) {
    const table = bigquery.dataset(dataset).table(name);
    const metadata = await getMetadata(name);

    const schema = metadata.schema ?? {};

    const filteredFields = fields.filter(
      (field) =>
        !schema.fields.find((schemaField) => schemaField.name == field.name)
    );

    const new_schema = schema;
    new_schema.fields = [new_schema.fields, filteredFields].flatMap((i) => i);
    metadata.schema = new_schema;

    await table.setMetadata(metadata);
  }
};

const setupSchema = async (onLoad) => {
  const events = await getEvents();

  const eventFields = [
    {
      name: "event",
      type: "STRING",
    },
    {
      name: "event_id",
      type: "STRING",
    },
  ];

  const contextFields = [
    {
      name: "context_app_build",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_app_name",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_app_namespace",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_app_version",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_id",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_version",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_manufacturer",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_model",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_type",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_device_name",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_ip",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_locale",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_os_name",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_os_version",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_screen_height",
      type: "INTEGER",
      mode: "NULLABLE",
    },
    {
      name: "context_screen_width",
      type: "INTEGER",
      mode: "NULLABLE",
    },
    {
      name: "context_screen_density",
      type: "INTEGER",
      mode: "NULLABLE",
    },
    {
      name: "context_session_id",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_timezone",
      type: "STRING",
      mode: "NULLABLE",
    },
    {
      name: "context_traits_member_id",
      type: "STRING",
      mode: "NULLABLE",
    },
  ];

  const generalFields = [
    {
      name: "timestamp",
      type: "TIMESTAMP",
    },
    {
      name: "tracking_id",
      type: "STRING",
    },
  ];

  await Promise.all(
    events.map(async (event) => {
      var propertyFields = [];

      if (event.inputs) {
        event.inputs.forEach((input) => {
          let typeOptions = typeMaps.bigQuerySchemaTypeMap(input.type);

          if (!typeOptions) {
            return;
          }

          propertyFields.push({
            name: `property_${input.name}`,
            ...typeOptions,
          });
        });
      }

      if (event.constants) {
        event.constants.forEach((constant) => {
          let typeOptions = typeMaps.bigQuerySchemaTypeMap(constant.type);

          if (!typeOptions) {
            return;
          }

          propertyFields.push({
            name: `property_${constant.name}`,
            ...typeOptions,
          });
        });
      }

      if (event.graphql) {
        event.graphql.selectors.forEach((selector) => {
          let typeOptions = typeMaps.bigQuerySchemaTypeMap(selector.type);

          if (!typeOptions) {
            return;
          }

          propertyFields.push({
            name: `property_${selector.name}`,
            ...typeOptions,
          });
        });
      }

      await setupTable(
        event.name,
        [eventFields, contextFields, generalFields, propertyFields].flatMap(
          (i) => i
        )
      );

      await createView(event.name);
    })
  );

  await setupTable(
    "tracks",
    [eventFields, contextFields, generalFields].flatMap((i) => i)
  );

  await createView("tracks");

  await setupTable(
    "identifies",
    [
      [
        {
          name: "member_id",
          type: "STRING",
        },
      ],
      generalFields,
    ].flatMap((i) => i)
  );

  onLoad();
};

module.exports = {
  setupSchema,
  validateAgainstSchema,
  insertDynamicFields,
};

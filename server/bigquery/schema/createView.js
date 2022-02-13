const createView = async (name, description = "", fields, bigQueryConfig) => {
  const viewQuery = `
      SELECT * FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${name}\`
  `;

  const viewName = `${name}_distinct_view`;

  const updateSchemaAndView = async () => {
    const [view] = await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .table(viewName)
      .get();

    const [metadata] = await view.getMetadata();
    const schema = metadata.schema ?? { fields: [] };

    const filteredFields = schema.fields.filter(
      (schemaField) => !fields.find((field) => field.name == schemaField.name)
    );

    const new_schema = schema;
    new_schema.fields = [...filteredFields, ...fields];
    metadata.schema = new_schema;
    metadata.view = viewQuery;
    metadata.description = description;

    await view.setMetadata(metadata);
  };

  try {
    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(viewName, {
        view: viewQuery,
        description,
      });
    await updateSchemaAndView();
  } catch (err) {
    await updateSchemaAndView();
  }
};

module.exports = createView;

const createView = async (name, fields, bigQueryConfig) => {
  const viewQuery = `
    SELECT * EXCEPT (__row_number) FROM (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY timestamp DESC) AS __row_number FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${name}\`
    )
    WHERE __row_number = 1
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

    await view.setMetadata(metadata);
  };

  try {
    await bigQueryConfig.bigquery
      .dataset(bigQueryConfig.dataset)
      .createTable(viewName, {
        view: viewQuery,
      });
    await updateSchemaAndView();
  } catch (err) {
    await updateSchemaAndView();
  }
};

module.exports = createView;

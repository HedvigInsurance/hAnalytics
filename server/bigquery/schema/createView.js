const createView = async (name, { bigquery, dataset, projectId }) => {
  const viewQuery = `
    SELECT * EXCEPT (__row_number) FROM (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY timestamp DESC) AS __row_number FROM \`${projectId}.${dataset}.${name}\`
    )
    WHERE __row_number = 1
  `;

  const viewName = `${name}_view`;

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

module.exports = createView;

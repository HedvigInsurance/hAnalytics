const createView = require("./createView");
const createBigQueryConfigMock = require("../config.mock");

test("validate against schema", async () => {
  const { bigquery, dataset, projectId } = createBigQueryConfigMock();

  await createView("mock_table", { bigquery, dataset, projectId });

  expect(bigquery.getTables()).toMatchSnapshot();
});

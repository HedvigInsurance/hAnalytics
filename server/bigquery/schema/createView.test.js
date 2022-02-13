const createView = require("./createView");
const createBigQueryConfigMock = require("../config.mock");

test("validate against schema", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await createView("mock_table", bigQueryConfig);

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});

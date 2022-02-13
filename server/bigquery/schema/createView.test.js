const createView = require("./createView");
const createBigQueryConfigMock = require("../config.mock");
const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");
const setupTable = require("./setupTable");

test("validate against schema", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    [
      {
        name: "event_id",
        ...bigQuerySchemaTypeMap("String"),
      },
    ],
    bigQueryConfig
  );

  await createView(
    "mock_table",
    [
      {
        name: "event_id",
        ...bigQuerySchemaTypeMap("String"),
      },
    ],
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});

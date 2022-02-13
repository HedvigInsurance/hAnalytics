const createView = require("./createView");
const createBigQueryConfigMock = require("../config.mock");
const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");

test("validate against schema", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

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

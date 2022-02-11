const validateAgainstSchema = require("./validateAgainstSchema");
const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("validate against schema", async () => {
  const { bigquery, dataset } = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    [
      {
        name: "property_hello",
        type: "STRING",
      },
    ],
    {
      bigquery,
      dataset,
    }
  );

  const validateOne = await validateAgainstSchema(
    "mock_table",
    {
      property_hello: "hello",
    },
    { bigquery, dataset }
  );

  expect(validateOne).toEqual(true);

  const validateTwo = await validateAgainstSchema(
    "mock_table",
    {
      property_not_in_schema: "mock",
    },
    { bigquery, dataset }
  );

  expect(validateTwo).toEqual(false);

  const validateWrongType = await validateAgainstSchema(
    "mock_table",
    {
      property_hello: 123,
    },
    { bigquery, dataset }
  );

  expect(validateWrongType).toEqual(false);
});

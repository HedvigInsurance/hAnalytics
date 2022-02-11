const insertDynamicFields = require("./insertDynamicFields");
const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");

test("insert dynamic fields", async () => {
  const { bigquery, dataset } = createBigQueryConfigMock();

  await setupTable(
    "embark_track",
    [
      {
        name: "property_store_hello",
        type: "STRING",
      },
    ],
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables()).toMatchSnapshot();

  await insertDynamicFields(
    "embark_track",
    {
      property_store_hello: "mock",
      property_store_personal_number: "93202320",
      some_rouge_field_that_should_be_gone: "asss",
      property_random_personal_number: "nsisks",
    },
    {
      bigquery,
      dataset,
    }
  );

  expect(bigquery.getTables()).toMatchSnapshot();
});

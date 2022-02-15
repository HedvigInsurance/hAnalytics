const insertDynamicFields = require("./insertDynamicFields");
const createBigQueryConfigMock = require("../config.mock");
const setupSchema = require("../setupSchema");

test("insert dynamic fields", async () => {
  const bigQueryConfig = createBigQueryConfigMock([
    {
      name: "embark_track",
      inputs: [
        {
          name: "store",
          type: "Dictionary<String, Any>",
        },
      ],
    },
  ]);

  await setupSchema(() => {}, bigQueryConfig);

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();

  await insertDynamicFields(
    "embark_track",
    "embark_track",
    {
      property_store_hello: "mock",
      property_store_personal_number: "93202320",
      some_rouge_field_that_should_be_gone: "asss",
      property_random_personal_number: "nsisks",
    },
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();

  await insertDynamicFields(
    "embark_track",
    "embark_track",
    {
      property_store_hello: "mock",
      property_store_personal_number: "93202320",
      some_rouge_field_that_should_be_gone: "asss",
      property_random_personal_number: "nsisks",
    },
    bigQueryConfig
  );

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();
});

const insertDynamicFields = require("./insertDynamicFields");
const createBigQueryConfigMock = require("../config.mock");
const setupSchema = require("../setupSchema");
const { bigquery } = require("../config");

test("insert dynamic fields", async () => {
  const bigQueryConfig = createBigQueryConfigMock([
    {
      name: "embark_track",
      bigQuery: {
        noContextFields: true,
        noEventFields: true,
      },
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

  var [metadata] = await bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table("embark_track")
    .getMetadata();

  expect(metadata.schema.fields).toContainEqual({
    description: "",
    name: "property_store_personal_number",
    mode: "NULLABLE",
    type: "STRING",
  });

  expect(metadata.schema.fields).toContainEqual({
    description: "",
    name: "property_store_hello",
    mode: "NULLABLE",
    type: "STRING",
  });

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

  var [metadata] = await bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table("embark_track")
    .getMetadata();

  expect(metadata.schema.fields).not.toContainEqual({
    description: "",
    name: "some_rouge_field_that_should_be_gone",
    mode: "NULLABLE",
    type: "STRING",
  });

  expect(metadata.schema.fields).not.toContainEqual({
    description: "",
    name: "property_random_personal_number",
    mode: "NULLABLE",
    type: "STRING",
  });
});

test("insert dynamic fields in aggregate", async () => {
  const bigQueryConfig = createBigQueryConfigMock([
    {
      name: "embark_track",
      bigQuery: {
        noContextFields: true,
        noEventFields: true,
      },
      inputs: [
        {
          name: "store",
          type: "Dictionary<String, Any>",
        },
      ],
    },
    {
      name: "aggregate",
      bigQuery: {
        noContextFields: true,
        includeAggregateProperties: true,
      },
    },
  ]);

  await setupSchema(() => {}, bigQueryConfig);

  expect(bigQueryConfig.bigquery.getTables()).toMatchSnapshot();

  await insertDynamicFields(
    "aggregate",
    "aggregate",
    {
      properties_embark_track: {
        property_store_hello: "mock",
        property_store_personal_number: "93202320",
        some_rouge_field_that_should_be_gone: "asss",
        property_random_personal_number: "nsisks",
      },
    },
    bigQueryConfig
  );

  var [metadata] = await bigQueryConfig.bigquery
    .dataset(bigQueryConfig.dataset)
    .table("aggregate")
    .getMetadata();

  expect(metadata.schema.fields).toContainEqual({
    description: "",
    name: "properties_embark_track",
    mode: "NULLABLE",
    type: "STRUCT",
    fields: [
      {
        description: "",
        mode: "NULLABLE",
        name: "property_store_hello",
        type: "STRING",
      },
      {
        description: "",
        mode: "NULLABLE",
        name: "property_store_personal_number",
        type: "STRING",
      },
    ],
  });
});

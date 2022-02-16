const validateAgainstSchema = require("./validateAgainstSchema");
const setupTable = require("./setupTable");
const createBigQueryConfigMock = require("../config.mock");
const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");

test("validate String", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await bigQuerySchemaTypeMap("String");

  console.log([
    {
      name: "property_hello",
      ...(await bigQuerySchemaTypeMap("String")),
    },
  ]);

  return;

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "property_hello",
        ...(await bigQuerySchemaTypeMap("String")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      property_hello: "hello",
    },
    bigQueryConfig
  );

  expect(validate).toEqual(true);
});

test("validate should fail with unknown properites", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "property_hello",
        ...(await bigQuerySchemaTypeMap("String")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      property_not_in_schema: "mock",
    },
    bigQueryConfig
  );

  expect(validate).toEqual(false);
});

test("validate should fail with wrong type", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "property_hello",
        ...(await bigQuerySchemaTypeMap("String")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      property_hello: 123,
    },
    bigQueryConfig
  );

  expect(validate).toEqual(false);
});

test("validate should accept nullable", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "property_mock",
        ...(await bigQuerySchemaTypeMap("Optional<String>")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      property_mock: null,
    },
    bigQueryConfig
  );

  expect(validate).toEqual(true);
});

test("validate should not accept null", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "property_hello",
        ...(await bigQuerySchemaTypeMap("String")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      property_hello: null,
    },
    bigQueryConfig
  );

  expect(validate).toEqual(false);
});

test("validate should accept array", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "experiments",
        ...(await bigQuerySchemaTypeMap("Array<String>")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      experiments: ["123", "456"],
    },
    bigQueryConfig
  );

  expect(validate).toEqual(true);
});

test("validate should not accept array with wrong type", async () => {
  const bigQueryConfig = createBigQueryConfigMock();

  await setupTable(
    "mock_table",
    "mock table",
    [
      {
        name: "experiments",
        ...(await bigQuerySchemaTypeMap("Array<String>")),
      },
    ],
    bigQueryConfig
  );

  const validate = await validateAgainstSchema(
    "mock_table",
    {
      experiments: [123, "456"],
    },
    bigQueryConfig
  );

  expect(validate).toEqual(false);
});

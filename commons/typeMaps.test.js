const typeMaps = require("./typeMaps.js");

test("swiftTypeMap", () => {
  expect(typeMaps.swiftTypeMap("Array<String>")).toEqual("[String]");
  expect(typeMaps.swiftTypeMap("Array<Boolean>")).toEqual("[Bool]");
  expect(typeMaps.swiftTypeMap("Array<Dictionary<String, String>>")).toEqual(
    "[[String: String]]"
  );
  expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?");
});

test("kotlinTypeMap", () => {
  expect(typeMaps.kotlinTypeMap("Array<String>")).toEqual("List<String>");
  expect(typeMaps.kotlinTypeMap("Array<Boolean>")).toEqual("List<Boolean>");
  expect(typeMaps.kotlinTypeMap("Array<Dictionary<String, String>>")).toEqual(
    "List<Map<String, String>>"
  );
  expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?");
});

test("bigQuerySchemaTypeMap", async () => {
  expect(await typeMaps.bigQuerySchemaTypeMap("String")).toEqual({
    type: "STRING",
    mode: "REQUIRED",
  });
  expect(await typeMaps.bigQuerySchemaTypeMap("Double")).toEqual({
    type: "INTEGER",
    mode: "REQUIRED",
  });
  expect(await typeMaps.bigQuerySchemaTypeMap("Optional<Double>")).toEqual({
    type: "INTEGER",
    mode: "NULLABLE",
  });

  expect(
    await typeMaps.bigQuerySchemaTypeMap("Dictionary<String, Any>", {
      hello: 123,
    })
  ).toEqual([{ mode: "NULLABLE", name: "hello", type: "INTEGER" }]);

  expect(
    await typeMaps.bigQuerySchemaTypeMap("Optional<Any>", "Value")
  ).toEqual({
    type: "STRING",
    mode: "NULLABLE",
  });

  expect(
    await typeMaps.bigQuerySchemaTypeMap("Dictionary<String, Any>", {
      hello: 123,
      hello_mock: "mock",
    })
  ).toEqual([
    { mode: "NULLABLE", name: "hello", type: "INTEGER" },
    { mode: "NULLABLE", name: "hello_mock", type: "STRING" },
  ]);

  expect(
    await typeMaps.bigQuerySchemaTypeMap("Dictionary<String, Optional<Any>>", {
      hello: 123,
      hello_mock: "mock",
    })
  ).toEqual([
    { mode: "NULLABLE", name: "hello", type: "INTEGER" },
    { mode: "NULLABLE", name: "hello_mock", type: "STRING" },
  ]);
});

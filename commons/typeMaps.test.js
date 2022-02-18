const typeMaps = require("./typeMaps.js");

test("swiftTypeMap", () => {
  expect(typeMaps.swiftTypeMap("Array<String>")).toEqual("[String]");
  expect(typeMaps.swiftTypeMap("Array<Boolean>")).toEqual("[Bool]");
  expect(typeMaps.swiftTypeMap("Array<Dictionary<String, String>>")).toEqual(
    "[[String: String]]"
  );
  expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?");
  expect(
    typeMaps.kotlinTypeMap("Dictionary<String, Optional<String>>")
  ).toEqual("[String: String?]");
});

test("kotlinTypeMap", () => {
  expect(typeMaps.kotlinTypeMap("Array<String>")).toEqual("List<String>");
  expect(typeMaps.kotlinTypeMap("Array<Boolean>")).toEqual("List<Boolean>");
  expect(typeMaps.kotlinTypeMap("Array<Dictionary<String, String>>")).toEqual(
    "List<Map<String, String>>"
  );
  expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?");
  expect(typeMaps.kotlinTypeMap("Dictionary<String, String>")).toEqual(
    "Map<String, String>"
  );

  expect(
    typeMaps.kotlinTypeMap("Dictionary<String, Optional<String>>")
  ).toEqual("Map<String, String?>");
});

test("bigQuerySchemaTypeMap", async () => {
  expect(typeMaps.bigQuerySchemaTypeMap("String")).toEqual({
    type: "STRING",
    mode: "REQUIRED",
  });
  expect(typeMaps.bigQuerySchemaTypeMap("Double")).toEqual({
    type: "INTEGER",
    mode: "REQUIRED",
  });
  expect(typeMaps.bigQuerySchemaTypeMap("Optional<Double>")).toEqual({
    type: "INTEGER",
    mode: "NULLABLE",
  });

  expect(
    typeMaps.bigQuerySchemaTypeMap("Dictionary<String, String>", {
      hello: 123,
    })
  ).toEqual({
    fields: [
      { mode: "REQUIRED", name: "key", type: "STRING" },
      { mode: "REQUIRED", name: "value", type: "STRING" },
    ],
    mode: "REPEATED",
    type: "STRUCT",
  });

  expect(typeMaps.bigQuerySchemaTypeMap("Optional<String>", "Value")).toEqual({
    type: "STRING",
    mode: "NULLABLE",
  });

  expect(
    typeMaps.bigQuerySchemaTypeMap(
      "Dictionary<Optional<String>, Optional<String>>",
      {
        hello: 123,
        hello_mock: "mock",
      }
    )
  ).toEqual({
    fields: [
      { mode: "NULLABLE", name: "key", type: "STRING" },
      { mode: "NULLABLE", name: "value", type: "STRING" },
    ],
    mode: "REPEATED",
    type: "STRUCT",
  });
});

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

test("bigQuerySchemaTypeMap", () => {
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
});

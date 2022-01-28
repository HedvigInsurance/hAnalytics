const typeMaps = require("./typeMaps.js")

test('swiftTypeMap', () => {
    expect(typeMaps.swiftTypeMap("Array<String>")).toEqual("[String]")
    expect(typeMaps.swiftTypeMap("Array<Boolean>")).toEqual("[Bool]")
    expect(typeMaps.swiftTypeMap("Array<Dictionary<String, String>>")).toEqual("[[String: String]]")
    expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?")
});

test('kotlinTypeMap', () => {
    expect(typeMaps.kotlinTypeMap("Array<String>")).toEqual("Array<String>")
    expect(typeMaps.kotlinTypeMap("Array<Boolean>")).toEqual("Array<Boolean>")
    expect(typeMaps.kotlinTypeMap("Array<Dictionary<String, String>>")).toEqual("Array<Map<String, String>>")
    expect(typeMaps.kotlinTypeMap("Optional<String>")).toEqual("String?")
});
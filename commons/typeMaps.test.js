const typeMaps = require("./typeMaps.js")

test('swiftTypeMap', () => {
    expect(typeMaps.swiftTypeMap("Array<String>")).toEqual("[String]")
    expect(typeMaps.swiftTypeMap("Array<Boolean>")).toEqual("[Bool]")
    expect(typeMaps.swiftTypeMap("Array<Dictionary<String, String>>")).toEqual("[[String: String]]")
});
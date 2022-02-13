test("caches correctly", () => {
  const cacher = require("./cacher")();
  cacher.set("mock", "mock");
  expect(cacher.get("mock")).toEqual("mock");
});

test("resets correctly", () => {
  const cacher = require("./cacher")();
  cacher.set("mock", "mock");
  cacher.reset();
  expect(cacher.get("mock")).toEqual(null);
});

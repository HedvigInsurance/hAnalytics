const cacher = require("./cacher");

test("caches correctly", () => {
  cacher.set("mock", "mock");
  expect(cacher.get("mock")).toEqual("mock");
});

test("resets correctly", () => {
  cacher.set("mock", "mock");
  cacher.reset();
  expect(cacher.get("mock")).toEqual(null);
});

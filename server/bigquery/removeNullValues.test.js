const removeNullValues = require("./removeNullValues");

test("keeps valid values", () => {
  expect(
    removeNullValues({
      hello: "hello",
      something: null,
    })
  ).toEqual({
    hello: "hello",
  });

  expect(
    removeNullValues({
      hello: "hello",
      array: [
        {
          hello: "hello",
          value: null,
        },
        {
          hello: "hello",
          value: null,
        },
      ],
    })
  ).toEqual({
    hello: "hello",
    array: [
      {
        hello: "hello",
      },
      {
        hello: "hello",
      },
    ],
  });
});

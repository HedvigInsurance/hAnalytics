const omit = require("./omit");

test("omits correctly", () => {
  expect(
    omit("property", {
      property: {
        hello: "hello",
      },
    })
  ).toMatchSnapshot();

  expect(
    omit("property", {
      property: {
        hello: "hello",
      },
      otherValue: "hello",
    })
  ).toMatchSnapshot();

  expect(
    omit(["property", "otherValue"], {
      property: {
        hello: "hello",
      },
      otherValue: "hello",
    })
  ).toMatchSnapshot();

  expect(
    omit(["property", "othersValue"], {
      property: {
        hello: "hello",
      },
      otherValue: "hello",
    })
  ).toMatchSnapshot();
});

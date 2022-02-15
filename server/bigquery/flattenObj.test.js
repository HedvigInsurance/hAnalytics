const flattenObj = require("./flattenObj");

test("flattens correctly", async () => {
  expect(
    flattenObj({
      property: {
        memberId: "hello",
      },
    })
  ).toMatchSnapshot();

  expect(
    flattenObj({
      property: {
        store: {
          fisk: "mock",
          other: "two",
        },
      },
    })
  ).toMatchSnapshot();

  expect(
    flattenObj({
      property: {
        store: {
          fisk: [
            {
              memberId: 123,
            },
          ],
          other: "two",
        },
      },
    })
  ).toMatchSnapshot();

  expect(
    flattenObj({
      property: {
        store: {
          fisk: [123],
          other: "two",
        },
      },
    })
  ).toMatchSnapshot();

  expect(
    flattenObj({
      property: {
        store: {
          fisk: [
            {
              memberId: [
                {
                  someProperty: "hello",
                },
              ],
            },
          ],
          other: "two",
        },
      },
    })
  ).toMatchSnapshot();

  expect(
    flattenObj({
      property: {
        initiated_from: "test",
      },
    })
  ).toMatchSnapshot();
});

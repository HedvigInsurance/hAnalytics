const validateEvent = require("commons/validateEvent.js");

test("signed one SE_ACCIDENT quote", () => {
  const event = validateEvent(
    __filename,
    {
      quoteIds: ["123"],
    },
    {
      quoteBundle: {
        quotes: [
          {
            typeOfContract: "SE_ACCIDENT",
            initiatedFrom: "SELF_CHANGE",
          },
        ],
      },
    }
  );

  expect(event).toMatchSnapshot();
});

test("signed two quotes", () => {
  const event = validateEvent(
    __filename,
    {
      quoteIds: ["123", "12333"],
    },
    {
      quoteBundle: {
        quotes: [
          {
            typeOfContract: "SE_ACCIDENT",
            initiatedFrom: "APP",
          },
          {
            typeOfContract: "SE_HOUSE",
            initiatedFrom: "APP",
          },
        ],
      },
    }
  );

  expect(event).toMatchSnapshot();
});

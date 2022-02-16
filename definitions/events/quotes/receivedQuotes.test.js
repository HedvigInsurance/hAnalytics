const validateEvent = require("commons/validateEvent.js");

test("one SE_ACCIDENT quote", () => {
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

test("two different quotes", () => {
  const event = validateEvent(
    __filename,
    {
      quoteIds: ["123", "12345"],
    },
    {
      quoteBundle: {
        quotes: [
          {
            typeOfContract: "SE_ACCIDENT",
            initiatedFrom: "APP",
          },
          {
            typeOfContract: "SE_APARTMENT_BRF",
            initiatedFrom: "APP",
          },
        ],
      },
    }
  );

  expect(event).toMatchSnapshot();
});

const screenViewOfferTransformer = require("./screenViewOfferTransformer");

test("screen_view_offer", () => {
  const screenViewOfferEvent = screenViewOfferTransformer.transform({
    event: {
      name: "screen_view_offer",
      id: "mock",
    },
    properties: {
      offer_ids: ["mock", "mock2"],
      type_of_contracts: "A,B",
      initiated_from: "iOS",
    },
  });

  expect(screenViewOfferEvent).toEqual({
    event: {
      name: "received_quotes",
      id: "mock-transformed-received_quotes",
    },
    properties: {
      quote_ids: ["mock", "mock2"],
      type_of_contracts: ["A", "B"],
      initiated_from: "iOS",
    },
  });
});

test("shouldTransform reports correctly", () => {
  expect(
    screenViewOfferTransformer.shouldTransform({
      event: {
        name: "screen_view_offer",
        id: "mock",
      },
    })
  ).toEqual(true);

  expect(
    screenViewOfferTransformer.shouldTransform({
      event: {
        name: "screen_view_claims",
        id: "mock",
      },
    })
  ).toEqual(false);

  expect(
    screenViewOfferTransformer.shouldTransform({
      event: {
        name: "app_started",
        id: "mock",
      },
    })
  ).toEqual(false);
});

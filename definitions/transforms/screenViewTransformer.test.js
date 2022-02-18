const screenViewTransformer = require("./screenViewTransformer");

test("screen_view_offer", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: {
      name: "screen_view_offer",
      id: "mock",
    },
    properties: {
      otherArgument: true,
    },
  });

  expect(screenViewOfferEvent).toEqual({
    event: {
      name: "app_screen_view",
      id: "mock-transformed-app_screen_view",
    },
    properties: {
      screen_name: "offer",
    },
  });
});

test("screen_view_claim_honor_pledge", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: {
      name: "screen_view_claim_honor_pledge",
      id: "mock",
    },
  });

  expect(screenViewOfferEvent).toEqual({
    event: {
      name: "app_screen_view",
      id: "mock-transformed-app_screen_view",
    },
    properties: {
      screen_name: "claim_honor_pledge",
    },
  });
});

test("shouldTransform reports correctly", () => {
  expect(
    screenViewTransformer.shouldTransform({
      event: {
        name: "screen_view_claim_honor_pledge",
        id: "mock",
      },
    })
  ).toEqual(true);

  expect(
    screenViewTransformer.shouldTransform({
      event: {
        name: "app_started",
        id: "mock",
      },
    })
  ).toEqual(false);
});

const screenViewTransformer = require("./screenViewTransformer");

test("screen_view_offer", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: "screen_view_offer",
    event_id: "mock",
  });

  expect(screenViewOfferEvent).toEqual({
    event: "app_screen_view",
    event_id: "mock-transformed-app_screen_view",
    property: {
      screen_name: "offer",
    },
  });
});

test("screen_view_claim_honor_pledge", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: "screen_view_claim_honor_pledge",
    event_id: "mock",
  });

  expect(screenViewOfferEvent).toEqual({
    event: "app_screen_view",
    event_id: "mock-transformed-app_screen_view",
    property: {
      screen_name: "claim_honor_pledge",
    },
  });
});

test("shouldTransform reports correctly", () => {
  expect(
    screenViewTransformer.shouldTransform({
      event: "screen_view_claim_honor_pledge",
      event_id: "mock",
    })
  ).toEqual(true);

  expect(
    screenViewTransformer.shouldTransform({
      event: "app_started",
      event_id: "mock",
    })
  ).toEqual(false);
});

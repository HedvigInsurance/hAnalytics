const screenViewTransformer = require("./screenViewTransformer");

test("screen_view_offer", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: "screen_view_offer",
  });

  expect(screenViewOfferEvent).toEqual({
    event: "screen_view",
    property_screen_name: "offer",
  });
});

test("screen_view_claim_honor_pledge", () => {
  const screenViewOfferEvent = screenViewTransformer.transform({
    event: "screen_view_claim_honor_pledge",
  });

  expect(screenViewOfferEvent).toEqual({
    event: "screen_view",
    property_screen_name: "claim_honor_pledge",
  });
});

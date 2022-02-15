const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    locale: "en-DK",
  });

  expect(event).toMatchSnapshot();
});

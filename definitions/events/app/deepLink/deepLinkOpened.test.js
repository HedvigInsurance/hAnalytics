const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    type: "forever",
  });

  expect(event).toMatchSnapshot();
});

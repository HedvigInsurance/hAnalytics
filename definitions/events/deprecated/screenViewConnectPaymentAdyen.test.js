const validateEvent = require("commons/validateEvent.js");

test("validate event", () => {
  const event = validateEvent(__filename);
  expect(event).toMatchSnapshot();
});

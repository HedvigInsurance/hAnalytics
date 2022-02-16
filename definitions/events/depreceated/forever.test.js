const validateEvent = require("commons/validateEvent.js");

test("validate forever", () => {
  const event = validateEvent(__filename);
  expect(event).toMatchSnapshot();
});

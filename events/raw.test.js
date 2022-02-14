const validateEvent = require("../commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    data: JSON.stringify({ data: true }),
  });
  expect(event).toMatchSnapshot();
});

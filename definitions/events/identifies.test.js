const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    memberId: "123",
  });
  expect(event).toMatchSnapshot();
});

test("validate nullable memberId", () => {
  const event = validateEvent(__filename, {
    memberId: null,
  });
  expect(event).toMatchSnapshot();
});

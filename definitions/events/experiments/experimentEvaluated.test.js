const validateEvent = require("commons/validateEvent.js");

test("validate variant", () => {
  const event = validateEvent(__filename, {
    name: "chat_provider",
    variant: "bot-service",
  });

  expect(event).toMatchSnapshot();
});

test("validate another variant", () => {
  const event = validateEvent(__filename, {
    name: "is_something_active",
    variant: "enabled",
  });

  expect(event).toMatchSnapshot();
});

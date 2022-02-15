const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    storyName: "Test",
    passageName: "Passage",
  });

  expect(event).toMatchSnapshot();
});

const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    id: "some_id",
    storyName: "name_of_story",
  });
  expect(event).toMatchSnapshot();
});

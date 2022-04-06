const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    storyName: "name of story",
    store: {
      hello: "something",
    },
  });

  expect(event).toMatchSnapshot();
});

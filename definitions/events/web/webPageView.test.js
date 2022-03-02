const validateEvent = require("commons/validateEvent.js");

test("validate", () => {
  const event = validateEvent(__filename, {
    href: "http://www.hedvig.com/page",
    pathname: "/page",
    hostname: "www.hedvig.com",
  });
  expect(event).toMatchSnapshot();
});

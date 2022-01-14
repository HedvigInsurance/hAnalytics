const validateEvent = require("../../commons/validate-event.js")

test('validate profile', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
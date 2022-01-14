const validateEvent = require("../../commons/validate-event.js")

test('validate home', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
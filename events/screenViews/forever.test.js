const validateEvent = require("../../commons/validate-event.js")

test('validate forever', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
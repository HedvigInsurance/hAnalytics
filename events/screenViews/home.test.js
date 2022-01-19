const validateEvent = require("../../commons/validateEvent.js")

test('validate home', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
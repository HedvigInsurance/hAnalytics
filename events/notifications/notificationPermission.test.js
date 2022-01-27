const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        granted: true
    })
    expect(event).toMatchSnapshot()
});

test('validate not granted', () => {
    const event = validateEvent(__filename, {
        granted: false
    })
    expect(event).toMatchSnapshot()
});
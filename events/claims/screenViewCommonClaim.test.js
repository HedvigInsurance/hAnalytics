const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        iconName: "theft",
    })

    expect(event).toMatchSnapshot()
});
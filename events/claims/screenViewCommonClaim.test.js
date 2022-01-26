const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        id: "the_id",
    })

    expect(event).toMatchSnapshot()
});
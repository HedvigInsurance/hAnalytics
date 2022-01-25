const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        allIds: ["1", "2"],
        selectedIds: ["1", "2"]
    })

    expect(event).toMatchSnapshot()
});
const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        experiments: [
            {
                name: "test",
                enabled: true
            },
            {
                name: "test2",
                variant: "name"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});
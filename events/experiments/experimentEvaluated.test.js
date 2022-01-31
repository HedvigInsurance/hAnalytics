const validateEvent = require("../../commons/validateEvent.js")

test('validate variant', () => {
    const event = validateEvent(__filename, {
        name: "chat_provider",
        enabled: true,
        variant: "bot-service"
    })

    expect(event).toMatchSnapshot()
});

test('validate non variant', () => {
    const event = validateEvent(__filename, {
        name: "is_something_active",
        enabled: true,
        variant: null
    })

    expect(event).toMatchSnapshot()
});
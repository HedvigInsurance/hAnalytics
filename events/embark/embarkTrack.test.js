const validateEvent = require("../../commons/validateEvent.js")

test('validate', () => {
    const event = validateEvent(__filename, {
        storyName: "Test",
        eventName: "tracking",
        store: {
            "originatedFromEmbarkStory": "blabla"
        }
    })

    expect(event).toMatchSnapshot()
});
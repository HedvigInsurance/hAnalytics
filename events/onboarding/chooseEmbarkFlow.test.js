const validateEvent = require("../../commons/validateEvent.js")

test('validate chooseEmbarkFlow', () => {
    const event = validateEvent(__filename, {
        embarkStoryId: "embark_id"
    })

    expect(event).toMatchSnapshot()
});
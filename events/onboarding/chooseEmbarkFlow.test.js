const validateEvent = require("../../commons/validate-event.js")

test('validate chooseEmbarkFlow', () => {
    const event = validateEvent(__filename, {
        embarkStoryId: "embark_id"
    })

    expect(event).toMatchSnapshot()
});
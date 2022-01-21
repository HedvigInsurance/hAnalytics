const validateEvent = require("../../commons/validateEvent.js")

test('validate movingFlowIntro', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
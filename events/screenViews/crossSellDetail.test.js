const validateEvent = require("../../commons/validateEvent.js")

test('validate crossSellDetail', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
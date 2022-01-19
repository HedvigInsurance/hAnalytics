const validateEvent = require("../../commons/validate-event.js")

test('validate cross_sell_detail', () => {
    const event = validateEvent(__filename)
    expect(event).toMatchSnapshot()
});
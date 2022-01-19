const validateEvent = require("../../commons/validate-event.js")

test('validate insurance detail', () => {
    const event = validateEvent(__filename, {
        contractId: "28426fd4-8157-4efd-8e58-52d02a052b1e"
    })
    expect(event).toMatchSnapshot()
});
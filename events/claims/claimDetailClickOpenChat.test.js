const validateEvent = require("../../commons/validateEvent.js")

test('validate claimDetailClickOpenChat', () => {
    const event = validateEvent(__filename, {
        claimId: "id_of_claim",
        claimStatus: "status_of_claim"
    })

    expect(event).toMatchSnapshot()
});
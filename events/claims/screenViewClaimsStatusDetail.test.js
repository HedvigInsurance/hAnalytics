const validateEvent = require("../../commons/validateEvent.js")

test('validate claimsStatusDetailScreenView', () => {
    const event = validateEvent(__filename, {
        claimId: "id_of_claim",
        claimStatus: "status_of_claim"
    })

    expect(event).toMatchSnapshot()
});
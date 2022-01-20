const validateEvent = require("../../commons/validateEvent.js")

test('validate claimsDetailRecordingPlayed', () => {
    const event = validateEvent(__filename, {
        claimId: "id_of_claim"
    })

    expect(event).toMatchSnapshot()
});
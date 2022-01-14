const validateEvent = require("../../commons/validate-event.js")

test('one SE_ACCIDENT quote', () => {
    const event = validateEvent(__filename, {
        offerIds: ["123"]
    }, {
        quoteBundle: {
            quotes: [
                {
                    typeOfContract: "SE_ACCIDENT"
                }
            ]
        }
    })

    expect(event).toMatchSnapshot()
});

test('two different quotes', () => {
    const event = validateEvent(__filename, {
        offerIds: ["123", "12345"]
    }, {
        quoteBundle: {
            quotes: [
                {
                    typeOfContract: "SE_ACCIDENT"
                },
                {
                    typeOfContract: "SE_APARTMENT_BRF"
                }
            ]
        }
    })

    expect(event).toMatchSnapshot()
});
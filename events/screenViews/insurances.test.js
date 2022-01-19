const validateEvent = require("../../commons/validateEvent.js")

test('sets has_accident_insurance correctly for SE_ACCIDENT', () => {
    const event = validateEvent(__filename, {}, {
        contracts: [
            {
                typeOfContract: "SE_ACCIDENT"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});

test('sets has_accident_insurance correctly for DK_ACCIDENT', () => {
    const event = validateEvent(__filename, {}, {
        contracts: [
            {
                typeOfContract: "DK_ACCIDENT"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});

test('sets has_home_insurance correctly for SE_APARTMENT', () => {
    const event = validateEvent(__filename, {}, {
        contracts: [
            {
                typeOfContract: "SE_APARTMENT"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});

test('sets has_home_insurance correctly for SE_HOUSE', () => {
    const event = validateEvent(__filename, {}, {
        contracts: [
            {
                typeOfContract: "SE_HOUSE"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});

test('sets has_home_insurance correctly for NO_HOME_CONTENT_OWN', () => {
    const event = validateEvent(__filename, {}, {
        contracts: [
            {
                typeOfContract: "NO_HOME_CONTENT_OWN"
            }
        ]
    })

    expect(event).toMatchSnapshot()
});
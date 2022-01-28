const {
    getVariation
} = require("./experimentTools")

test('returns a deterministic variation based on trackingId', () => {
    const experimentA = {
        name: "experimentA",
        variations: [
            {
                name: "enabled",
                weight: 0.5
            },
            {
                name: "disabled",
                weight: 0.5
            }
        ]
    }

    const variationOne = getVariation(experimentA, "an_id")
    expect(variationOne).toMatchSnapshot()

    const variationTwo = getVariation(experimentA, "a_giraffe_was_here")
    expect(variationTwo).toMatchSnapshot()

    const variationThree = getVariation(experimentA, "an_owl_yay")
    expect(variationThree).toMatchSnapshot()

    const experimentB = {
        name: "experimentB",
        variations: [
            {
                name: "A",
                weight: 0.3
            },
            {
                name: "B",
                weight: 0.3
            },
            {
                name: "C",
                weight: 0.3
            }
        ]
    }

    Array.from(Array(50)).forEach((_, i) => {
        expect(getVariation(experimentB, `${i / 30 * 10000}`)).toMatchSnapshot()
    });
});

test('returns a variation based on criterias', () => {
    const experimentA = {
        name: "experimentA",
        variations: [
            {
                name: "enabled",
                criteria: "`true`"
            },
            {
                name: "disabled",
                weight: "`false`"
            }
        ]
    }

    const variationOne = getVariation(experimentA, "a_tracking_id")
    expect(variationOne).toMatchSnapshot()
})
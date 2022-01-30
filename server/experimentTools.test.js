const uuid = require("uuid")
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

    const randomRunExperiment = (experiment, numberOfItems) => {
        const variations = []
    
        Array.from(Array(numberOfItems)).forEach(() => {
            const id = uuid.v4()
            const variation = getVariation(experiment, id)
            variations.push(variation)

            // check that variation is deterministic
            expect(getVariation(experiment, id)).toEqual(variation)
        });
    
        experiment.variations.forEach(variation => {
            const numberOfVariations = variations.filter(innerVariation => innerVariation.name == variation.name).length
            expect(
                numberOfVariations / numberOfItems
            ).toBeCloseTo((numberOfItems * variation.weight) / numberOfItems, 0.9)
        })
    }

    randomRunExperiment({
        name: "experimentB",
        variations: [
            {
                name: "A",
                weight: 0.3
            },
            {
                name: "B",
                weight: 0.2
            },
            {
                name: "C",
                weight: 0.3
            },
            {
                name: "D",
                weight: 0.2
            }
        ]
    }, 99999)

    randomRunExperiment({
        name: "experimentC",
        variations: [
            {
                name: "A",
                weight: 0.7
            },
            {
                name: "B",
                weight: 0.3
            },
        ]
    }, 99999)

    randomRunExperiment({
        name: "experimentD",
        variations: [
            {
                name: "A",
                weight: 0.5
            },
            {
                name: "B",
                weight: 0.5
            },
        ]
    }, 500)

    randomRunExperiment({
        name: "experimentE",
        variations: [
            {
                name: "A",
                weight: 0.5
            },
            {
                name: "B",
                weight: 0.5
            },
        ]
    }, 50)

    randomRunExperiment({
        name: "experimentF",
        variations: [
            {
                name: "A",
                weight: 0.11
            },
            {
                name: "B",
                weight: 0.11
            },
            {
                name: "C",
                weight: 0.11
            },
            {
                name: "D",
                weight: 0.11
            },
            {
                name: "E",
                weight: 0.11
            },
            {
                name: "F",
                weight: 0.11
            },
            {
                name: "G",
                weight: 0.11
            },
            {
                name: "H",
                weight: 0.11
            },
            {
                name: "J",
                weight: 0.11
            },
        ]
    }, 5000)
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
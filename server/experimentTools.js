const jmespath = require('jmespath')
const md5 = require('md5');

const getVariationByTrackingIdAndWeight = (experiment, trackingId) => {
    const hash = md5(experiment.name + trackingId).substr(0,8);
    const parseHashToInt = parseInt("0x" + hash, 16);
    const maxInt = parseInt("0xffffffff", 16);
    const deterministicRandom = parseHashToInt / maxInt;

    let variations = [];
    let weights = experiment.variations.map(variation => variation.weight * 100)

    experiment.variations.forEach((item, index) => {
        var clone = Array(weights[index]).fill(item);
        variations.push(...clone);
    });

    return variations[~~(deterministicRandom * variations.length)]
}

const getVariation = (experiment, trackingId) => {
    if (experiment.variations[0].weight) {
        return getVariationByTrackingIdAndWeight(experiment, trackingId)
    }

    return experiment.variations.find(variation =>
        !!jmespath.search({}, variation.criteria)
    )
}

module.exports = {
    getVariation
}
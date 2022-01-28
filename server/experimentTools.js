const jmespath = require('jmespath')
const md5 = require('md5');

const getVariationByTrackingIdAndWeight = (experiment, trackingId) => {
    const hash = md5(experiment.name + trackingId).substr(0,8);
    const parseHashToInt = parseInt("0x" + hash, 16);
    const maxInt = parseInt("0xffffffff", 16);
    const deterministicRandom = parseHashToInt / maxInt;
    const arrayIndex = Math.floor(deterministicRandom * experiment.variations.length)
    return experiment.variations[arrayIndex]
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
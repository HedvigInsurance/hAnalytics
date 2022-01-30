const jmespath = require("jmespath");
const seedrandom = require("seedrandom");
const weighted = require('weighted')

const getVariationByTrackingIdAndWeight = (experiment, trackingId) => {
  const weights = experiment.variations.map(
    (variation) => variation.weight
  );

  return weighted.select(
      experiment.variations,
      weights,
      seedrandom(experiment.name + trackingId)
    )
};

const getVariation = (experiment, trackingId) => {
  if (experiment.variations[0].weight) {
    return getVariationByTrackingIdAndWeight(experiment, trackingId);
  }

  return experiment.variations.find(
    (variation) => !!jmespath.search({}, variation.criteria)
  );
};

module.exports = {
  getVariation,
};

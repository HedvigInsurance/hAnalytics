const jmespath = require("jmespath");
const seedrandom = require("seedrandom");

const getVariationByTrackingIdAndWeight = (experiment, trackingId) => {
  const myrng = seedrandom(experiment.name + trackingId);
  const deterministicRandom = myrng();

  let variations = [];
  let weights = experiment.variations.map(
    (variation) => variation.weight * 100
  );

  experiment.variations.forEach((item, index) => {
    var clone = Array(weights[index]).fill(item);
    variations.push(...clone);
  });

  return variations[~~(deterministicRandom * variations.length)];
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

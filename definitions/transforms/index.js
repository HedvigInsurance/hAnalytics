const screenViewOfferTransformer = require("./screenViewOfferTransformer");
const screenViewTransformer = require("./screenViewTransformer");
const deepcopy = require("deepcopy");

const transformers = [screenViewOfferTransformer, screenViewTransformer];

module.exports = (event) => {
  var stack = [];

  stack.push(
    transformers.reduce((event, transformer) => {
      if (transformer.shouldTransform(event)) {
        if (transformer.keepUntransformedEvent) {
          stack.push(deepcopy(event));
        }

        return transformer.transform(event);
      }

      return deepcopy(event);
    }, event)
  );

  return stack;
};

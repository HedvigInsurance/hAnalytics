const screenViewTransformer = require("./screenViewTransformer");

const transformers = [screenViewTransformer];

module.exports = (event) => {
  var stack = [];

  stack.push(
    transformers.reduce((event, transformer) => {
      if (transformer.shouldTransform(event)) {
        if (transformer.keepUntransformedEvent) {
          stack.push(event);
        }

        return transformer.transform(event);
      }

      return event;
    }, event)
  );

  return stack;
};

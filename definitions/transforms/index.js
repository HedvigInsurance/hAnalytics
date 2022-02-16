const screenViewTransformer = require("./screenViewTransformer");

const transformers = [screenViewTransformer];

module.exports = (event) =>
  transformers.reduce((event, transformer) => {
    if (transformer.shouldTransform(event)) {
      return transformer.transform(event);
    }

    return event;
  }, event);

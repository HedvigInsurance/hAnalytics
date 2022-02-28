const yaml = require("js-yaml");
const fs = require("fs");
const jmespath = require("jmespath");

module.exports = (path, inputData = {}, graphqlData) => {
  const event = yaml.load(
    fs.readFileSync(path.replace(".test.js", ".yml"), "utf8")
  );

  const inputVariables = (event.inputs ?? []).reduce((acc, input) => {
    acc[input.name] = inputData[input.argument];
    return acc;
  }, {});

  const constantVariables = (event.constants ?? []).reduce((acc, constant) => {
    acc[constant.name] = constant.value;
    return acc;
  }, {});

  const graphqlVariables = (event.graphql?.selectors || []).reduce(
    (acc, selector) => {
      acc[selector.name] = jmespath.search(graphqlData, selector.path);
      return acc;
    },
    {}
  );

  return {
    name: event.name,
    variables: {
      ...inputVariables,
      ...constantVariables,
      ...graphqlVariables,
    },
  };
};

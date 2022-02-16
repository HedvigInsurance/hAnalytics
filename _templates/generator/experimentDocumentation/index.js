const yaml = require("js-yaml");
const fs = require("fs");
const typeMaps = require("../../../commons/typeMaps");

module.exports = {
  params: async ({ args }) => {
    const experiment = yaml.load(fs.readFileSync(args.path, "utf8"));

    return {
      experiment,
      file: args.path.replace(".yml", ""),
      ...typeMaps,
    };
  },
};

const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");

const loadType = (importPath) => {
  const file = fs.readFileSync(importPath, "utf8");

  return yaml.load(file);
};

const types = glob.sync("definitions/types/**/*.yml").map(loadType);

module.exports = types;

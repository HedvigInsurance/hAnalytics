const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");

const loadTypes = async (importPath) => {
  const fileData = await new Promise((resolve, reject) => {
    fs.readFile(importPath, "utf8", (err, file) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(file);
    });
  });

  return yaml.load(fileData);
};

const getTypes = async () =>
  await new Promise((resolve) => {
    glob("definitions/types/**/*.yml", {}, async (_, files) => {
      const types = await Promise.all(files.map(loadTypes));
      resolve(types);
    });
  });

module.exports = getTypes;

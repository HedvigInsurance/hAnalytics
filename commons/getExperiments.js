const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");

const loadExperiment = async (importPath) => {
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

const getEvents = async () =>
  await new Promise((resolve) => {
    glob("definitions/experiments/**/*.yml", {}, async (_, files) => {
      const events = await Promise.all(files.map(loadExperiment));
      resolve(events);
    });
  });

module.exports = getEvents;

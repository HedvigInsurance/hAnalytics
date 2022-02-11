const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");

const loadEvent = async (importPath) => {
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
    glob("events/**/*.yml", {}, async (_, files) => {
      const events = await Promise.all(files.map(loadEvent));
      resolve(events);
    });
  });

module.exports = getEvents;

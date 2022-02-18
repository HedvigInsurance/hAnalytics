const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");
const typeMaps = require("./typeMaps");

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

  const event = yaml.load(fileData);

  if (event.inputs) {
    event.inputs = await Promise.all(
      event.inputs.map(async (input) => ({
        ...input,
        kotlinType: await typeMaps.kotlinTypeMap(input.type),
        swiftType: await typeMaps.swiftTypeMap(input.type),
      }))
    );
  }

  return event;
};

const getEvents = async () =>
  await new Promise((resolve) => {
    glob("definitions/events/**/*.yml", {}, async (_, files) => {
      const events = await Promise.all(files.map(loadEvent));
      resolve(events);
    });
  });

module.exports = getEvents;

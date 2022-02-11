const { snakeCase } = require("snake-case");

const flattenObj = (ob) => {
  if (typeof ob !== "object") {
    return ob;
  }

  let result = {};

  for (const i in ob) {
    if (ob[i] === null) {
      result[snakeCase(i)] = null;
    } else if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);

      for (const j in temp) {
        result[snakeCase(i) + "_" + snakeCase(j)] = temp[j];
      }
    } else if (Array.isArray(ob[i])) {
      result[snakeCase(i)] = ob[i].map(flattenObj);
    } else {
      result[snakeCase(i)] = ob[i];
    }
  }

  return result;
};

module.exports = flattenObj;

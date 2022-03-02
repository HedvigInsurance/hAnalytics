const removeNullValues = (obj) => {
  if (typeof obj !== "object") {
    return obj;
  }

  for (var propName in obj) {
    if (obj[propName] === null) {
      delete obj[propName];
    } else if (Array.isArray(obj[propName])) {
      obj[propName] = obj[propName].map(removeNullValues);
    } else if (typeof obj[propName] === "object") {
      obj[propName] = removeNullValues(obj[propName]);
    }
  }

  return obj;
};

module.exports = removeNullValues;

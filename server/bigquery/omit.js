var omit = (key, obj) => {
  if (Array.isArray(key)) {
    return key.reduce((acc, curr) => {
      return omit(curr, acc);
    }, obj);
  }

  const { [key]: omitted, ...rest } = obj;
  return rest;
};

module.exports = omit;

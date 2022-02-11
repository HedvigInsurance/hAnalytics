module.exports = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

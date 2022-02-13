module.exports = () => {
  var cache = {};

  const get = (key) => {
    return cache[key] || null;
  };

  const set = (key, value) => {
    cache[key] = value;
  };

  const reset = () => {
    cache = {};
  };

  return {
    get,
    set,
    reset,
  };
};

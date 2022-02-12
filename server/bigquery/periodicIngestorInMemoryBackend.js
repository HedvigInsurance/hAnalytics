var inMemoryStorage = [];

module.exports = {
  append: async (item) => {
    inMemoryStorage.push(item);
  },
  consume: async () => {
    var copy = [...inMemoryStorage];
    inMemoryStorage = [];
    return copy;
  },
};

const createInMemoryBackend = require("./periodicIngestorInMemoryBackend");

test("stores and consumes correctly", async () => {
  const inMemoryBackend = createInMemoryBackend();

  inMemoryBackend.append({
    mock: "mock",
  });

  expect(await inMemoryBackend.consume()).toMatchSnapshot();
  expect(await inMemoryBackend.consume()).toMatchSnapshot();

  [...new Array(5000)].forEach(() => {
    inMemoryBackend.append({
      mock: "mock",
    });
  });

  expect((await inMemoryBackend.consume()).length).toEqual(5000);
  expect((await inMemoryBackend.consume()).length).toEqual(0);
});

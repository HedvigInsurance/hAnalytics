const getEvents = require("../../../commons/getEvents");
const flattenObj = require("../flattenObj");
const createBigQueryConfigMock = require("../config.mock");
const eventToSchemaFields = require("./eventToSchemaFields");

test("creates schemas according to events", async () => {
  const events = await getEvents();
  const bigQueryConfig = createBigQueryConfigMock(events);

  for (event of events) {
    expect(await eventToSchemaFields(event, bigQueryConfig)).toMatchSnapshot(
      event.name
    );
  }
});

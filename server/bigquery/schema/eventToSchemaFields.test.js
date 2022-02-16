const getEvents = require("../../../commons/getEvents");
const flattenObj = require("../flattenObj");
const eventToSchemaFields = require("./eventToSchemaFields");

test("creates schemas according to events", async () => {
  const events = await getEvents();

  for (event of events) {
    expect(
      await eventToSchemaFields(
        event,
        flattenObj({
          property: {
            store: {
              an_item: "123",
            },
          },
        })
      )
    ).toMatchSnapshot(event.name);
  }
});

const getEvents = require("../../../commons/getEvents");
const flattenObj = require("../flattenObj");
const eventToSchemaFields = require("./eventToSchemaFields");

test("creates schemas according to events", async () => {
  const events = await getEvents();

  events.forEach((event) => {
    expect(
      eventToSchemaFields(
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
  });
});

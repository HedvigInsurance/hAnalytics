const flattenObj = require("../flattenObj");
const filterFieldsAccordingToEvent = require("./filterFieldsAccordingToEvent");
const createBigQueryConfigMock = require("../config.mock");

test("filters according to event", async () => {
  const bigQueryConfig = createBigQueryConfigMock([
    {
      name: "mock_event",
      inputs: [
        {
          name: "input_mock",
          type: "String",
        },
      ],
    },
    {
      name: "another_mock_event",
      inputs: [
        {
          name: "store",
          type: "Dictionary<String, Any>",
        },
      ],
    },
  ]);
  const events = await bigQueryConfig.getEvents();

  await Promise.all(
    events.map(async (event) => {
      expect(
        await filterFieldsAccordingToEvent(
          event,
          flattenObj({
            context_app_name: "Hedvig",
            property: {
              store: {
                an_item: "123",
              },
            },
          }),
          bigQueryConfig
        )
      ).toMatchSnapshot(event.name);
    })
  );
});

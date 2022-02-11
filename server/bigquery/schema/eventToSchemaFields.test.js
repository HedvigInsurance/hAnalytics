const getEvents = require("../../../commons/getEvents")
const eventToSchemaFields = require("./eventToSchemaFields")

test('creates schemas according to events', async () => {
    const events = await getEvents()
    
    events.forEach(event => {
        expect(eventToSchemaFields(event)).toMatchSnapshot(event.name)
    })
});
const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => !!event.event?.match(matchRegex),
  keepUntransformedEvent: true,
  transform: (event) => {
    const eventWithoutProperties = Object.keys(event).reduce((acc, curr) => {
      if (!curr.startsWith("property_")) {
        acc[curr] = event[curr];
      }
      return acc;
    }, {});

    return {
      ...eventWithoutProperties,
      event: "app_screen_view",
      event_id: `${event.event_id}-transformed-app_screen_view`,
      property_screen_name: event.event.replace(matchRegex, ""),
    };
  },
};

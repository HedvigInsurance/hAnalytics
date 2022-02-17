const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => !!event.event?.match(matchRegex),
  keepUntransformedEvent: true,
  transform: (event) => {
    return {
      ...event,
      event: "app_screen_view",
      event_id: `${event.event_id}-transformed-app_screen_view`,
      property: {
        screen_name: event.event.replace(matchRegex, ""),
      },
    };
  },
};

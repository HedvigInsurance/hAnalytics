const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => event.event.matches(matchRegex),
  transform: (event) => {
    return {
      ...event,
      event: "screen_view",
      property_screen_name: event.event_name.replace(matchRegex, ""),
    };
  },
};

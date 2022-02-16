const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => event.event.match(matchRegex),
  transform: (event) => {
    return {
      ...event,
      event: "app_screen_view",
      property_screen_name: event.event.replace(matchRegex, ""),
    };
  },
};

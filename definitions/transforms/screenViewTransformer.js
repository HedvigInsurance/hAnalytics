const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => {
    try {
      return !!event.event.name?.match(matchRegex);
    } catch (err) {
      return false;
    }
  },
  keepUntransformedEvent: true,
  transform: (event) => {
    return {
      ...event,
      event: {
        ...event.event,
        name: "app_screen_view",
        id: `${event.event.id}-transformed-app_screen_view`,
      },
      properties: {
        screen_name: event.event.name.replace(matchRegex, ""),
      },
    };
  },
};

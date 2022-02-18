const matchRegex = /^screen_view_/;

module.exports = {
  shouldTransform: (event) => !!event?.event?.name?.match(matchRegex),
  keepUntransformedEvent: true,
  transform: (event) => {
    return {
      ...event,
      event: {
        ...event.event,
        name: "app_screen_view",
        id: event?.event?.id
          ? `${event.event.id}-transformed-app_screen_view`
          : null,
      },
      properties: {
        screen_name: event?.event?.name?.replace(matchRegex, ""),
      },
    };
  },
};

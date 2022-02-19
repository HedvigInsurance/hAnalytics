const matchRegex = /^screen_view_offer$/;

module.exports = {
  shouldTransform: (event) => !!event?.event?.name?.match(matchRegex),
  keepUntransformedEvent: true,
  transform: (event) => {
    return {
      ...event,
      event: {
        ...event.event,
        name: "received_quotes",
        id: event?.event?.id
          ? `${event.event.id}-transformed-received_quotes`
          : null,
      },
      properties: {
        quote_ids: event?.properties?.offer_ids,
        type_of_contracts: event.properties?.type_of_contracts.split(","),
        initiated_from: event.properties?.initiated_from,
      },
    };
  },
};

export type hAnalyticsEvent = {
  name: string;
  properties?: { [name: string]: any };
  graphql?: { [name: string]: any };
};

export type hAnalyticsCollectResponse = {
  name: string;
  properties: { [name: string]: any };
};

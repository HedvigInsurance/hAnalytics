import { hAnalyticsConsumerContext } from "./hAnalyticsContext";
import { hAnalyticsCollectResponse } from "./hAnalyticsEvent";

export type hAnalyticsConfig = {
  httpHeaders: { [name: string]: string };
  endpointURL: string;
  context: hAnalyticsConsumerContext;
  onEvent?: (event: hAnalyticsCollectResponse) => void;
  userAgent: string;
};

import { hAnalyticsConsumerContext } from "./hAnalyticsContext";
import { hAnalyticsEvent } from "./hAnalyticsEvent";

export type hAnalyticsConfig = {
  httpHeaders: { [name: string]: string };
  endpointURL: string;
  context: hAnalyticsConsumerContext;
  onSend: (event: hAnalyticsEvent) => void;
};

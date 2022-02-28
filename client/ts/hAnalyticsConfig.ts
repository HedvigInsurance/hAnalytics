import { hAnalyticsContext } from "./hAnalyticsContext";
import { hAnalyticsEvent } from "./hAnalyticsEvent";

export type hAnalyticsConfig = {
  httpHeaders: { [name: string]: string };
  deviceId: string;
  endpointURL: string;
  context: hAnalyticsContext;
  onSend: (event: hAnalyticsEvent) => void;
};

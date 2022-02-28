import { hAnalyticsContext } from "./hAnalyticsContext";

export type hAnalyticsConfig = {
  httpHeaders: { [name: string]: string };
  deviceId: string;
  endpointURL: string;
  context: hAnalyticsContext;
};

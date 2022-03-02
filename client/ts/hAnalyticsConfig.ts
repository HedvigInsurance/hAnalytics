import { hAnalyticsConsumerContext } from "./hAnalyticsContext";
import { hAnalyticsCollectResponse } from "./hAnalyticsEvent";

export enum Environment {
  STAGING = "https://hanalytics-staging.herokuapp.com",
  PRODUCTION = "https://hanalytics-production.herokuapp.com",
  LOCAL = "http://localhost:3034"
}

export type hAnalyticsConfig = {
  httpHeaders: { [name: string]: string };
  environment: Environment;
  context: hAnalyticsConsumerContext;
  onEvent?: (event: hAnalyticsCollectResponse) => void;
  userAgent: string;
};

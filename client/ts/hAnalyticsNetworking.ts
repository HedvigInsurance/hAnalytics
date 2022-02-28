import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent } from "./hAnalyticsEvent";

export class hAnalyticsNetworking {
  static getConfig: () => hAnalyticsConfig;

  static async identify() {
    const config = this.getConfig();

    return fetch(config.endpointURL + "/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.httpHeaders,
      },
      body: JSON.stringify({
        trackingId: config.deviceId,
      }),
    }).then((res) => res.json());
  }

  static async send(event: hAnalyticsEvent) {
    const config = this.getConfig();

    const context = config.context;

    if (!context) {
      console.warn(
        "[hAnalytics] Context not setup, set hAnalyticsNetworking.context"
      );
      return;
    }

    config.onSend(event)

    return fetch(config.endpointURL + "/collect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.httpHeaders,
      },
      body: JSON.stringify({
        event: event,
        context: context,
      }),
    }).then((res) => res.json());
  }
}

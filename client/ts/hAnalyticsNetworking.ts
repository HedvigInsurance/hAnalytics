import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent } from "./hAnalyticsEvent";
import * as UAParser from "ua-parser-js"

export class hAnalyticsNetworking {
  static getConfig?: () => hAnalyticsConfig;

  static async identify() {
    if (!this.getConfig) {
        console.warn(
          "[hAnalytics] Not configurated, define hAnalyticsNetworking.getConfig"
        );
        return;
    }

    const config = this.getConfig();

    return fetch(config.endpointURL + "/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.httpHeaders,
      },
      body: JSON.stringify({
        trackingId: config.context.device.id,
      }),
    }).then((res) => res.json());
  }

  static async send(event: hAnalyticsEvent) {
    if (!this.getConfig) {
        console.warn(
          "[hAnalytics] Not configurated, define hAnalyticsNetworking.getConfig"
        );
        return;
    }

    const config = this.getConfig();

    const uaParser = new UAParser.UAParser()
    const device = uaParser.getDevice()
    const os = uaParser.getOS()

    const context = {
        ...config.context,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        device: {
            ...config.context.device,
            manufacturer: device.vendor,
            model: device.model,
            name: "browser",
            type: device.type,
            screen: {
                density: window.devicePixelRatio || 0,
                height: window.innerHeight || 0,
                width: window.innerWidth || 0,
            },
            os: {
                name: os.name,
                version: os.version
            }
        }
    };

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

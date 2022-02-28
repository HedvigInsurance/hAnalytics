import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent } from "./hAnalyticsEvent";
import * as UAParser from "ua-parser-js"
import { hAnalyticsContext } from "./hAnalyticsContext";
import { hAnalyticsExperiment } from "./hAnalyticsExperiment"

const constructContext = (): hAnalyticsContext => {
    if (!hAnalyticsNetworking.getConfig) {
        console.warn(
          "[hAnalytics] Not configurated, define hAnalyticsNetworking.getConfig"
        );
        return;
    }

    const config = hAnalyticsNetworking.getConfig()

    const uaParser = new UAParser.UAParser()
    const device = uaParser.getDevice()
    const os = uaParser.getOS()

    const context = {
        locale: config.context.locale,
        session: config.context.session,
        app: config.context.app,
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

    return context
}

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

    const context = constructContext()

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

  private static experimentsList?: hAnalyticsExperiment[] = null

  static async loadExperiments(filter: string[], onLoad: (success: boolean) => void) {
    if (!this.getConfig) {
        console.warn(
          "[hAnalytics] Not configurated, define hAnalyticsNetworking.getConfig"
        );
        return;
    }

    const config = this.getConfig();

    const context = constructContext()

      return fetch(config.endpointURL + "/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.httpHeaders,
        },
        body: JSON.stringify({
          trackingId: context.device.id,
          sessionId: context.session.id,
          appName: context.app.name,
          filter: filter,
          appVersion: context.app.version
        }),
      }).then((res) => res.json()).then(payload => {
        if (Array.isArray(payload)) {
            this.experimentsList = payload.map(item => ({ name: item.name, variant: item.variant }))
            onLoad(true)
        } else {
            onLoad(false)
        }
          
          
      });
  }

  static findExperimentByName(name: string): hAnalyticsExperiment | null {
    return this.experimentsList.find(experiment => experiment.name === name)
  }
}

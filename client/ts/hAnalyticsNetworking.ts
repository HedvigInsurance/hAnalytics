import * as UAParser from "ua-parser-js";
import fetch from "isomorphic-unfetch";

import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent, hAnalyticsCollectResponse } from "./hAnalyticsEvent";
import { hAnalyticsContext } from "./hAnalyticsContext";
import { hAnalyticsExperiment } from "./hAnalyticsExperiment";

export class hAnalyticsNetworking {
  getConfig: () => hAnalyticsConfig;

  constructor(getConfig: () => hAnalyticsConfig) {
    this.getConfig = getConfig;
  }

  async identify() {
    const config = this.getConfig();

    try {
      await fetch(config.environment + "/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": config.context.acceptLanguage,
          ...config.httpHeaders,
        },
        body: JSON.stringify({
          trackingId: config.context.device.id,
        }),
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  constructContext(): hAnalyticsContext {
    const config = this.getConfig();

    const uaParser = new UAParser.UAParser(config.userAgent);
    const device = uaParser.getDevice();
    const os = uaParser.getOS();

    var safeWindow: any;

    if (typeof window !== "undefined") {
      safeWindow = window;
    } else {
      safeWindow = null;
    }

    const context = {
      locale: config.context.locale,
      session: config.context.session,
      app: config.context.app,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      device: {
        ...config.context.device,
        manufacturer: device.vendor,
        model: device.model,
        name: device.type,
        type: "browser",
        screen: {
          density: safeWindow?.devicePixelRatio || 0,
          height: safeWindow?.innerHeight || 0,
          width: safeWindow?.innerWidth || 0,
        },
        os: {
          name: os.name,
          version: os.version,
        },
      },
    };

    return context;
  }

  async send(event: hAnalyticsEvent) {
    const config = this.getConfig();
    const context = this.constructContext();

    try {
      const response = await fetch(config.environment + "/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": config.context.acceptLanguage,
          ...config.httpHeaders,
        },
        body: JSON.stringify({
          event: event,
          context: context,
        }),
      }).then((res) => res.json());

      const collectReponse: hAnalyticsCollectResponse = {
        name: response.event.name,
        properties: response.properties,
      };

      config.onEvent(collectReponse);

      return true;
    } catch (err) {
      return false;
    }
  }

  private experimentsList?: hAnalyticsExperiment[] = null;

  bootstrapExperiments(experimentsList: hAnalyticsExperiment[]) {
    this.experimentsList = experimentsList;
  }

  async loadExperiments(filter: string[]): Promise<hAnalyticsExperiment[]> {
    if (!this.getConfig) {
      console.warn(
        "[hAnalytics] Not configurated, define hAnalyticsNetworking.getConfig"
      );
      return;
    }

    const config = this.getConfig();
    const context = this.constructContext();

    try {
      return fetch(config.environment + "/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": config.context.acceptLanguage,
          ...config.httpHeaders,
        },
        body: JSON.stringify({
          trackingId: context.device.id,
          sessionId: context.session.id,
          appName: context.app.name,
          filter: filter,
          appVersion: context.app.version,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((payload) => {
          if (Array.isArray(payload)) {
            this.experimentsList = payload.map((item) => ({
              name: item.name,
              variant: item.variant,
            }));
            return this.experimentsList;
          } else {
            return [];
          }
        });
    } catch (err) {
      return [];
    }
  }

  findExperimentByName(name: string): hAnalyticsExperiment | null {
    return this.experimentsList.find((experiment) => experiment.name === name);
  }
}

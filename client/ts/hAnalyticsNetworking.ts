import * as UAParser from "ua-parser-js";
import fetch from "cross-fetch";

import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent } from "./hAnalyticsEvent";
import { hAnalyticsContext } from "./hAnalyticsContext";
import { hAnalyticsExperiment } from "./hAnalyticsExperiment";

export class hAnalyticsNetworking {
  getConfig: () => hAnalyticsConfig;

  constructor(getConfig: () => hAnalyticsConfig) {
    this.getConfig = getConfig;
  }

  async identify() {
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

  constructContext(): hAnalyticsContext {
    const config = this.getConfig();

    const uaParser = new UAParser.UAParser();
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
        name: "browser",
        type: device.type,
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

    config.onSend(event);

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
    });
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
        appVersion: context.app.version,
      }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (Array.isArray(payload)) {
          this.experimentsList = payload.map((item) => ({
            name: item.name,
            variant: item.variant,
          }));
          return this.experimentsList;
        } else {
          throw new Error("Couldn't load experiments");
        }
      });
  }

  findExperimentByName(name: string): hAnalyticsExperiment | null {
    return this.experimentsList.find((experiment) => experiment.name === name);
  }
}

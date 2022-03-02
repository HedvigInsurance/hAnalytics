import { hAnalyticsTrackers } from "./hAnalyticsTrackers";
import { hAnalyticsNetworking } from "./hAnalyticsNetworking";
import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsExperiments } from "./hAnalyticsExperiments";
import { hAnalyticsExperiment } from "./hAnalyticsExperiment"

import * as React from "react"
import { createContext, useContext, FunctionComponent, useEffect, useState } from "react"

type hAnalytics = {
  trackers: hAnalyticsTrackers;
  experiments: hAnalyticsExperiments;
};

const HAnalyticsContext = createContext<hAnalytics>(null);

type HAnalyticsProviderProps = {
  getConfig: () => hAnalyticsConfig,
  bootstrapExperiments?: hAnalyticsExperiment[];
}

const browserVisibilityEvent: (document: Document & {msHidden?: boolean; webkitHidden?: boolean}) => string = (document) => {
  if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    return "visibilitychange"
  } else if (typeof document.msHidden !== "undefined") {
    return "msvisibilitychange"
  } else if (typeof document.webkitHidden !== "undefined") {
    return "webkitvisibilitychange"
  }
}

export const HAnalyticsProvider: FunctionComponent<HAnalyticsProviderProps> = (props) => {
  const networking = new hAnalyticsNetworking(props.getConfig);
  const trackers = new hAnalyticsTrackers(networking)
  const experiments = new hAnalyticsExperiments(trackers, networking, props.bootstrapExperiments)

  const [_, setExperimentsLoading] = useState(experiments.loading)

  useEffect(() => {
    trackers.identify()
    trackers.appStarted()
    experiments.load().then(() => {
      setExperimentsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }

    const visibilityChange = browserVisibilityEvent(document)

    const handler = () => {
      if (document.hidden) {
        trackers.appBackground()
      } else {
        trackers.appResumed()
      }
    }

    document.addEventListener(visibilityChange, handler, false)

    return () => {
      document.removeEventListener(visibilityChange, handler)
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handler = () => {
      trackers.pageView(
        window.location.href,
        window.location.pathname,
        window.location.hostname
      )
    }

    window.addEventListener("locationchange", handler, false)

    return () => {
      window.removeEventListener("locationchange", handler)
    }
  })

  return <HAnalyticsContext.Provider value={{
    trackers,
    experiments,
  }}>
  {props.children}
</HAnalyticsContext.Provider>
}

export const bootstrapExperiments: (getConfig: () => hAnalyticsConfig) => Promise<hAnalyticsExperiment[]> = (getConfig) => {
  const networking = new hAnalyticsNetworking(getConfig);
  const trackers = new hAnalyticsTrackers(networking)
  const experiments = new hAnalyticsExperiments(trackers, networking)
  return experiments.load()
}

export const useHAnalytics = (): hAnalytics => {
  const hAnalyticsContext = useContext(HAnalyticsContext)
  return hAnalyticsContext
};

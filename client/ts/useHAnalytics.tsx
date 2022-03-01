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

export const HAnalyticsProvider: FunctionComponent<HAnalyticsProviderProps> = (props) => {
  const networking = new hAnalyticsNetworking(props.getConfig);
  const trackers = new hAnalyticsTrackers(networking)
  const experiments = new hAnalyticsExperiments(trackers, networking, props.bootstrapExperiments)

  const [_, setExperimentsLoading] = useState(experiments.loading)

  useEffect(() => {
    trackers.identify()
    experiments.load().then(() => {
      setExperimentsLoading(false)
    })
  }, [])

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

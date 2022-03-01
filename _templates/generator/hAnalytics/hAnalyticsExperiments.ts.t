---
to: client/ts/hAnalyticsExperiments.ts
---
import { hAnalyticsTrackers } from "./hAnalyticsTrackers"
import { hAnalyticsExperiment } from "./hAnalyticsExperiment"
import { hAnalyticsNetworking } from "./hAnalyticsNetworking"

<% experiments.js.filter(experiment => experiment.variants.length > 0).forEach(function(experiment) { %>
    <%- stringToSwiftComment(experiment.description) || "/// no description given" %>
    export enum <%= experiment.enumName %> {
       <% experiment.variants.forEach(function(variant) { %>
            <%= snakeCase(variant.case).toUpperCase() %> = "<%= variant.name %>",
       <% }) %>
    }
<% }) %>

export class hAnalyticsExperiments {
    private trackers: hAnalyticsTrackers
    private networking: hAnalyticsNetworking
    loading: boolean = true

    constructor(
        trackers: hAnalyticsTrackers,
        networking: hAnalyticsNetworking,
        bootstrapList?: hAnalyticsExperiment[]
    ) {
        this.trackers = trackers
        this.networking = networking
        this.networking.bootstrapExperiments(bootstrapList)
        this.loading = bootstrapList ? false : true
    }

    // loads all experiments from server
    async load(): Promise<hAnalyticsExperiment[]> {
        const list = await this.networking.loadExperiments(
            [<%- experiments.swift.map(experiment => `"${experiment.name}"`).join(",") %>]
        )
        this.loading = false
        return list
    }

<% experiments.js.forEach(function(experiment) { %>
    <% if (experiment.variants.length > 0) { %>
    <%- - stringToJSComment(experiment.description) || "/// no description given" %>
    <%= experiment.accessor %>(): <%= experiment.enumName %> {
        const experiment = this.networking.findExperimentByName("<%= experiment.name %>")
        const variant = <%= experiment.enumName %>[experiment.variant]

        if (variant) {
            this.trackers.experimentEvaluated(
               "<%= experiment.name %>",
               variant
            )

            return variant
        }

        return <%= experiment.enumName %>.<%= snakeCase(experiment.defaultFallback).toUpperCase() %>
    }
    <% } else { %>
    <%- - stringToJSComment(experiment.description) || "/// no description given" %>
    <%= experiment.accessor %>(): boolean {
        const experiment = this.networking.findExperimentByName("<%= experiment.name %>")
        const variant = experiment.variant

        if (variant) {
            this.trackers.experimentEvaluated(
               "<%= experiment.name %>",
               variant
            )
            
            return variant == "enabled"
        }

        this.trackers.experimentEvaluated(
            "<%= experiment.name %>",
            "<%= experiment.defaultFallback %>"
        )

        return <%= experiment.defaultFallback == "enabled" ? "true" : "false" %>
    }
    <% } %>
<% }) %>
}
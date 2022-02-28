---
to: client/ts/hAnalyticsExperiments.ts
---
import { hAnalyticsTrackers } from "./hAnalyticsTrackers"
import { hAnalyticsNetworking } from "./hAnalyticsNetworking"

<% experiments.js.filter(experiment => experiment.variants.length > 0).forEach(function(experiment) { %>
    <%- stringToSwiftComment(experiment.description) || "/// no description given" %>
    enum <%= experiment.enumName %> {
       <% experiment.variants.forEach(function(variant) { %>
            <%= snakeCase(variant.case).toUpperCase() %> = "<%= variant.name %>",
       <% }) %>
    }
<% }) %>

export class hAnalyticsExperiments {
// loads all experiments from server
static load(onLoad: (success: boolean) => void) {
    hAnalyticsNetworking.loadExperiments([<%- experiments.swift.map(experiment => `"${experiment.name}"`).join(",") %>], onLoad)
}

<% experiments.js.forEach(function(experiment) { %>
    <% if (experiment.variants.length > 0) { %>
    <%- - stringToJSComment(experiment.description) || "/// no description given" %>
    static <%= experiment.accessor %>(): <%= experiment.enumName %> {
        const experiment = hAnalyticsNetworking.findExperimentByName("<%= experiment.name %>")
        const variant = <%= experiment.enumName %>[experiment.variant]

        if (variant) {
            hAnalyticsTrackers.experimentEvaluated(
               "<%= experiment.name %>",
               variant
            )

            return variant
        }

        return <%= experiment.enumName %>.<%= snakeCase(experiment.defaultFallback).toUpperCase() %>
    }
    <% } else { %>
    <%- - stringToJSComment(experiment.description) || "/// no description given" %>
    static <%= experiment.accessor %>(): boolean {
        const experiment = hAnalyticsNetworking.findExperimentByName("<%= experiment.name %>")
        const variant = experiment.variant

        if (variant) {
            hAnalyticsTrackers.experimentEvaluated(
               "<%= experiment.name %>",
               variant
            )
            
            return variant == "enabled"
        }

        hAnalyticsTrackers.experimentEvaluated(
            "<%= experiment.name %>",
            "<%= experiment.defaultFallback %>"
        )

        return <%= experiment.defaultFallback == "enabled" ? "true" : "false" %>
    }
    <% } %>
<% }) %>
}
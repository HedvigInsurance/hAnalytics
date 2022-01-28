---
to: swift/hAnalyticsExperiment.swift
---
import Foundation

<% experiments.forEach(function(experiment) { %>
    /// <%= experiment.description || "no description given" %>
    public enum <%= experiment.enumName %>: String {
       <% experiment.variations.forEach(function(variation) { %>
        case <%= variation.case %> = "<%= variation.name %>"
       <% }) %>
    }
<% }) %>

public struct hAnalyticsExperiment {
// loads all experiments from server
public static func load(onComplete: @escaping () -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
}

<% experiments.forEach(function(experiment) { %>
    /// <%- experiment.description || "no description given" %>
    public static func <%= experiment.accessor %>() -> <%= experiment.enumName %> {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let variation = <%= experiment.enumName %>(rawValue: experiment["variation"] ?? "") {
           hAnalyticsEvent.experimentShown(
               name: "<%= experiment.name %>",
               variation: variation.rawValue
            ).send()
           
           return variation
       }

       let variation = <%= experiment.enumName %>.<%= experiment.defaultVariation.case %>

        hAnalyticsEvent.experimentShown(
            name: "<%= experiment.name %>",
            variation: variation.rawValue
        ).send()

        // fall back to default: <%= experiment.defaultVariation.case %>
       return variation
    }
<% }) %>
}
---
to: swift/hAnalyticsExperiment.swift
---
import Foundation

<% experiments.filter(experiment => experiment.variants.length > 0).filter(experiment => experiment.targets.includes("Swift")).forEach(function(experiment) { %>
    /// <%= experiment.description || "no description given" %>
    public enum <%= experiment.enumName %>: String {
       <% experiment.variants.forEach(function(variant) { %>
        case <%= variant.case %> = "<%= variant.name %>"
       <% }) %>
    }
<% }) %>

public struct hAnalyticsExperiment {
// loads all experiments from server
public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(filter: [<%- experiments.map(experiment => `"${experiment.name}"`).join(",") %>], onComplete: onComplete)
}

<% experiments.filter(experiment => experiment.targets.includes("Swift")).forEach(function(experiment) { %>
    <% if (experiment.variants.length > 0) { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: <%= experiment.enumName %> {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let variant = <%= experiment.enumName %>(rawValue: experiment["variant"] ?? "") {
           hAnalyticsEvent.experimentEvaluated(
               name: "<%= experiment.name %>",
               variant: variant.rawValue
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "<%= experiment.name %>",
            variant: <%= experiment.enumName %>.<%= experiment.defaultFallback %>.rawValue
       ).send()

        return .<%= experiment.defaultFallback %>
    }
    <% } else { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "<%= experiment.name %>",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "<%= experiment.name %>",
            variant: "<%= experiment.defaultFallback %>"
        ).send()

       return <%= experiment.defaultFallback == "enabled" ? "true" : "false" %>
    }
    <% } %>
<% }) %>
}
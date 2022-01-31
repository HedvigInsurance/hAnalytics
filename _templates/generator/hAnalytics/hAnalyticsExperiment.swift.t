---
to: swift/hAnalyticsExperiment.swift
---
import Foundation

<% experiments.filter(experiment => experiment.variants.length > 0).forEach(function(experiment) { %>
    /// <%= experiment.description || "no description given" %>
    public enum <%= experiment.enumName %>: String {
       <% experiment.variants.forEach(function(variant) { %>
        case <%= variant.case %> = "<%= variant.name %>"
       <% }) %>
       case disabled = "disabled"
    }
<% }) %>

public struct hAnalyticsExperiment {
// loads all experiments from server
public static func load(onComplete: @escaping () -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
}

<% experiments.forEach(function(experiment) { %>
    <% if (experiment.variants.length > 0) { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: <%= experiment.enumName %> {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let variant = <%= experiment.enumName %>(rawValue: experiment["variant"] ?? "") {
           hAnalyticsEvent.experimentEvaluated(
               name: "<%= experiment.name %>",
               enabled: experiment["variant"] == "disabled" ? false : true,
               variant: variant.rawValue
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "<%= experiment.name %>",
            enabled: <%= experiment.defaultFallback.name == 'disabled' ? "false" : "true" %>,
            variant: <%= experiment.enumName %>.<%= experiment.defaultFallback.name %>.rawValue
       ).send()

        return .<%= experiment.defaultFallback.name %>
    }
    <% } else { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let enabled = experiment["enabled"] as? Bool {
            hAnalyticsEvent.experimentEvaluated(
                name: "<%= experiment.name %>",
                enabled: enabled,
                variant: nil
            ).send()
           
           return enabled
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "<%= experiment.name %>",
            enabled: <%= experiment.defaultFallback.enabled %>,
            variant: nil
        ).send()

       return <%= experiment.defaultFallback.enabled %>
    }
    <% } %>
<% }) %>
}
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
           hAnalyticsEvent.experimentVariantEvaluated(
               name: "<%= experiment.name %>",
               variant: variant.rawValue
            ).send()
           
           return variant
       }

        return .<%= experiment.defaultFallback.name %>
    }
    <% } else { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let isEnabled = experiment["enabled"] as? Bool {
           hAnalyticsEvent.experimentEnabledEvaluated(
               name: "<%= experiment.name %>",
               isEnabled: isEnabled
            ).send()
           
           return isEnabled
       }

       return <%= experiment.defaultFallback.enabled %>
    }
    <% } %>
<% }) %>
}
---
to: swift/hAnalyticsExperiment.swift
---
import Foundation

<% experiments.swift.filter(experiment => experiment.variants.length > 0).forEach((experiment) => { %>
    /// <%= experiment.description || "no description given" %>
    public enum <%= experiment.enumName %> {
       <% experiment.variants.forEach(function(variant) { %>
            case <%- variant.caseWithAssociatedValues %>
       <% }) %>

       var variantIdentifier: String {
           switch self {
                <% experiment.variants.forEach((variant) => { %>
                    case .<%= variant.case %>:
                        return "<%- variant.name %>"
                <% }) %>
           }
       }

       static func decode(_ payload: [String: Any]) -> Self? {
           <% experiment.variants.forEach((variant) => { %>
                    <% if (variant.associatedValues) { %>
                        if let variant = payload["variant"] as? String,
                            let associatedValues = payload["associated_values"] as? [String: Any],
                            variant == "<%= variant.name %>",
                            <%- variant.decoderValuesString %> {
                            return .<%= variant.caseWithAssociatedValuesConstructor %>
                        }
                    <% } else { %>
                        if let variant = payload["variant"] as? String, variant == "<%= variant.name %>" {
                            return .<%= variant.case %>
                        }
                    <% } %>
            <% }) %>

            return nil
       }
    }
<% }) %>

public struct hAnalyticsExperiment {
// loads all experiments from server
public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(filter: [<%- experiments.swift.map(experiment => `"${experiment.name}"`).join(",") %>], onComplete: onComplete)
}

<% experiments.swift.forEach((experiment) => { %>
    <% if (experiment.variants.length > 0) { %>
    /// <%- experiment.description || "no description given" %>
    public static var <%= experiment.accessor %>: <%= experiment.enumName %> {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "<%= experiment.name %>"
       }), let variant = <%= experiment.enumName %>.decode(experiment) {
           hAnalyticsEvent.experimentEvaluated(
               name: "<%= experiment.name %>",
               variant: variant.variantIdentifier
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "<%= experiment.name %>",
            variant: <%= experiment.enumName %>.<%= experiment.defaultFallback.caseWithAssociatedValues %>.variantIdentifier
       ).send()

        return .<%= experiment.defaultFallback.caseWithAssociatedValues %>
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
            variant: "<%= experiment.defaultFallback.name %>"
        ).send()

       return <%= experiment.defaultFallback.name == "enabled" ? "true" : "false" %>
    }
    <% } %>
<% }) %>
}
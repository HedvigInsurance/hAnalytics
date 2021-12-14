---
to: swift/hAnalytics.swift
---
import Foundation

public struct hAnalyticsProviders {
    /// The function that is called when a tracking event should be sent
    /// Use this to integrate with analytics provider
    public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

    /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
    public static var performGraphQLQuery: (_ query: String, _ variables: [String: Any], _ onComplete: @escaping (_ data: ResultMap) -> Void) -> Void = { _, _, _ in }
}

public protocol hAnalyticsProperty {}

extension Array: hAnalyticsProperty where Element: hAnalyticsProperty {}
extension String: hAnalyticsProperty {}
extension Float: hAnalyticsProperty {}
extension Int: hAnalyticsProperty {}
extension Date: hAnalyticsProperty {}

public struct hAnalyticsEvent {
    let name: String
    let properties: [String: Any]
}

typealias AnalyticsClosure = () -> Void

struct hAnalytics {
<% events.forEach(function(event) { %>
    public static func <%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${input.type}`).join(",") %>) -> AnalyticsClosure {
        return {
        <% if(event.graphql) { %>
                let properties: [String: Any] = [
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>": <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>": <%= constant.value %>,
                    <% }); %>
                    <%= !event.inputs && !event.constants ? ":" : "" %>
                ]

                hAnalyticsProviders.performGraphQLQuery("<%= event.graphql.query.replace(/(\r\n|\n|\r)/gm, "") %>", properties) { data in
                    let graphqlProperties = [
                        <% event.graphql.getters.forEach(function(getter) { %>
                            "<%= getter.name %>": data.getValue(at: "<%= getter.getter %>"),
                        <% }); %>
                    ].compactMapValues { $0 }

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name: "<%= event.name %>",
                        properties: properties.merging(
                            graphqlProperties,
                            uniquingKeysWith: { _, rhs in rhs}
                        ).compactMapValues { any in
                            any as? hAnalyticsProperty
                        }
                    ))
                }
        <% } else { %>
                let properties: [String: Any] = [
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>": <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>": <%= constant.value %>,
                    <% }); %>
                    <%= !event.inputs && !event.constants ? ":" : "" %>
                ]

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                    name: "<%= event.name %>",
                    properties: properties.compactMapValues { any in
                    any as? hAnalyticsProperty
                }))
        <% } %>
        }
   }
<% }) %>
}


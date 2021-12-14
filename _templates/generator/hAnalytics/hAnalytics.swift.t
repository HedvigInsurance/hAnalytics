---
to: swift/hAnalytics.swift
---
import Foundation

public struct hAnalyticsProviders {
    /// The function that is called when a tracking event should be sent
    /// Use this to integrate with analytics provider
    public static var sendEvent: (_ name: String, _ properties: [String: hAnalyticsProperty]) -> Void = { _, _ in }

    /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
    public static var performGraphQLQuery: (_ query: String, _ variables: [String: Any], _ onComplete: @escaping (_ data: ResultMap) -> Void) -> Void = { _, _, _ in }
}

public protocol hAnalyticsProperty {}

extension Array: hAnalyticsProperty where Element: hAnalyticsProperty {}
extension String: hAnalyticsProperty {}
extension Float: hAnalyticsProperty {}
extension Int: hAnalyticsProperty {}
extension Date: hAnalyticsProperty {}

struct hAnalytics {
<% events.forEach(function(event) { %>
   public static func <%= event.accessor %>(<%= event.inputs.map((input) => `${input.argument}: ${input.type}`) %>) {
       <% if(event.graphql) { %>
            let properties: [String: Any] = [
                <% event.inputs.forEach(function(input) { %>
                        "<%= input.name %>": <%= input.argument %>,
                <% }); %>
                <% event.constants.forEach(function(constant) { %>
                        "<%= constant.name %>": <%= constant.value %>,
                <% }); %>
            ]

            hAnalyticsProviders.performGraphQLQuery("""
            <%= event.graphql.query %>
            """, properties) { data in
                let graphqlProperties = [
                    <% event.graphql.getters.forEach(function(getter) { %>
                        "<%= getter.name %>": data.getValue(at: "<%= getter.getter %>"),
                    <% }); %>
                ].compactMapValues { $0 }

                hAnalyticsProviders.sendEvent("<%= event.name %>", properties.merging(
                    graphqlProperties,
                    uniquingKeysWith: { _, rhs in rhs}
                ).compactMapValues { any in
                    any as? hAnalyticsProperty
                })
            }
       <% } else { %>
            let properties: [String: Any] = [
                <% event.inputs.forEach(function(input) { %>
                        "<%= input.name %>": <%= input.argument %>,
                <% }); %>
                <% event.constants.forEach(function(constant) { %>
                        "<%= constant.name %>": <%= constant.value %>,
                <% }); %>
            ]

            hAnalyticsProviders.sendEvent("<%= event.name %>", properties.compactMapValues { any in
                any as? hAnalyticsProperty
            })
       <% } %>
   }
<% }) %>
}


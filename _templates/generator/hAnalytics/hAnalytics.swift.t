---
to: swift/hAnalytics.swift
---
import Foundation
import JMESPath

public struct hAnalyticsProviders {
    /// The function that is called when a tracking event should be sent
    /// Use this to integrate with analytics provider
    public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

    /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
    public static var performGraphQLQuery: (_ query: String, _ variables: [String: Any?], _ onComplete: @escaping (_ data: Any?) -> Void) -> Void = { _, _, _ in }
}

public struct hAnalyticsEvent {
    public let name: String
    public let properties: [String: Any?]
}

public struct AnalyticsClosure {
    /// sends the event instantly
    public let send: () -> Void
}

extension hAnalyticsEvent {
<% events.forEach(function(event) { %>
    /// <%= event.description || "no description given" %>
    public static func <%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap[input.type]}`).join(",") %>) -> AnalyticsClosure {
        return AnalyticsClosure {
        <% if(event.graphql) { %>
                let properties: [String: Any?] = [
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>": <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>": <%= constant.value %>,
                    <% }); %>
                    <%= !event.inputs && !event.constants ? ":" : "" %>
                ]

                <% const graphQLInputs = (event.inputs ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>
                <% const graphQLConstants = (event.constants ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>

                let graphQLVariables: [String: Any?] = [
                    <% graphQLInputs.forEach(function(input) { %>
                            "<%= input.name %>": <%= input.argument %>,
                    <% }); %>
                    <% graphQLConstants.forEach(function(constant) { %>
                            "<%= constant.name %>": <%= constant.value %>,
                    <% }); %>
                    <%= !graphQLConstants && !graphQLInputs ? ":" : "" %>
                ]

                hAnalyticsProviders.performGraphQLQuery("""
                <%- formatGQL(event.graphql.query) %>
                """, graphQLVariables) { data in
                    let graphqlProperties: [String: Any?]

                    if let data = data {
                        graphqlProperties= [
                        <% event.graphql.selectors.forEach(function(selector) { %>
                            "<%= selector.name %>": try? (try? JMESExpression.compile("<%- selector.path %>"))?.search(object: data),
                        <% }); %>
                        ]
                    } else {
                        graphqlProperties = [:]
                    }

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name: "<%= event.name %>",
                        properties: properties.merging(
                            graphqlProperties,
                            uniquingKeysWith: { _, rhs in rhs}
                        )
                    ))
                }
        <% } else { %>
                let properties: [String: Any?] = [
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
                    properties: properties
                ))
        <% } %>
        }
   }
<% }) %>
}


---
to: swift/hAnalytics.swift
---
import Foundation
import JMESPath

public struct hAnalyticsEvent {
    public let name: String
    public let properties: [String: Any?]
    public let graphql: [String: Any]? = nil
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
                    <%= graphQLConstants.length === 0 && graphQLInputs.length === 0 ? ":" : "" %>
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "<%= event.name %>",
                    properties: properties,
                    graphql: [
                        "query": """
                        <%- formatGQL(event.graphql.query) %>
                        """,
                        "selectors": [
                            <% event.graphql.selectors.forEach(function(selector) { %>
                            ["name": "<%= selector.name %>", "path": "<%- selector.path %>"],
                            <% }); %>
                        ],
                        "variables": graphQLVariables
                    ]
                ))
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

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "<%= event.name %>",
                    properties: properties
                ))
        <% } %>
        }
   }
<% }) %>
}


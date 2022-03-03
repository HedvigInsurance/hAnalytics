---
to: swift/hAnalyticsEvent.swift
---
import Foundation

public struct hAnalyticsEvent {
    public let name: String
    public let properties: [String: Any?]
    public let graphql: [String: Any]?

    public init(name: String, properties: [String: Any?], graphql: [String: Any]? = nil) {
        self.name = name
        self.properties = properties
        self.graphql = graphql
    }
}

public struct hAnalyticsParcel {
    var sender: () -> Void

    init(_ sender: @escaping () -> Void) {
        self.sender = sender
    }

    /// sends the event instantly
    public func send() {
        sender()
    }
}

<% customTypes.forEach((type) => { %>

    <% if (type.type === "Enum") { %>

        <%- stringToSwiftComment(type.description) || "no description given" %>
        public enum <%= type.name %>: <%- swiftTypeMap(type.rawType) %> {
            <% Object.keys(type.cases).forEach((enumCaseKey) => { %>
                case <%- decapitalizeFirstLetter(pascalCase(enumCaseKey)) %> = <%- swiftLiteral(type.cases[enumCaseKey], type.rawType) %>
            <% }) %>
        }

    <% } %>


<% }) %>

extension hAnalyticsEvent {
    /// identifies and registers the trackingId
    public static func identify() {
        hAnalyticsNetworking.identify()
    }

<% events.swift.forEach(function(event) { %>
    <%- stringToSwiftComment(event.description) || "no description given" %>
    <%- event.deprecationReason ? `@available(*, deprecated, message: "${event.deprecationReason}")` : "" %>
    public static func <%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap(input.type)}`).join(",") %>) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        <% if(event.graphql) { %>
                let properties: [String: Any?] = [
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>": <%= swiftInputToGetter(input) %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>": <%= swiftLiteral(constant.value, constant.type) %>,
                    <% }); %>
                    <%= !event.inputs && !event.constants ? ":" : "" %>
                ]

                <% const graphQLInputs = (event.inputs ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>
                <% const graphQLConstants = (event.constants ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>

                let graphQLVariables: [String: Any?] = [
                    <% graphQLInputs.forEach(function(input) { %>
                            "<%= input.name %>": <%= swiftInputToGetter(input) %>,
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
                        <%- dedent(formatGQL(event.graphql.query)) %>
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
                            "<%= input.name %>": <%- swiftInputToGetter(input) %>,
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


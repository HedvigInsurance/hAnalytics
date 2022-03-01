---
to: client/ts/hAnalyticsTrackers.ts
---
import { hAnalyticsNetworking } from "./hAnalyticsNetworking"

<% customTypes.forEach((type) => { %>
    <% if (type.type === "Enum") { %>
        <%- stringToJSComment(type.description) || "no description given" %>
        export enum <%= type.name %> {
            <% Object.keys(type.cases).forEach((enumCaseKey) => { %>
                <%- snakeCase(enumCaseKey).toUpperCase() %> = <%- jsLiteral(type.cases[enumCaseKey], type.rawType) %>,
            <% }) %>
        }
    <% } %>
<% }) %>

export class hAnalyticsTrackers {
    networking: hAnalyticsNetworking

    constructor(
        networking: hAnalyticsNetworking
    ) {
        this.networking = networking
    }

    // identifies and registers the trackingId
    identify() {
        this.networking.identify()
    }

<% events.forEach(function(event) { %>
    <%- stringToJSComment(event.description) || "no description given" %>
    <%- event.deprecationReason ? `// @deprecated ${event.deprecationReason}` : "" %>
    <%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${jsTypeMap(input.type)}`).join(",") %>) {
    <% if (event.graphql) { %>
            const properties: { [name: string]: any } = {
                <% (event.inputs ?? []).forEach(function(input) { %>
                        "<%= input.name %>": <%= jsInputToGetter(input) %>,
                <% }); %>
                <% (event.constants ?? []).forEach(function(constant) { %>
                        "<%= constant.name %>": <%= jsLiteral(constant.value, constant.type) %>,
                <% }); %>
            }

            <% const graphQLInputs = (event.inputs ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>
            <% const graphQLConstants = (event.constants ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)) %>

            const graphQLVariables: { [name: string]: any } = {
                <% graphQLInputs.forEach(function(input) { %>
                        "<%= input.name %>": <%= jsInputToGetter(input) %>,
                <% }); %>
                <% graphQLConstants.forEach(function(constant) { %>
                        "<%= constant.name %>": <%= constant.value %>,
                <% }); %>
            }

            this.networking.send({
                name: "<%= event.name %>",
                properties: properties,
                graphql: {
                    "query": `
                    <%- formatGQL(event.graphql.query) %>
                    `,
                    "selectors": [
                        <% event.graphql.selectors.forEach(function(selector) { %>
                        {"name": "<%= selector.name %>", "path": "<%- selector.path %>"},
                        <% }); %>
                    ],
                    "variables": graphQLVariables
                }
            })
    <% } else { %>
            const properties: { [name: string]: any } = {
                <% (event.inputs ?? []).forEach(function(input) { %>
                        "<%= input.name %>": <%- jsInputToGetter(input) %>,
                <% }); %>
                <% (event.constants ?? []).forEach(function(constant) { %>
                        "<%= constant.name %>": <%= constant.value %>,
                <% }); %>
            }

            this.networking.send({
                name: "<%= event.name %>",
                properties: properties
            })
    <% } %>
   }
<% }) %>
}


---
to: kotlin/src/main/kotlin/com/hedvig/hanalytics/HAnalytics.kt
---
package com.hedvig.hanalytics

<% types.forEach((type) => { %>

    <% if (type.type === "Enum") { %>

        interface <%= type.name %>Raw {
            val value: <%- kotlinTypeMap(type.rawType) %>
        }

         /**
         <%- stringToKotlinComment(type.description) || "* No description given" %>
         */
        enum class <%= type.name %>: <%= type.name %>Raw {
            <% var caseKeys = Object.keys(type.cases) %>
            <% caseKeys.forEach((enumCaseKey) => { %>
                <%= capitalizeFirstLetter(enumCaseKey) %> {
                    override val value = <%- kotlinLiteral(type.cases[enumCaseKey], type.rawType) %>
                } <%= enumCaseKey === caseKeys[caseKeys.length - 1] ? `;` : `,` %>
            <% }) %>
        }

    <% } %>


<% }) %>

abstract class HAnalytics {
    abstract protected fun send(event: HAnalyticsEvent)
    <%_ events.forEach(function(event) { -%>
        /**
         <%- stringToKotlinComment(event.description) || "* No description given" %>
         */
        fun <%= event.accessor %>(<%- (event.inputs ?? []).map(input => `${input.argument}: ${kotlinTypeMap(input.type)}`).join(",") %>) {
            <%_ if (event.graphql) { -%>
                send(
                    HAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = mapOf(
                            <%_ (event.inputs ?? []).forEach(function(input) { -%>
                                "<%= input.name %>" to <%= kotlinInputToGetter(input) %>,
                            <%_ }); -%>
                            <%_ (event.contants ?? []).forEach(function(constant) { -%>
                                "<%= constant.name %>" to <%= constant.value %>,
                            <%_ }); -%>
                        ),
                        graphql = mapOf(
                            "query" to """
<%- formatGQL(event.graphql.query).replace(/\$/g, '${"\\$"}') _%>
                            """.trimIndent(),
                            "selectors" to listOf(
                                <%_ event.graphql.selectors.forEach(function(selector) { -%>
                                    mapOf(
                                        "name" to "<%= selector.name %>",
                                        "path" to "<%- selector.path %>",
                                    ),
                                <%_ }); -%>
                            ),
                            "variables" to mapOf<String, Any?>(
                                <%_ (events.inputs ?? []).filter(input => (event.graphql.variables ?? []).includes(input.name)).forEach(function(input) { -%>
                                    "<%= input.name %>" to <%= kotlinInputToGetter(input) %>,
                                <%_ }); -%>
                                <%_ (events.constants ?? []).filter(constant => (event.graphql.variables ?? []).includes(constant.name)).forEach(function(constant) { -%>
                                    "<%= constant.name %>" to <%= constant.value %>,
                                <%_ }); -%>
                            ),
                        ),
                    )
                )
            <%_ } else { -%>
                send(
                    HAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = mapOf(
                            <%_ (event.inputs ?? []).forEach(function(input) { -%>
                                "<%= input.name %>" to <%= kotlinInputToGetter(input) %>,
                            <%_ }) -%>
                            <%_ (event.contants ?? []).forEach(function(constant) { -%>
                                "<%= constant.name %>" to <%= constant.value %>,
                            <%_ }) -%>
                        ),
                    )
                )
            <%_ } -%>
        }
    <% }); %>
}

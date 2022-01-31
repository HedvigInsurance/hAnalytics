---
to: kotlin/src/main/kotlin/com/hedvig/hanalytics/HAnalytics.kt
---
package com.hedvig.hanalytics

abstract class HAnalytics {
    abstract protected fun send(event: HAnalyticsEvent)
    <%_ events.forEach(function(event) { -%>
        /**
         * <%- event.description || "No description given" %>
         */
        fun <%= event.accessor %>(<%- (event.inputs ?? []).map(input => `${input.argument}: ${kotlinTypeMap(input.type)}`).join(",") %>) {
            <%_ if (event.graphql) { -%>
                send(
                    HAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = mapOf(
                            <%_ (event.inputs ?? []).forEach(function(input) { -%>
                                "<%= input.name %>" to <%= input.argument %>,
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
                                    "<%= input.name %>" to <%= input.argument %>,
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
                                "<%= input.name %>" to <%= input.argument %>,
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

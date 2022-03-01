---
to: kotlin/src/main/kotlin/com/hedvig/hanalytics/HAnalytics.kt
---
package com.hedvig.hanalytics

<% customTypes.forEach((type) => { %>

    <% if (type.type === "Enum") { %>
         /**
         <%- stringToKotlinComment(type.description) || "* No description given" %>
         */
        enum class <%= type.name %>(val value: <%- kotlinTypeMap(type.rawType) %>) {
            <% var caseKeys = Object.keys(type.cases) %>
            <% caseKeys.forEach((enumCaseKey) => { %>
                <%= snakeCase(enumCaseKey).toUpperCase() %>(<%- kotlinLiteral(type.cases[enumCaseKey], type.rawType) %>)
                <%= enumCaseKey === caseKeys[caseKeys.length - 1] ? `;` : `,` -%>
            <% }) %>
        }

    <% } %>
<% }) %>

<% experiments.kotlin.filter(experiment => experiment.variants.length > 0).forEach(function(experiment) { %>
    /**
    <%- stringToKotlinComment(experiment.description) %>
    */
    enum class <%- experiment.enumName %>(val variantName: String) {
        <% experiment.variants.forEach(function(variant) { -%>
            <%- variant.name.toUpperCase() %>("<%- variant.name %>"),
        <% }) %>;

        companion object {
            fun getByVariantName(name: String) = values().first { it.variantName == name }
        }
    }
<% }) %>

abstract class HAnalytics {
    abstract protected fun send(event: HAnalyticsEvent)
    abstract protected suspend fun getExperiment(name: String): HAnalyticsExperiment
    abstract protected suspend fun invalidateExperiments()

    protected fun experimentEvaluated(experiment: HAnalyticsExperiment) {
        send(
            HAnalyticsEvent(
                "experiment_evaluated",
                mapOf(
                    "name" to experiment.name,
                    "variant" to experiment.variant,
                )
            )
        )
    }

    <% experiments.kotlin.forEach(function(experiment) { -%>
        /**
        <%- stringToKotlinComment(experiment.description) %>
        */
        <% if (experiment.variants.length > 0) { -%>
            suspend fun <%- experiment.accessor %>(): <%- experiment.enumName %> {
                try {
                    val experiment = getExperiment("<%- experiment.name %>")
                    experimentEvaluated(experiment)

                    return <%- experiment.enumName %>.getByVariantName(experiment.variant)
                } catch (e: Exception) {
                    experimentEvaluated(
                        HAnalyticsExperiment(
                            "<%- experiment.name %>",
                            "<%- experiment.defaultFallback %>",
                        )
                    )

                    return <%- experiment.enumName%>.getByVariantName("<%- experiment.defaultFallback %>")
                }

            }
        <% } else { -%>
            suspend fun <%- experiment.accessor %>(): Boolean {
                try {
                    val experiment = getExperiment("<%- experiment.name %>")
                    experimentEvaluated(experiment)

                    return experiment.variant == "enabled"
                } catch (e: Exception) {
                    experimentEvaluated(
                        HAnalyticsExperiment(
                            "<%- experiment.name %>",
                            "<%- experiment.defaultFallback %>",
                        )
                    )

                    return <%- experiment.defaultFallback == "enabled" ? "true" : "false" %>
                }
            }
        <% } %>
    <% }) %>

    <%_ events.kotlin.forEach(function(event) { -%>
        /**
         <%- stringToKotlinComment(event.description) || "* No description given" %>
         */
        <%- event.deprecationReason ? `@Deprecated("${event.deprecationReason}")\n` : "" %> fun <%= event.accessor %>(<%- (event.inputs ?? []).map(input => `${input.argument}: ${kotlinTypeMap(input.type)}`).join(",") %>) {
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

    companion object {
        val EXPERIMENTS = listOf(
            <% experiments.kotlin.forEach(function(experiment) { -%>
                "<%= experiment.name %>",
            <% }); -%>
        )
    }
}

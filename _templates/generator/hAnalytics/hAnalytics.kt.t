---
to: kotlin/src/main/kotlin/hAnalytics.kt
---
data class hAnalyticsProviders(

) {
    companion object {
        var sendEvent: (hAnalyticsEvent) -> Unit = { }
        var performGraphQLQuery: (String, Map<String, Any?>?, (ResultMap) -> Unit) -> Unit = { }
    }
}

data class hAnalyticsEvent(
    internal val name: String,
    internal val properties: Map<String, Any?>
)

data class AnalyticsClosure(
    internal val send: () -> Unit
)

<% events.forEach(function(event) { %>
    /**
     * <%= event.description %>
     */
    fun hAnalyticsEvent.Companion.<%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${kotlinTypeMap[input.type]}`).join(",") %>): AnalyticsClosure {
        return AnalyticsClosure {
        <% if(event.graphql) { %>
                val properties: Map<String, Any?> = mapOf(
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>" to <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>" to <%= constant.value %>,
                    <% }); %>
                )

                <% const graphQLInputs = (event.inputs ?? []).filter(input => event.graphql.variables.includes(input.name)) %>
                <% const graphQLConstants = (event.constants ?? []).filter(input => event.graphql.variables.includes(input.name)) %>

                val graphQLVariables: Map<String, Any?> = mapOf(
                    <% graphQLInputs.forEach(function(input) { %>
                            "<%= input.name %>" to <%= input.argument %>,
                    <% }); %>
                    <% graphQLConstants.forEach(function(constant) { %>
                            "<%= constant.name %>" to <%= constant.value %>,
                    <% }); %>
                )

                hAnalyticsProviders.performGraphQLQuery("""<%= formatGQL(event.graphql.query) %>""",
                graphQLVariables,
                { data ->
                    val graphqlProperties: Map<String, Any?> = mapOf(
                        <% event.graphql.getters.forEach(function(getter) { %>
                            "<%= getter.name %>" to data?.getValue(path = "<%= getter.getter %>"),
                        <% }); %>
                    )

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    ))
                })
        <% } else { %>
                val properties: Map<String, Any?> = mapOf(
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>" to <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>" to <%= constant.value %>,
                    <% }); %>
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        <% } %>
        }
   }
<% }) %>

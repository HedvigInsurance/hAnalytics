---
to: kotlin/src/main/kotlin/hAnalytics.kt
---
data class hAnalyticsProviders(

) {
    companion object {
        var sendEvent: (hAnalyticsEvent) -> Unit = { }
        var performGraphQLQuery: (String, Map<String, Any>, (ResultMap) -> Unit) -> Unit = { }
    }
}

interface hAnalyticsProperty {
}

data class hAnalyticsEvent(
    internal val name: String,
    internal val properties: Map<String, Any>
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
                val properties: Map<String, Any> = mapOf(
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>" to <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>" to <%= constant.value %>,
                    <% }); %>
                ).compactMapValues({ it })

                hAnalyticsProviders.performGraphQLQuery(
                "<%= event.graphql.query.replace(/(\r\n|\n|\r)/gm, "") %>",
                properties,
                { data ->
                    val graphqlProperties: Map<String, Any> = mapOf(
                        <% event.graphql.getters.forEach(function(getter) { %>
                            "<%= getter.name %>" to data.getValue(path = "<%= getter.getter %>"),
                        <% }); %>
                    ).compactMapValues({ it })

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs }).compactMapValues(
                                                { any -> any as? hAnalyticsProperty })
                    ))
                })
        <% } else { %>
                val properties: Map<String, Any> = mapOf(
                    <% (event.inputs ?? []).forEach(function(input) { %>
                            "<%= input.name %>" to <%= input.argument %>,
                    <% }); %>
                    <% (event.constants ?? []).forEach(function(constant) { %>
                            "<%= constant.name %>" to <%= constant.value %>,
                    <% }); %>
                ).compactMapValues({ it })

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "<%= event.name %>",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs }).compactMapValues(
                                                { any -> any as? hAnalyticsProperty })
                    ))
        <% } %>
        }
   }
<% }) %>

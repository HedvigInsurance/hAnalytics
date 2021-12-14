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

fun hAnalyticsEvent.Companion.screenViewHome(): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf()

            hAnalyticsProviders.sendEvent(
                hAnalyticsEvent(
                        name = "screen_view_home",
                        properties = properties.compactMapValues({ any -> any as? hAnalyticsProperty })))
        }
}

fun hAnalyticsEvent.Companion.screenViewInsurances(): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf()

            hAnalyticsProviders.sendEvent(
                hAnalyticsEvent(
                        name = "screen_view_insurances",
                        properties = properties.compactMapValues({ any -> any as? hAnalyticsProperty })))
        }
}

fun hAnalyticsEvent.Companion.screenViewForever(): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf()

            hAnalyticsProviders.sendEvent(
                hAnalyticsEvent(
                        name = "screen_view_forever",
                        properties = properties.compactMapValues({ any -> any as? hAnalyticsProperty })))
        }
}

fun hAnalyticsEvent.Companion.screenViewProfile(): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf()

            hAnalyticsProviders.sendEvent(
                hAnalyticsEvent(
                        name = "screen_view_profile",
                        properties = properties.compactMapValues({ any -> any as? hAnalyticsProperty })))
        }
}

fun hAnalyticsEvent.Companion.chooseInsuranceType(typeOfContract: String): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf("type_of_contract" to typeOfContract)

            hAnalyticsProviders.sendEvent(
                hAnalyticsEvent(
                        name = "choose_insurance_type",
                        properties = properties.compactMapValues({ any -> any as? hAnalyticsProperty })))
        }
}

fun hAnalyticsEvent.Companion.screenViewForever2(numberOfReferrals: Int): AnalyticsClosure {
    return AnalyticsClosure {
            val properties: Map<String, Any> = mapOf("NUMBER_OF_REFERRALS" to numberOfReferrals, "HELLO" to 0)

            hAnalyticsProviders.performGraphQLQuery(
                "query AnalyticsMemberID {  member {    id  }}",
                properties,
                { data ->
                            val graphqlProperties: Map<String, Any> = mapOf("MEMBER_ID" to data.getValue(path = "member.id")).compactMapValues({ it })

                            hAnalyticsProviders.sendEvent(
                                hAnalyticsEvent(
                                        name = "SCREEN_VIEW_FOREVER",
                                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs }).compactMapValues(
                                                { any -> any as? hAnalyticsProperty })))
                        })
        }
}

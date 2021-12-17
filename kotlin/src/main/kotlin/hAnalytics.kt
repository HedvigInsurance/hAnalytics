data class hAnalyticsProviders() {
    companion object {
        var sendEvent: (hAnalyticsEvent) -> Unit = {}
        var performGraphQLQuery: (String, Map<String, Any>, (ResultMap) -> Unit) -> Unit = {}
    }
}

interface hAnalyticsProperty {}

data class hAnalyticsEvent(internal val name: String, internal val properties: Map<String, Any>)

data class AnalyticsClosure(internal val send: () -> Unit)

/** When Home tab is shown */
fun hAnalyticsEvent.Companion.screenViewHome(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> = mapOf().compactMapValues({ it })

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_home",
                properties =
                    properties
                        .merging(graphqlProperties, { _, rhs -> rhs })
                        .compactMapValues({ any -> any as? hAnalyticsProperty })
            )
        )
    }
}

/** When Insurances tab is shown */
fun hAnalyticsEvent.Companion.screenViewInsurances(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> = mapOf().compactMapValues({ it })

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_insurances",
                properties =
                    properties
                        .merging(graphqlProperties, { _, rhs -> rhs })
                        .compactMapValues({ any -> any as? hAnalyticsProperty })
            )
        )
    }
}

/** When Hedvig Forever is shown */
fun hAnalyticsEvent.Companion.screenViewForever(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> = mapOf().compactMapValues({ it })

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_forever",
                properties =
                    properties
                        .merging(graphqlProperties, { _, rhs -> rhs })
                        .compactMapValues({ any -> any as? hAnalyticsProperty })
            )
        )
    }
}

/** When Profile tab is shown */
fun hAnalyticsEvent.Companion.screenViewProfile(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> = mapOf().compactMapValues({ it })

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_profile",
                properties =
                    properties
                        .merging(graphqlProperties, { _, rhs -> rhs })
                        .compactMapValues({ any -> any as? hAnalyticsProperty })
            )
        )
    }
}

/** When an embark flow is choosen on the choose screen */
fun hAnalyticsEvent.Companion.onboardingChooseEmbarkFlow(embarkStoryId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> =
            mapOf(
                    "embark_story_id" to embarkStoryId,
                )
                .compactMapValues({ it })

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "onboarding_choose_embark_flow",
                properties =
                    properties
                        .merging(graphqlProperties, { _, rhs -> rhs })
                        .compactMapValues({ any -> any as? hAnalyticsProperty })
            )
        )
    }
}

/**
 */
fun hAnalyticsEvent.Companion.testGraphqlEvent(numberOfReferrals: Int): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any> =
            mapOf(
                    "NUMBER_OF_REFERRALS" to numberOfReferrals,
                    "HELLO" to 0,
                )
                .compactMapValues({ it })

        hAnalyticsProviders.performGraphQLQuery(
            "query AnalyticsMemberID {  member {    id  }}",
            properties,
            { data ->
                val graphqlProperties: Map<String, Any> =
                    mapOf(
                            "MEMBER_ID" to data.getValue(path = "member.id"),
                        )
                        .compactMapValues({ it })

                hAnalyticsProviders.sendEvent(
                    hAnalyticsEvent(
                        name = "SCREEN_VIEW_FOREVER",
                        properties =
                            properties
                                .merging(graphqlProperties, { _, rhs -> rhs })
                                .compactMapValues({ any -> any as? hAnalyticsProperty })
                    )
                )
            }
        )
    }
}

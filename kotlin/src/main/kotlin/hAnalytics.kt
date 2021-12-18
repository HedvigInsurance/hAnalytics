data class hAnalyticsProviders() {
    companion object {
        var sendEvent: (hAnalyticsEvent) -> Unit = {}
        var performGraphQLQuery: (String, Map<String, Any?>?, (ResultMap) -> Unit) -> Unit = {}
    }
}

data class hAnalyticsEvent(internal val name: String, internal val properties: Map<String, Any?>)

data class AnalyticsClosure(internal val send: () -> Unit)

/** When Home tab is shown */
fun hAnalyticsEvent.Companion.screenViewHome(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_home",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When Insurances tab is shown */
fun hAnalyticsEvent.Companion.screenViewInsurances(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_insurances",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When Hedvig Forever is shown */
fun hAnalyticsEvent.Companion.screenViewForever(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_forever",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When Profile tab is shown */
fun hAnalyticsEvent.Companion.screenViewProfile(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_profile",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When an embark flow is choosen on the choose screen */
fun hAnalyticsEvent.Companion.onboardingChooseEmbarkFlow(embarkStoryId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "embark_story_id" to embarkStoryId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "onboarding_choose_embark_flow",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When Offer screen is shown */
fun hAnalyticsEvent.Companion.screenViewOffer(offerIds: Array<String>): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "offer_ids" to offerIds,
            )

        val graphQLVariables: Map<String, Any?> =
            mapOf(
                "offer_ids" to offerIds,
            )

        hAnalyticsProviders.performGraphQLQuery(
            """
                query AnalyticsScreenViewOfferFetchTypeOfContracts($offer_ids: [ID!]!) {
	quoteBundle(input: {
		ids: $offer_ids
	}) {
		quotes {
			typeOfContract
		}
	}
}
                """,
            graphQLVariables,
            { data ->
                val graphqlProperties: Map<String, Any?> =
                    mapOf(
                        "TYPE_OF_CONTRACTS" to data?.getValue(path = "quotes.typeOfContract"),
                    )

                hAnalyticsProviders.sendEvent(
                    hAnalyticsEvent(
                        name = "screen_view_offer",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    )
                )
            }
        )
    }
}

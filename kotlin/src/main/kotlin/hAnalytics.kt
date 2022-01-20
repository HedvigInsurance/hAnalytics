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


    /**
     * When a claim card has been clicked on screen
     */
    fun hAnalyticsEvent.Companion.claimCardClick(claimId: String,claimStatus: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "claim_id" to claimId,
                    
                            "claim_status" to claimStatus,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "claim_card_click",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When a claim card has been shown on screen
     */
    fun hAnalyticsEvent.Companion.claimCardVisible(claimId: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "claim_id" to claimId,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "claim_card_visible",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When a claims recording has been played in the claims status screen
     */
    fun hAnalyticsEvent.Companion.claimsDetailRecordingPlayed(claimId: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "claim_id" to claimId,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "claims_detail_recording_played",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When the claims status detail screen is shown
     */
    fun hAnalyticsEvent.Companion.claimsStatusDetailScreenView(claimId: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "claim_id" to claimId,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "claims_status_detail_screen_view",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When an embark flow is choosen on the choose screen
     */
    fun hAnalyticsEvent.Companion.onboardingChooseEmbarkFlow(embarkStoryId: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "embark_story_id" to embarkStoryId,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "onboarding_choose_embark_flow",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When Offer screen is shown
     */
    fun hAnalyticsEvent.Companion.screenViewOffer(offerIds: Array<String>): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "offer_ids" to offerIds,
                    
                    
                )

                
                

                val graphQLVariables: Map<String, Any?> = mapOf(
                    
                            "offer_ids" to offerIds,
                    
                    
                )

                hAnalyticsProviders.performGraphQLQuery("""
                query ScreenViewOffer($offer_ids: [ID!]!) {
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
                    val graphqlProperties: Map<String, Any?> = mapOf(
                        
                            "type_of_contracts" to data?.getValue(path = ""),
                        
                    )

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_offer",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    ))
                })
        
        }
   }

    /**
     * When the detail screen of a cross sell is shown
     */
    fun hAnalyticsEvent.Companion.screenViewCrossSellDetail(typeOfContract: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "type_of_contract" to typeOfContract,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_cross_sell_detail",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When Hedvig Forever is shown
     */
    fun hAnalyticsEvent.Companion.screenViewForever(): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_forever",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When Home tab is shown
     */
    fun hAnalyticsEvent.Companion.screenViewHome(): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_home",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When detail screen of an insurance is shown
     */
    fun hAnalyticsEvent.Companion.screenViewInsuranceDetail(contractId: String): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                            "contract_id" to contractId,
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_insurance_detail",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }

    /**
     * When Insurances tab is shown
     */
    fun hAnalyticsEvent.Companion.screenViewInsurances(): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                    
                )

                
                

                val graphQLVariables: Map<String, Any?> = mapOf(
                    
                    
                )

                hAnalyticsProviders.performGraphQLQuery("""
                query ScreenViewInsurances {
	contracts {
		typeOfContract
	}
}
                """,
                graphQLVariables,
                { data ->
                    val graphqlProperties: Map<String, Any?> = mapOf(
                        
                            "has_accident_insurance" to data?.getValue(path = ""),
                        
                            "has_home_insurance" to data?.getValue(path = ""),
                        
                    )

                    hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_insurances",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    ))
                })
        
        }
   }

    /**
     * When Profile tab is shown
     */
    fun hAnalyticsEvent.Companion.screenViewProfile(): AnalyticsClosure {
        return AnalyticsClosure {
        
                val properties: Map<String, Any?> = mapOf(
                    
                    
                )

                hAnalyticsProviders.sendEvent(hAnalyticsEvent(
                        name = "screen_view_profile",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                ))
        
        }
   }


data class hAnalyticsProviders() {
    companion object {
        var sendEvent: (hAnalyticsEvent) -> Unit = {}
        var performGraphQLQuery: (String, Map<String, Any?>?, (ResultMap) -> Unit) -> Unit = {}
    }
}

data class hAnalyticsEvent(internal val name: String, internal val properties: Map<String, Any?>)

data class AnalyticsClosure(internal val send: () -> Unit)

/** When a file, video, image, gif is sent in the chat */
fun hAnalyticsEvent.Companion.chatRichMessageSent(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "chat_rich_message_sent",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a text message is sent in the chat */
fun hAnalyticsEvent.Companion.chatTextMessageSent(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "chat_text_message_sent",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the chat is shown */
fun hAnalyticsEvent.Companion.screenViewChat(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_chat",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a claim card has been clicked on screen */
fun hAnalyticsEvent.Companion.claimCardClick(
    claimId: String,
    claimStatus: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "claim_id" to claimId,
                "claim_status" to claimStatus,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "claim_card_click",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a claim card has been shown on screen */
fun hAnalyticsEvent.Companion.claimCardVisible(
    claimId: String,
    claimStatus: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "claim_id" to claimId,
                "claim_status" to claimStatus,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "claim_card_visible",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When contact chat is tapped on claim details */
fun hAnalyticsEvent.Companion.claimDetailClickOpenChat(
    claimId: String,
    claimStatus: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "claim_id" to claimId,
                "claim_status" to claimStatus,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "claim_status_detail_click_open_chat",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a claims recording has been played in the claims status screen */
fun hAnalyticsEvent.Companion.claimsDetailRecordingPlayed(claimId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "claim_id" to claimId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "claims_detail_recording_played",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the honor pledge screen is shown */
fun hAnalyticsEvent.Companion.screenViewClaimHonorPledge(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_claim_honor_pledge",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the claims status detail screen is shown */
fun hAnalyticsEvent.Companion.screenViewClaimsStatusDetail(
    claimId: String,
    claimStatus: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "claim_id" to claimId,
                "claim_status" to claimStatus,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_claims_status_detail",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a common claim detail screen is shown */
fun hAnalyticsEvent.Companion.screenViewCommonClaimDetail(id: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "id" to id,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_common_claim_detail",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a deep link was opened */
fun hAnalyticsEvent.Companion.deepLinkOpened(type: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "type" to type,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "deep_link_opened",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark does an external redirect */
fun hAnalyticsEvent.Companion.embarkExternalRedirect(location: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "location" to location,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "embark_external_redirect",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark goes back one passage */
fun hAnalyticsEvent.Companion.embarkPassageGoBack(
    storyName: String,
    passageName: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "originated_from_embark_story" to storyName,
                "passage_name" to passageName,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "embark_passage_go_back",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark sends a tracking event */
fun hAnalyticsEvent.Companion.embarkTrack(
    storyName: String,
    eventName: String,
    store: Map<String, Any>
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "originated_from_embark_story" to storyName,
                "event_name" to eventName,
                "store" to store,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "embark_track",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark does a varianted offer redirect */
fun hAnalyticsEvent.Companion.embarkVariantedOfferRedirect(
    allIds: Array<String>,
    selectedIds: Array<String>
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "all_ids" to allIds,
                "selected_ids" to selectedIds,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "embark_varianted_offer_redirect",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark is shown */
fun hAnalyticsEvent.Companion.screenViewEmbark(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_embark",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When embark tooltip screen is shown */
fun hAnalyticsEvent.Companion.screenViewEmbarkTooltip(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_embark_tooltip",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** User just logged in */
fun hAnalyticsEvent.Companion.loggedIn(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "logged_in",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** User just logged out */
fun hAnalyticsEvent.Companion.loggedOut(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "logged_out",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** The state of notification permission, on Android granted is always set to true */
fun hAnalyticsEvent.Companion.notificationPermission(granted: Boolean): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "granted" to granted,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "notification_permission",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** The application received a push notification */
fun hAnalyticsEvent.Companion.notificationReceived(type: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "type" to type,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "notification_received",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When quotes are signed in the offer screen */
fun hAnalyticsEvent.Companion.quotesSigned(quoteIds: Array<String>): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "quote_ids" to quoteIds,
            )

        val graphQLVariables: Map<String, Any?> =
            mapOf(
                "quote_ids" to quoteIds,
            )

        hAnalyticsProviders.performGraphQLQuery(
            """
                query QuotesSigned($quote_ids: [ID!]!) {
	quoteBundle(input: {
		ids: $quote_ids
	}) {
		quotes {
			typeOfContract
			initiatedFrom
		}
	}
}
                """,
            graphQLVariables,
            { data ->
                val graphqlProperties: Map<String, Any?> =
                    mapOf(
                        "type_of_contracts" to data?.getValue(path = ""),
                        "initiated_from" to data?.getValue(path = ""),
                    )

                hAnalyticsProviders.sendEvent(
                    hAnalyticsEvent(
                        name = "quotes_signed",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    )
                )
            }
        )
    }
}

/** When a user clicks &#34;Already a member? Log in&#34; on the marketing screen */
fun hAnalyticsEvent.Companion.buttonClickMarketingLogin(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "button_click_marketing_login",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a user clicks &#34;Get a price quote&#34; on the marketing screen */
fun hAnalyticsEvent.Companion.buttonClickMarketingOnboard(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "button_click_marketing_onboard",
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

/** When the user decided to skip data collection */
fun hAnalyticsEvent.Companion.dataCollectionSkipped(providerId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "data_collection_skipped",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When data collection waiting for authentication screen is shown */
fun hAnalyticsEvent.Companion.screenViewDataCollectionAuthenticating(
    providerId: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_data_collection_authenticating",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When data collection credentials screen is shown (Insurely) */
fun hAnalyticsEvent.Companion.screenViewDataCollectionCredentials(
    providerId: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_data_collection_credentials",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When data collection failed */
fun hAnalyticsEvent.Companion.screenViewDataCollectionFail(providerId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_data_collection_fail",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When data collection intro screen is shown (Insurely) */
fun hAnalyticsEvent.Companion.screenViewDataCollectionIntro(providerId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_data_collection_intro",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When data collection succeeded */
fun hAnalyticsEvent.Companion.screenViewDataCollectionSuccess(
    providerId: String
): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "provider_id" to providerId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_data_collection_success",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When market picker is shown */
fun hAnalyticsEvent.Companion.screenViewMarketPicker(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_market_picker",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When a market was selected on the market picker screen */
fun hAnalyticsEvent.Companion.marketSelected(locale: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "locale" to locale,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "market_selected",
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
                query ScreenViewOffer($offer_ids: [ID!]!) {
	quoteBundle(input: {
		ids: $offer_ids
	}) {
		quotes {
			typeOfContract
			initiatedFrom
		}
	}
}
                """,
            graphQLVariables,
            { data ->
                val graphqlProperties: Map<String, Any?> =
                    mapOf(
                        "type_of_contracts" to data?.getValue(path = ""),
                        "initiated_from" to data?.getValue(path = ""),
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

/** When marketing screen is shown */
fun hAnalyticsEvent.Companion.screenViewMarketing(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_marketing",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** A payment card was shown on the home screen */
fun hAnalyticsEvent.Companion.homePaymentCardVisible(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "home_payment_card_visible",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** Connecting payment with Adyen screen was shown */
fun hAnalyticsEvent.Companion.screenViewConnectPaymentAdyen(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_connect_payment_adyen",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When payment connection did fail */
fun hAnalyticsEvent.Companion.screenViewConnectPaymentFailed(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_connect_payment_failed",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When payment was connected successfully */
fun hAnalyticsEvent.Companion.screenViewConnectPaymentSuccess(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_connect_payment_success",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** Connecting payment with Trustly screen was shown */
fun hAnalyticsEvent.Companion.screenViewConnectPaymentTrustly(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_connect_payment_trustly",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** Payments screen was shown */
fun hAnalyticsEvent.Companion.screenViewPayments(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_payments",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the charity screen is shown */
fun hAnalyticsEvent.Companion.screenViewCharity(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_charity",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the contact info screen is shown */
fun hAnalyticsEvent.Companion.screenViewContactInfo(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_contact_info",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When the detail screen of a cross sell is shown */
fun hAnalyticsEvent.Companion.screenViewCrossSellDetail(typeOfContract: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "type_of_contract" to typeOfContract,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_cross_sell_detail",
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

/** When detail screen of an insurance is shown */
fun hAnalyticsEvent.Companion.screenViewInsuranceDetail(contractId: String): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> =
            mapOf(
                "contract_id" to contractId,
            )

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_insurance_detail",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When Insurances tab is shown */
fun hAnalyticsEvent.Companion.screenViewInsurances(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        val graphQLVariables: Map<String, Any?> = mapOf()

        hAnalyticsProviders.performGraphQLQuery(
            """
                query ScreenViewInsurances {
	contracts {
		typeOfContract
	}
}
                """,
            graphQLVariables,
            { data ->
                val graphqlProperties: Map<String, Any?> =
                    mapOf(
                        "has_accident_insurance" to data?.getValue(path = ""),
                        "has_home_insurance" to data?.getValue(path = ""),
                    )

                hAnalyticsProviders.sendEvent(
                    hAnalyticsEvent(
                        name = "screen_view_insurances",
                        properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
                    )
                )
            }
        )
    }
}

/** When moving flow intro screen is shown */
fun hAnalyticsEvent.Companion.screenViewMovingFlowIntro(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_moving_flow_intro",
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

/** App was put into background */
fun hAnalyticsEvent.Companion.appBackground(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "app_background",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** App was resumed after being in background */
fun hAnalyticsEvent.Companion.appResumed(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "app_resumed",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** App was shutdown */
fun hAnalyticsEvent.Companion.appShutdown(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "app_shutdown",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** App was started */
fun hAnalyticsEvent.Companion.appStarted(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "app_started",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When app information screen was shown */
fun hAnalyticsEvent.Companion.screenViewAppInformation(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_app_information",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

/** When app settings screen was shown */
fun hAnalyticsEvent.Companion.screenViewAppSettings(): AnalyticsClosure {
    return AnalyticsClosure {
        val properties: Map<String, Any?> = mapOf()

        hAnalyticsProviders.sendEvent(
            hAnalyticsEvent(
                name = "screen_view_app_settings",
                properties = properties.merging(graphqlProperties, { _, rhs -> rhs })
            )
        )
    }
}

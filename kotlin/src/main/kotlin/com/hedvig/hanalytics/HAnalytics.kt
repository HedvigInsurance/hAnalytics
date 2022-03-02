package com.hedvig.hanalytics

/**
 * An app screen
 */
enum class AppScreen(val value: String) {

    OFFER("offer"),

    CLAIMS_STATUS_DETAIL("claims_status_detail"),

    CLAIM_HONOR_PLEDGE("claim_honor_pledge"),

    COMMON_CLAIM_DETAIL("common_claim_detail"),

    EMBARK("embark"),

    EMBARK_TOOLTIP("embark_tooltip"),

    MARKET_PICKER("market_picker"),

    MARKETING("marketing"),

    DATA_COLLECTION_AUTHENTICATING("data_collection_authenticating"),

    DATA_COLLECTION_CREDENTIALS("data_collection_credentials"),

    DATA_COLLECTION_FAIL("data_collection_fail"),

    DATA_COLLECTION_INTRO("data_collection_intro"),

    DATA_COLLECTION_SUCCESS("data_collection_success"),

    CONNECT_PAYMENT_ADYEN("connect_payment_adyen"),

    CONNECT_PAYMENT_TRUSTLY("connect_payment_trustly"),

    CONNECT_PAYMENT_FAILED("connect_payment_failed"),

    CONNECT_PAYMENT_SUCCESS("connect_payment_success"),

    PAYMENTS("payments"),

    CHARITY("charity"),

    CONTACT_INFO("contact_info"),

    CROSS_SELL_DETAIL("cross_sell_detail"),

    FOREVER("forever"),

    HOME("home"),

    INSURANCE_DETAIL("insurance_Detail"),

    INSURANCES("insurances"),

    MOVING_FLOW_INTRO("moving_flow_intro"),

    PROFILE("profile"),

    APP_INFORMATION("app_information"),

    APP_SETTINGS("app_settings"),

    CHAT("chat")
    ;
}

abstract class HAnalytics {
    protected abstract fun send(event: HAnalyticsEvent)
    /**
     * A screen was shown in the app
     */
    fun screenView(screen: AppScreen) {
        send(
            HAnalyticsEvent(
                name = "app_screen_view",
                properties = mapOf(
                    "screen_name" to screen.value,
                ),
            )
        )
    }
    /**
     * When a file, video, image, gif is sent in the chat
     */
    fun chatRichMessageSent() {
        send(
            HAnalyticsEvent(
                name = "chat_rich_message_sent",
                properties = mapOf(),
            )
        )
    }
    /**
     * When a text message is sent in the chat
     */
    fun chatTextMessageSent() {
        send(
            HAnalyticsEvent(
                name = "chat_text_message_sent",
                properties = mapOf(),
            )
        )
    }
    /**
     * When a claim card has been clicked on screen
     */
    fun claimCardClick(claimId: String, claimStatus: String) {
        send(
            HAnalyticsEvent(
                name = "claim_card_click",
                properties = mapOf(
                    "claim_id" to claimId,
                    "claim_status" to claimStatus,
                ),
            )
        )
    }
    /**
     * When a claim card has been shown on screen
     */
    fun claimCardVisible(claimId: String, claimStatus: String) {
        send(
            HAnalyticsEvent(
                name = "claim_card_visible",
                properties = mapOf(
                    "claim_id" to claimId,
                    "claim_status" to claimStatus,
                ),
            )
        )
    }
    /**
     * When contact chat is tapped on claim details
     */
    fun claimDetailClickOpenChat(claimId: String, claimStatus: String) {
        send(
            HAnalyticsEvent(
                name = "claim_status_detail_click_open_chat",
                properties = mapOf(
                    "claim_id" to claimId,
                    "claim_status" to claimStatus,
                ),
            )
        )
    }
    /**
     * When a claims recording has been played in the claims status screen
     */
    fun claimsDetailRecordingPlayed(claimId: String) {
        send(
            HAnalyticsEvent(
                name = "claims_detail_recording_played",
                properties = mapOf(
                    "claim_id" to claimId,
                ),
            )
        )
    }
    /**
     * When a deep link was opened
     */
    fun deepLinkOpened(type: String) {
        send(
            HAnalyticsEvent(
                name = "deep_link_opened",
                properties = mapOf(
                    "type" to type,
                ),
            )
        )
    }
    /**
     * User just logged in
     */
    fun loggedIn() {
        send(
            HAnalyticsEvent(
                name = "logged_in",
                properties = mapOf(),
            )
        )
    }
    /**
     * User just logged out
     */
    fun loggedOut() {
        send(
            HAnalyticsEvent(
                name = "logged_out",
                properties = mapOf(),
            )
        )
    }
    /**
     * A push notification was opened
     */
    fun notificationOpened(type: String) {
        send(
            HAnalyticsEvent(
                name = "notification_opened",
                properties = mapOf(
                    "type" to type,
                ),
            )
        )
    }
    /**
     * The state of notification permission:
     *   granted == true: push notifications permissions are approved
     *   granted == false: push notifications permissions are denied
     *   granted == null: push notifications permissions are not determined yet / unknown
     *
     */
    fun notificationPermission(granted: Boolean?) {
        send(
            HAnalyticsEvent(
                name = "notification_permission",
                properties = mapOf(
                    "granted" to granted,
                ),
            )
        )
    }
    /**
     * When a user clicks "Already a member? Log in" on the marketing screen
     */
    fun buttonClickMarketingLogin() {
        send(
            HAnalyticsEvent(
                name = "button_click_marketing_login",
                properties = mapOf(),
            )
        )
    }
    /**
     * When a user clicks "Get a price quote" on the marketing screen
     */
    fun buttonClickMarketingOnboard() {
        send(
            HAnalyticsEvent(
                name = "button_click_marketing_onboard",
                properties = mapOf(),
            )
        )
    }
    /**
     * When an embark flow is choosen on the choose screen
     */
    fun onboardingChooseEmbarkFlow(embarkStoryId: String) {
        send(
            HAnalyticsEvent(
                name = "onboarding_choose_embark_flow",
                properties = mapOf(
                    "embark_story_id" to embarkStoryId,
                ),
            )
        )
    }
    /**
     * When the user decided to skip data collection
     */
    fun dataCollectionSkipped(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "data_collection_skipped",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When a market was selected on the market picker screen
     */
    fun marketSelected(locale: String) {
        send(
            HAnalyticsEvent(
                name = "market_selected",
                properties = mapOf(
                    "locale" to locale,
                ),
            )
        )
    }
    /**
     * A payment card was shown on the home screen
     */
    fun homePaymentCardVisible() {
        send(
            HAnalyticsEvent(
                name = "home_payment_card_visible",
                properties = mapOf(),
            )
        )
    }
    /**
     * When embark does an external redirect
     */
    fun embarkExternalRedirect(location: String) {
        send(
            HAnalyticsEvent(
                name = "embark_external_redirect",
                properties = mapOf(
                    "location" to location,
                ),
            )
        )
    }
    /**
     * When embark goes back one passage
     */
    fun embarkPassageGoBack(storyName: String, passageName: String) {
        send(
            HAnalyticsEvent(
                name = "embark_passage_go_back",
                properties = mapOf(
                    "originated_from_embark_story" to storyName,
                    "passage_name" to passageName,
                ),
            )
        )
    }
    /**
     * When embark sends a tracking event
     */
    fun embarkTrack(storyName: String, eventName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_track",
                properties = mapOf(
                    "originated_from_embark_story" to storyName,
                    "event_name" to eventName,
                    "store" to store,
                ),
            )
        )
    }
    /**
     * When embark does a varianted offer redirect
     */
    fun embarkVariantedOfferRedirect(allIds: List<String>, selectedIds: List<String>) {
        send(
            HAnalyticsEvent(
                name = "embark_varianted_offer_redirect",
                properties = mapOf(
                    "all_ids" to allIds,
                    "selected_ids" to selectedIds,
                ),
            )
        )
    }
    /**
     * Experiment where evaluated, typically means it was shown on screen or similar
     */
    fun experimentEvaluated(name: String, variant: String) {
        send(
            HAnalyticsEvent(
                name = "experiment_evaluated",
                properties = mapOf(
                    "name" to name,
                    "variant" to variant,
                ),
            )
        )
    }
    /**
     * Experiments where loaded from server
     */
    fun experimentsLoaded(experiments: List<String>) {
        send(
            HAnalyticsEvent(
                name = "experiments_loaded",
                properties = mapOf(
                    "experiments" to experiments,
                ),
            )
        )
    }
    /**
     * When quotes are signed in the offer screen
     */
    fun quotesSigned(quoteIds: List<String>) {
        send(
            HAnalyticsEvent(
                name = "quotes_signed",
                properties = mapOf(
                    "quote_ids" to quoteIds,
                ),
                graphql = mapOf(
                    "query" to """
query QuotesSigned(${"\$"}quote_ids: [ID!]!) {
	quoteBundle(input: {
		ids: ${"\$"}quote_ids
	}) {
		quotes {
			typeOfContract
			initiatedFrom
		}
	}
}                            """.trimIndent(),
                    "selectors" to listOf(
                        mapOf(
                            "name" to "type_of_contracts",
                            "path" to "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
                        ),
                        mapOf(
                            "name" to "initiated_from",
                            "path" to "quoteBundle.quotes[0].initiatedFrom",
                        ),
                    ),
                    "variables" to mapOf<String, Any?>(),
                ),
            )
        )
    }
    /**
     * When the user received some quotes
     */
    fun receivedQuotes(quoteIds: List<String>) {
        send(
            HAnalyticsEvent(
                name = "received_quotes",
                properties = mapOf(
                    "quote_ids" to quoteIds,
                ),
                graphql = mapOf(
                    "query" to """
query ReceivedQuotes(${"\$"}quote_ids: [ID!]!) {
	quoteBundle(input: {
		ids: ${"\$"}quote_ids
	}) {
		quotes {
			typeOfContract
			initiatedFrom
		}
	}
}                            """.trimIndent(),
                    "selectors" to listOf(
                        mapOf(
                            "name" to "type_of_contracts",
                            "path" to "quoteBundle.quotes[*].typeOfContract | sort(@)",
                        ),
                        mapOf(
                            "name" to "initiated_from",
                            "path" to "quoteBundle.quotes[0].initiatedFrom",
                        ),
                    ),
                    "variables" to mapOf<String, Any?>(),
                ),
            )
        )
    }
    /**
     * App was put into background
     */
    fun appBackground() {
        send(
            HAnalyticsEvent(
                name = "app_background",
                properties = mapOf(),
            )
        )
    }
    /**
     * App was resumed after being in background
     */
    fun appResumed() {
        send(
            HAnalyticsEvent(
                name = "app_resumed",
                properties = mapOf(),
            )
        )
    }
    /**
     * App was started
     */
    fun appStarted() {
        send(
            HAnalyticsEvent(
                name = "app_started",
                properties = mapOf(),
            )
        )
    }
}

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

/**
 * Which login method to use
 */
enum class LoginMethod(val variantName: String) {
    BANK_ID_SWEDEN("bank_id_sweden"),
    NEM_ID("nem_id"),
    OTP("otp"),
    BANK_ID_NORWAY("bank_id_norway"),
    ;

    companion object {
        fun getByVariantName(name: String) = values().first { it.variantName == name }
    }
}

/**
 * Which payment provider to use
 */
enum class PaymentType(val variantName: String) {
    ADYEN("adyen"),
    TRUSTLY("trustly"),
    ;

    companion object {
        fun getByVariantName(name: String) = values().first { it.variantName == name }
    }
}

abstract class HAnalytics {
    protected abstract fun send(event: HAnalyticsEvent)
    protected abstract suspend fun getExperiment(name: String): HAnalyticsExperiment
    abstract fun identify()
    abstract suspend fun invalidateExperiments()

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

    /**
     * Allow fetching data with external data providers (for example insurely)
     */
    suspend fun allowExternalDataCollection(): Boolean {
        try {
            val experiment = getExperiment("allow_external_data_collection")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "allow_external_data_collection",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Shows or hides the connect payment warning on the home
     */
    suspend fun connectPaymentReminder(): Boolean {
        try {
            val experiment = getExperiment("connect_payment_reminder")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "connect_payment_reminder",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * This is used to manage content in the forever tab
     *
     */
    suspend fun forever(): Boolean {
        try {
            val experiment = getExperiment("forever")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "forever",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Is the forever february campaign activated
     */
    suspend fun foreverFebruaryCampaign(): Boolean {
        try {
            val experiment = getExperiment("forever_february_campaign")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "forever_february_campaign",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Should the french market be shown
     */
    suspend fun frenchMarket(): Boolean {
        try {
            val experiment = getExperiment("french_market")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "french_market",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Show or hide common claims on home tab
     */
    suspend fun homeCommonClaim(): Boolean {
        try {
            val experiment = getExperiment("home_common_claim")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "home_common_claim",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Is the key gear feature activated
     */
    suspend fun keyGear(): Boolean {
        try {
            val experiment = getExperiment("key_gear")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "key_gear",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Which login method to use
     */
    suspend fun loginMethod(): LoginMethod {
        try {
            val experiment = getExperiment("login_method")
            experimentEvaluated(experiment)

            return LoginMethod.getByVariantName(experiment.variant)
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "login_method",
                    "otp",
                )
            )

            return LoginMethod.getByVariantName("otp")
        }
    }

    /**
     * Is moving flow activated
     */
    suspend fun movingFlow(): Boolean {
        try {
            val experiment = getExperiment("moving_flow")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "moving_flow",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Shows or hides the payment row on the profile section of the app
     */
    suspend fun paymentScreen(): Boolean {
        try {
            val experiment = getExperiment("payment_screen")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "payment_screen",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Which payment provider to use
     */
    suspend fun paymentType(): PaymentType {
        try {
            val experiment = getExperiment("payment_type")
            experimentEvaluated(experiment)

            return PaymentType.getByVariantName(experiment.variant)
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "payment_type",
                    "trustly",
                )
            )

            return PaymentType.getByVariantName("trustly")
        }
    }

    /**
     * Show payment step in PostOnboarding as opposed to in the Offer page.
     * "ON" means that the connect payment step should be shown post onboarding, aka after the member has signed.
     * "OFF" means that the member will not be able to go past the Offer screen without connecting payment
     */
    suspend fun postOnboardingShowPaymentStep(): Boolean {
        try {
            val experiment = getExperiment("post_onboarding_show_payment_step")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "post_onboarding_show_payment_step",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Shows or hides charity from profile tab
     */
    suspend fun showCharity(): Boolean {
        try {
            val experiment = getExperiment("show_charity")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "show_charity",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Defines the lowest supported app version. Should prompt a user to update if it uses an outdated version.
     */
    suspend fun updateNecessary(): Boolean {
        try {
            val experiment = getExperiment("update_necessary")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "update_necessary",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Should we use new Hedvig Letters font
     */
    suspend fun useHedvigLettersFont(): Boolean {
        try {
            val experiment = getExperiment("use_hedvig_letters_font")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "use_hedvig_letters_font",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * Should we use quote cart
     */
    suspend fun useQuoteCart(): Boolean {
        try {
            val experiment = getExperiment("use_quote_cart")
            experimentEvaluated(experiment)

            return experiment.variant == "enabled"
        } catch (e: Exception) {
            experimentEvaluated(
                HAnalyticsExperiment(
                    "use_quote_cart",
                    "disabled",
                )
            )

            return false
        }
    }

    /**
     * The app redirected the user to web onboarding to onboard
     */
    fun redirectedToWebOnboarding() {
        send(
            HAnalyticsEvent(
                name = "app_redirected_to_web_onboarding",
                properties = mapOf(),
            )
        )
    }
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
     * When the honor pledge slider has been slided
     */
    fun honorPledgeConfirmed() {
        send(
            HAnalyticsEvent(
                name = "honor_pledge_confirmed",
                properties = mapOf(),
            )
        )
    }
    /**
     * When a member clicks a cross sell card on the "insurances" tab that takes you to the detail screen
     */
    fun cardClickCrossSellDetail(id: String) {
        send(
            HAnalyticsEvent(
                name = "card_click_cross_sell_detail",
                properties = mapOf(
                    "id" to id,
                ),
            )
        )
    }
    /**
     * When a member clicks a cross sell card on the "insurances" tab that takes you to the embark screen
     */
    fun cardClickCrossSellEmbark(id: String, storyName: String) {
        send(
            HAnalyticsEvent(
                name = "card_click_cross_sell_embark",
                properties = mapOf(
                    "id" to id,
                    "story_name" to storyName,
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
     * A payment card was clicked on the home screen
     */
    fun homePaymentCardClick() {
        send(
            HAnalyticsEvent(
                name = "home_payment_card_click",
                properties = mapOf(),
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
     * Payment has been connected
     */
    fun paymentConnected() {
        send(
            HAnalyticsEvent(
                name = "payment_connected",
                properties = mapOf(),
            )
        )
    }
    /**
     * When a user starts to record in an embark flow
     */
    fun embarkAudioRecordingBegin(storyName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_audio_recording_begin",
                properties = mapOf(
                    "story_name" to storyName,
                    "store" to store,
                ),
            )
        )
    }
    /**
     * When a user starts to playback a previously recordered voice memo in an embark flow
     */
    fun embarkAudioRecordingPlayback(storyName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_audio_recording_playback",
                properties = mapOf(
                    "story_name" to storyName,
                    "store" to store,
                ),
            )
        )
    }
    /**
     * When a user removes previous voice memo and records a new one in Embark
     */
    fun embarkAudioRecordingRetry(storyName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_audio_recording_retry",
                properties = mapOf(
                    "story_name" to storyName,
                    "store" to store,
                ),
            )
        )
    }
    /**
     * When a user stopped the recording
     */
    fun embarkAudioRecordingStopped(storyName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_audio_recording_stopped",
                properties = mapOf(
                    "story_name" to storyName,
                    "store" to store,
                ),
            )
        )
    }
    /**
     * When a user submitted the recording
     */
    fun embarkAudioRecordingSubmitted(storyName: String, store: Map<String, String?>) {
        send(
            HAnalyticsEvent(
                name = "embark_audio_recording_submitted",
                properties = mapOf(
                    "story_name" to storyName,
                    "store" to store,
                ),
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
                    "query" to
                        """
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
                    "query" to
                        """
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
    /**
     * When the charity screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewCharity() {
        send(
            HAnalyticsEvent(
                name = "screen_view_charity",
                properties = mapOf(),
            )
        )
    }
    /**
     * When the contact info screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewContactInfo() {
        send(
            HAnalyticsEvent(
                name = "screen_view_contact_info",
                properties = mapOf(),
            )
        )
    }
    /**
     * When the detail screen of a cross sell is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewCrossSellDetail(typeOfContract: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_cross_sell_detail",
                properties = mapOf(
                    "type_of_contract" to typeOfContract,
                ),
            )
        )
    }
    /**
     * When Hedvig Forever is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewForever() {
        send(
            HAnalyticsEvent(
                name = "screen_view_forever",
                properties = mapOf(),
            )
        )
    }
    /**
     * When Home tab is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewHome() {
        send(
            HAnalyticsEvent(
                name = "screen_view_home",
                properties = mapOf(),
            )
        )
    }
    /**
     * When detail screen of an insurance is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewInsuranceDetail(contractId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_insurance_detail",
                properties = mapOf(
                    "contract_id" to contractId,
                ),
            )
        )
    }
    /**
     * When Insurances tab is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewInsurances() {
        send(
            HAnalyticsEvent(
                name = "screen_view_insurances",
                properties = mapOf(),
                graphql = mapOf(
                    "query" to
                        """
                            query ScreenViewInsurances {
	contracts {
		typeOfContract
	}
}                            """.trimIndent(),
                    "selectors" to listOf(
                        mapOf(
                            "name" to "has_accident_insurance",
                            "path" to "(contracts[?contains(typeOfContract, 'ACCIDENT') == `true`] && true) == true",
                        ),
                        mapOf(
                            "name" to "has_home_insurance",
                            "path" to "((contracts[?contains(typeOfContract, 'HOME') == `true`] || contracts[?contains(typeOfContract, 'APARTMENT') == `true`] || contracts[?contains(typeOfContract, 'HOUSE') == `true`]) && true) == true",
                        ),
                    ),
                    "variables" to mapOf<String, Any?>(),
                ),
            )
        )
    }
    /**
     * When market picker is shown
     */
    fun screenViewMarketPicker() {
        send(
            HAnalyticsEvent(
                name = "screen_view_market_picker",
                properties = mapOf(),
            )
        )
    }
    /**
     * When moving flow intro screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewMovingFlowIntro() {
        send(
            HAnalyticsEvent(
                name = "screen_view_moving_flow_intro",
                properties = mapOf(),
            )
        )
    }
    /**
     * When Offer screen is shown
     */
    fun screenViewOffer(offerIds: List<String>) {
        send(
            HAnalyticsEvent(
                name = "screen_view_offer",
                properties = mapOf(
                    "offer_ids" to offerIds,
                ),
                graphql = mapOf(
                    "query" to
                        """
                            query ScreenViewOffer(${"\$"}offer_ids: [ID!]!) {
	quoteBundle(input: {
		ids: ${"\$"}offer_ids
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
     * When Profile tab is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewProfile() {
        send(
            HAnalyticsEvent(
                name = "screen_view_profile",
                properties = mapOf(),
            )
        )
    }
    /**
     * When app information screen was shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewAppInformation() {
        send(
            HAnalyticsEvent(
                name = "screen_view_app_information",
                properties = mapOf(),
            )
        )
    }
    /**
     * When app settings screen was shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewAppSettings() {
        send(
            HAnalyticsEvent(
                name = "screen_view_app_settings",
                properties = mapOf(),
            )
        )
    }
    /**
     * When the chat is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewChat() {
        send(
            HAnalyticsEvent(
                name = "screen_view_chat",
                properties = mapOf(),
            )
        )
    }
    /**
     * When the honor pledge screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewClaimHonorPledge() {
        send(
            HAnalyticsEvent(
                name = "screen_view_claim_honor_pledge",
                properties = mapOf(),
            )
        )
    }
    /**
     * When the claims status detail screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewClaimsStatusDetail(claimId: String, claimStatus: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_claims_status_detail",
                properties = mapOf(
                    "claim_id" to claimId,
                    "claim_status" to claimStatus,
                ),
            )
        )
    }
    /**
     * When a common claim detail screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewCommonClaimDetail(id: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_common_claim_detail",
                properties = mapOf(
                    "id" to id,
                ),
            )
        )
    }
    /**
     * Connecting payment with Adyen screen was shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewConnectPaymentAdyen() {
        send(
            HAnalyticsEvent(
                name = "screen_view_connect_payment_adyen",
                properties = mapOf(),
            )
        )
    }
    /**
     * When payment connection did fail
     */
    @Deprecated("Replaced with screenView")
    fun screenViewConnectPaymentFailed() {
        send(
            HAnalyticsEvent(
                name = "screen_view_connect_payment_failed",
                properties = mapOf(),
            )
        )
    }
    /**
     * When payment was connected successfully
     */
    @Deprecated("Replaced with screenView")
    fun screenViewConnectPaymentSuccess() {
        send(
            HAnalyticsEvent(
                name = "screen_view_connect_payment_success",
                properties = mapOf(),
            )
        )
    }
    /**
     * Connecting payment with Trustly screen was shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewConnectPaymentTrustly() {
        send(
            HAnalyticsEvent(
                name = "screen_view_connect_payment_trustly",
                properties = mapOf(),
            )
        )
    }
    /**
     * When data collection waiting for authentication screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewDataCollectionAuthenticating(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_data_collection_authenticating",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When data collection credentials screen is shown (Insurely)
     */
    @Deprecated("Replaced with screenView")
    fun screenViewDataCollectionCredentials(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_data_collection_credentials",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When data collection failed
     */
    @Deprecated("Replaced with screenView")
    fun screenViewDataCollectionFail(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_data_collection_fail",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When data collection intro screen is shown (Insurely)
     */
    @Deprecated("Replaced with screenView")
    fun screenViewDataCollectionIntro(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_data_collection_intro",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When data collection succeeded
     */
    @Deprecated("Replaced with screenView")
    fun screenViewDataCollectionSuccess(providerId: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_data_collection_success",
                properties = mapOf(
                    "provider_id" to providerId,
                ),
            )
        )
    }
    /**
     * When embark is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewEmbark(storyName: String) {
        send(
            HAnalyticsEvent(
                name = "screen_view_embark",
                properties = mapOf(
                    "story_name" to storyName,
                ),
            )
        )
    }
    /**
     * When embark tooltip screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewEmbarkTooltip() {
        send(
            HAnalyticsEvent(
                name = "screen_view_embark_tooltip",
                properties = mapOf(),
            )
        )
    }
    /**
     * When marketing screen is shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewMarketing() {
        send(
            HAnalyticsEvent(
                name = "screen_view_marketing",
                properties = mapOf(),
            )
        )
    }
    /**
     * Payments screen was shown
     */
    @Deprecated("Replaced with screenView")
    fun screenViewPayments() {
        send(
            HAnalyticsEvent(
                name = "screen_view_payments",
                properties = mapOf(),
            )
        )
    }

    companion object {
        val EXPERIMENTS = listOf(
            "allow_external_data_collection",
            "connect_payment_reminder",
            "forever",
            "forever_february_campaign",
            "french_market",
            "home_common_claim",
            "key_gear",
            "login_method",
            "moving_flow",
            "payment_screen",
            "payment_type",
            "post_onboarding_show_payment_step",
            "show_charity",
            "update_necessary",
            "use_hedvig_letters_font",
            "use_quote_cart",
        )
    }
}

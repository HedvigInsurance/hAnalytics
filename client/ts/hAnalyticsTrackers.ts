import { hAnalyticsNetworking } from "./hAnalyticsNetworking";

// An app screen
enum AppScreen {
  OFFER = "offer",

  CLAIMS_STATUS_DETAIL = "claims_status_detail",

  CLAIM_HONOR_PLEDGE = "claim_honor_pledge",

  COMMON_CLAIM_DETAIL = "common_claim_detail",

  EMBARK = "embark",

  EMBARK_TOOLTIP = "embark_tooltip",

  MARKET_PICKER = "market_picker",

  MARKETING = "marketing",

  DATA_COLLECTION_AUTHENTICATING = "data_collection_authenticating",

  DATA_COLLECTION_CREDENTIALS = "data_collection_credentials",

  DATA_COLLECTION_FAIL = "data_collection_fail",

  DATA_COLLECTION_INTRO = "data_collection_intro",

  DATA_COLLECTION_SUCCESS = "data_collection_success",

  CONNECT_PAYMENT_ADYEN = "connect_payment_adyen",

  CONNECT_PAYMENT_TRUSTLY = "connect_payment_trustly",

  CONNECT_PAYMENT_FAILED = "connect_payment_failed",

  CONNECT_PAYMENT_SUCCESS = "connect_payment_success",

  PAYMENTS = "payments",

  CHARITY = "charity",

  CONTACT_INFO = "contact_info",

  CROSS_SELL_DETAIL = "cross_sell_detail",

  FOREVER = "forever",

  HOME = "home",

  INSURANCE_DETAIL = "insurance_Detail",

  INSURANCES = "insurances",

  MOVING_FLOW_INTRO = "moving_flow_intro",

  PROFILE = "profile",

  APP_INFORMATION = "app_information",

  APP_SETTINGS = "app_settings",

  CHAT = "chat",
}

export class hAnalyticsTrackers {
  // identifies and registers the trackingId
  static identify() {
    hAnalyticsNetworking.identify();
  }

  // A screen was shown in the app

  static screenView(screen: AppScreen) {
    const properties: { [name: string]: any } = {
      screen_name: screen,
    };

    hAnalyticsNetworking.send({
      name: "app_screen_view",
      properties: properties,
    });
  }

  // When a file, video, image, gif is sent in the chat

  static chatRichMessageSent() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "chat_rich_message_sent",
      properties: properties,
    });
  }

  // When a text message is sent in the chat

  static chatTextMessageSent() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "chat_text_message_sent",
      properties: properties,
    });
  }

  // When a claim card has been clicked on screen

  static claimCardClick(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    hAnalyticsNetworking.send({
      name: "claim_card_click",
      properties: properties,
    });
  }

  // When a claim card has been shown on screen

  static claimCardVisible(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    hAnalyticsNetworking.send({
      name: "claim_card_visible",
      properties: properties,
    });
  }

  // When contact chat is tapped on claim details

  static claimDetailClickOpenChat(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    hAnalyticsNetworking.send({
      name: "claim_status_detail_click_open_chat",
      properties: properties,
    });
  }

  // When a claims recording has been played in the claims status screen

  static claimsDetailRecordingPlayed(claimId: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,
    };

    hAnalyticsNetworking.send({
      name: "claims_detail_recording_played",
      properties: properties,
    });
  }

  // When a deep link was opened

  static deepLinkOpened(type: string) {
    const properties: { [name: string]: any } = {
      type: type,
    };

    hAnalyticsNetworking.send({
      name: "deep_link_opened",
      properties: properties,
    });
  }

  // When the charity screen is shown
  // @deprecated Replaced with screenView
  static screenViewCharity() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_charity",
      properties: properties,
    });
  }

  // When the contact info screen is shown
  // @deprecated Replaced with screenView
  static screenViewContactInfo() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_contact_info",
      properties: properties,
    });
  }

  // When the detail screen of a cross sell is shown
  // @deprecated Replaced with screenView
  static screenViewCrossSellDetail(typeOfContract: string) {
    const properties: { [name: string]: any } = {
      type_of_contract: typeOfContract,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_cross_sell_detail",
      properties: properties,
    });
  }

  // When Hedvig Forever is shown
  // @deprecated Replaced with screenView
  static screenViewForever() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_forever",
      properties: properties,
    });
  }

  // When Home tab is shown
  // @deprecated Replaced with screenView
  static screenViewHome() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_home",
      properties: properties,
    });
  }

  // When detail screen of an insurance is shown
  // @deprecated Replaced with screenView
  static screenViewInsuranceDetail(contractId: string) {
    const properties: { [name: string]: any } = {
      contract_id: contractId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_insurance_detail",
      properties: properties,
    });
  }

  // When Insurances tab is shown
  // @deprecated Replaced with screenView
  static screenViewInsurances() {
    const properties: { [name: string]: any } = {};

    const graphQLVariables: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_insurances",
      properties: properties,
      graphql: {
        query: `
                    query ScreenViewInsurances {
	contracts {
		typeOfContract
	}
}
                    `,
        selectors: [
          {
            name: "has_accident_insurance",
            path: "(contracts[?contains(typeOfContract, 'ACCIDENT') == `true`] && true) == true",
          },

          {
            name: "has_home_insurance",
            path: "((contracts[?contains(typeOfContract, 'HOME') == `true`] || contracts[?contains(typeOfContract, 'APARTMENT') == `true`] || contracts[?contains(typeOfContract, 'HOUSE') == `true`]) && true) == true",
          },
        ],
        variables: graphQLVariables,
      },
    });
  }

  // When market picker is shown

  static screenViewMarketPicker() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_market_picker",
      properties: properties,
    });
  }

  // When moving flow intro screen is shown
  // @deprecated Replaced with screenView
  static screenViewMovingFlowIntro() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_moving_flow_intro",
      properties: properties,
    });
  }

  // When Offer screen is shown

  static screenViewOffer(offerIds: string[]) {
    const properties: { [name: string]: any } = {
      offer_ids: offerIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      offer_ids: offerIds,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_offer",
      properties: properties,
      graphql: {
        query: `
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
                    `,
        selectors: [
          {
            name: "type_of_contracts",
            path: "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
          },

          {
            name: "initiated_from",
            path: "quoteBundle.quotes[0].initiatedFrom",
          },
        ],
        variables: graphQLVariables,
      },
    });
  }

  // When Profile tab is shown
  // @deprecated Replaced with screenView
  static screenViewProfile() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_profile",
      properties: properties,
    });
  }

  // When app information screen was shown
  // @deprecated Replaced with screenView
  static screenViewAppInformation() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_app_information",
      properties: properties,
    });
  }

  // When app settings screen was shown
  // @deprecated Replaced with screenView
  static screenViewAppSettings() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_app_settings",
      properties: properties,
    });
  }

  // When the chat is shown
  // @deprecated Replaced with screenView
  static screenViewChat() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_chat",
      properties: properties,
    });
  }

  // When the honor pledge screen is shown
  // @deprecated Replaced with screenView
  static screenViewClaimHonorPledge() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_claim_honor_pledge",
      properties: properties,
    });
  }

  // When the claims status detail screen is shown
  // @deprecated Replaced with screenView
  static screenViewClaimsStatusDetail(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_claims_status_detail",
      properties: properties,
    });
  }

  // When a common claim detail screen is shown
  // @deprecated Replaced with screenView
  static screenViewCommonClaimDetail(id: string) {
    const properties: { [name: string]: any } = {
      id: id,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_common_claim_detail",
      properties: properties,
    });
  }

  // Connecting payment with Adyen screen was shown
  // @deprecated Replaced with screenView
  static screenViewConnectPaymentAdyen() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_connect_payment_adyen",
      properties: properties,
    });
  }

  // When payment connection did fail
  // @deprecated Replaced with screenView
  static screenViewConnectPaymentFailed() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_connect_payment_failed",
      properties: properties,
    });
  }

  // When payment was connected successfully
  // @deprecated Replaced with screenView
  static screenViewConnectPaymentSuccess() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_connect_payment_success",
      properties: properties,
    });
  }

  // Connecting payment with Trustly screen was shown
  // @deprecated Replaced with screenView
  static screenViewConnectPaymentTrustly() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_connect_payment_trustly",
      properties: properties,
    });
  }

  // When data collection waiting for authentication screen is shown
  // @deprecated Replaced with screenView
  static screenViewDataCollectionAuthenticating(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_data_collection_authenticating",
      properties: properties,
    });
  }

  // When data collection credentials screen is shown (Insurely)
  // @deprecated Replaced with screenView
  static screenViewDataCollectionCredentials(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_data_collection_credentials",
      properties: properties,
    });
  }

  // When data collection failed
  // @deprecated Replaced with screenView
  static screenViewDataCollectionFail(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_data_collection_fail",
      properties: properties,
    });
  }

  // When data collection intro screen is shown (Insurely)
  // @deprecated Replaced with screenView
  static screenViewDataCollectionIntro(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_data_collection_intro",
      properties: properties,
    });
  }

  // When data collection succeeded
  // @deprecated Replaced with screenView
  static screenViewDataCollectionSuccess(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_data_collection_success",
      properties: properties,
    });
  }

  // When embark is shown
  // @deprecated Replaced with screenView
  static screenViewEmbark(storyName: string) {
    const properties: { [name: string]: any } = {
      story_name: storyName,
    };

    hAnalyticsNetworking.send({
      name: "screen_view_embark",
      properties: properties,
    });
  }

  // When embark tooltip screen is shown
  // @deprecated Replaced with screenView
  static screenViewEmbarkTooltip() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_embark_tooltip",
      properties: properties,
    });
  }

  // When marketing screen is shown
  // @deprecated Replaced with screenView
  static screenViewMarketing() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_marketing",
      properties: properties,
    });
  }

  // Payments screen was shown
  // @deprecated Replaced with screenView
  static screenViewPayments() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "screen_view_payments",
      properties: properties,
    });
  }

  // When embark does an external redirect

  static embarkExternalRedirect(location: string) {
    const properties: { [name: string]: any } = {
      location: location,
    };

    hAnalyticsNetworking.send({
      name: "embark_external_redirect",
      properties: properties,
    });
  }

  // When embark goes back one passage

  static embarkPassageGoBack(storyName: string, passageName: string) {
    const properties: { [name: string]: any } = {
      originated_from_embark_story: storyName,

      passage_name: passageName,
    };

    hAnalyticsNetworking.send({
      name: "embark_passage_go_back",
      properties: properties,
    });
  }

  // When embark sends a tracking event

  static embarkTrack(
    storyName: string,
    eventName: string,
    store: { [name: string]: string | null }
  ) {
    const properties: { [name: string]: any } = {
      originated_from_embark_story: storyName,

      event_name: eventName,

      store: store,
    };

    hAnalyticsNetworking.send({
      name: "embark_track",
      properties: properties,
    });
  }

  // When embark does a varianted offer redirect

  static embarkVariantedOfferRedirect(allIds: string[], selectedIds: string[]) {
    const properties: { [name: string]: any } = {
      all_ids: allIds,

      selected_ids: selectedIds,
    };

    hAnalyticsNetworking.send({
      name: "embark_varianted_offer_redirect",
      properties: properties,
    });
  }

  // Experiment where evaluated, typically means it was shown on screen or similar

  static experimentEvaluated(name: string, variant: string) {
    const properties: { [name: string]: any } = {
      name: name,

      variant: variant,
    };

    hAnalyticsNetworking.send({
      name: "experiment_evaluated",
      properties: properties,
    });
  }

  // Experiments where loaded from server

  static experimentsLoaded(experiments: string[]) {
    const properties: { [name: string]: any } = {
      experiments: experiments,
    };

    hAnalyticsNetworking.send({
      name: "experiments_loaded",
      properties: properties,
    });
  }

  // User just logged in

  static loggedIn() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "logged_in",
      properties: properties,
    });
  }

  // User just logged out

  static loggedOut() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "logged_out",
      properties: properties,
    });
  }

  // A push notification was opened

  static notificationOpened(type: string) {
    const properties: { [name: string]: any } = {
      type: type,
    };

    hAnalyticsNetworking.send({
      name: "notification_opened",
      properties: properties,
    });
  }

  // The state of notification permission:
  //   granted == true: push notifications permissions are approved
  //   granted == false: push notifications permissions are denied
  //   granted == null: push notifications permissions are not determined yet / unknown
  //

  static notificationPermission(granted: boolean | null) {
    const properties: { [name: string]: any } = {
      granted: granted,
    };

    hAnalyticsNetworking.send({
      name: "notification_permission",
      properties: properties,
    });
  }

  // When a user clicks "Already a member? Log in" on the marketing screen

  static buttonClickMarketingLogin() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "button_click_marketing_login",
      properties: properties,
    });
  }

  // When a user clicks "Get a price quote" on the marketing screen

  static buttonClickMarketingOnboard() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "button_click_marketing_onboard",
      properties: properties,
    });
  }

  // When an embark flow is choosen on the choose screen

  static onboardingChooseEmbarkFlow(embarkStoryId: string) {
    const properties: { [name: string]: any } = {
      embark_story_id: embarkStoryId,
    };

    hAnalyticsNetworking.send({
      name: "onboarding_choose_embark_flow",
      properties: properties,
    });
  }

  // When the user decided to skip data collection

  static dataCollectionSkipped(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    hAnalyticsNetworking.send({
      name: "data_collection_skipped",
      properties: properties,
    });
  }

  // When a market was selected on the market picker screen

  static marketSelected(locale: string) {
    const properties: { [name: string]: any } = {
      locale: locale,
    };

    hAnalyticsNetworking.send({
      name: "market_selected",
      properties: properties,
    });
  }

  // A payment card was shown on the home screen

  static homePaymentCardVisible() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "home_payment_card_visible",
      properties: properties,
    });
  }

  // When quotes are signed in the offer screen

  static quotesSigned(quoteIds: string[]) {
    const properties: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    hAnalyticsNetworking.send({
      name: "quotes_signed",
      properties: properties,
      graphql: {
        query: `
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
                    `,
        selectors: [
          {
            name: "type_of_contracts",
            path: "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
          },

          {
            name: "initiated_from",
            path: "quoteBundle.quotes[0].initiatedFrom",
          },
        ],
        variables: graphQLVariables,
      },
    });
  }

  // When the user received some quotes

  static receivedQuotes(quoteIds: string[]) {
    const properties: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    hAnalyticsNetworking.send({
      name: "received_quotes",
      properties: properties,
      graphql: {
        query: `
                    query ReceivedQuotes($quote_ids: [ID!]!) {
	quoteBundle(input: {
		ids: $quote_ids
	}) {
		quotes {
			typeOfContract
			initiatedFrom
		}
	}
}
                    `,
        selectors: [
          {
            name: "type_of_contracts",
            path: "quoteBundle.quotes[*].typeOfContract | sort(@)",
          },

          {
            name: "initiated_from",
            path: "quoteBundle.quotes[0].initiatedFrom",
          },
        ],
        variables: graphQLVariables,
      },
    });
  }

  // App was put into background

  static appBackground() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "app_background",
      properties: properties,
    });
  }

  // App was resumed after being in background

  static appResumed() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "app_resumed",
      properties: properties,
    });
  }

  // App was shutdown

  static appShutdown() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "app_shutdown",
      properties: properties,
    });
  }

  // App was started

  static appStarted() {
    const properties: { [name: string]: any } = {};

    hAnalyticsNetworking.send({
      name: "app_started",
      properties: properties,
    });
  }
}

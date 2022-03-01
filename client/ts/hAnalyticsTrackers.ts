import { hAnalyticsNetworking } from "./hAnalyticsNetworking";

// An app screen
export enum AppScreen {
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
  networking: hAnalyticsNetworking;

  constructor(networking: hAnalyticsNetworking) {
    this.networking = networking;
  }

  // identifies and registers the trackingId
  identify() {
    this.networking.identify();
  }

  // A screen was shown in the app

  screenView(screen: AppScreen) {
    const properties: { [name: string]: any } = {
      screen_name: screen,
    };

    this.networking.send({
      name: "app_screen_view",
      properties: properties,
    });
  }

  // When a file, video, image, gif is sent in the chat

  chatRichMessageSent() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "chat_rich_message_sent",
      properties: properties,
    });
  }

  // When a text message is sent in the chat

  chatTextMessageSent() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "chat_text_message_sent",
      properties: properties,
    });
  }

  // When a claim card has been clicked on screen

  claimCardClick(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    this.networking.send({
      name: "claim_card_click",
      properties: properties,
    });
  }

  // When a claim card has been shown on screen

  claimCardVisible(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    this.networking.send({
      name: "claim_card_visible",
      properties: properties,
    });
  }

  // When contact chat is tapped on claim details

  claimDetailClickOpenChat(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    this.networking.send({
      name: "claim_status_detail_click_open_chat",
      properties: properties,
    });
  }

  // When a claims recording has been played in the claims status screen

  claimsDetailRecordingPlayed(claimId: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,
    };

    this.networking.send({
      name: "claims_detail_recording_played",
      properties: properties,
    });
  }

  // When a deep link was opened

  deepLinkOpened(type: string) {
    const properties: { [name: string]: any } = {
      type: type,
    };

    this.networking.send({
      name: "deep_link_opened",
      properties: properties,
    });
  }

  // When the charity screen is shown
  // @deprecated Replaced with screenView
  screenViewCharity() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_charity",
      properties: properties,
    });
  }

  // When the contact info screen is shown
  // @deprecated Replaced with screenView
  screenViewContactInfo() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_contact_info",
      properties: properties,
    });
  }

  // When the detail screen of a cross sell is shown
  // @deprecated Replaced with screenView
  screenViewCrossSellDetail(typeOfContract: string) {
    const properties: { [name: string]: any } = {
      type_of_contract: typeOfContract,
    };

    this.networking.send({
      name: "screen_view_cross_sell_detail",
      properties: properties,
    });
  }

  // When Hedvig Forever is shown
  // @deprecated Replaced with screenView
  screenViewForever() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_forever",
      properties: properties,
    });
  }

  // When Home tab is shown
  // @deprecated Replaced with screenView
  screenViewHome() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_home",
      properties: properties,
    });
  }

  // When detail screen of an insurance is shown
  // @deprecated Replaced with screenView
  screenViewInsuranceDetail(contractId: string) {
    const properties: { [name: string]: any } = {
      contract_id: contractId,
    };

    this.networking.send({
      name: "screen_view_insurance_detail",
      properties: properties,
    });
  }

  // When Insurances tab is shown
  // @deprecated Replaced with screenView
  screenViewInsurances() {
    const properties: { [name: string]: any } = {};

    const graphQLVariables: { [name: string]: any } = {};

    this.networking.send({
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

  screenViewMarketPicker() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_market_picker",
      properties: properties,
    });
  }

  // When moving flow intro screen is shown
  // @deprecated Replaced with screenView
  screenViewMovingFlowIntro() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_moving_flow_intro",
      properties: properties,
    });
  }

  // When Offer screen is shown

  screenViewOffer(offerIds: string[]) {
    const properties: { [name: string]: any } = {
      offer_ids: offerIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      offer_ids: offerIds,
    };

    this.networking.send({
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
  screenViewProfile() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_profile",
      properties: properties,
    });
  }

  // When app information screen was shown
  // @deprecated Replaced with screenView
  screenViewAppInformation() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_app_information",
      properties: properties,
    });
  }

  // When app settings screen was shown
  // @deprecated Replaced with screenView
  screenViewAppSettings() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_app_settings",
      properties: properties,
    });
  }

  // When the chat is shown
  // @deprecated Replaced with screenView
  screenViewChat() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_chat",
      properties: properties,
    });
  }

  // When the honor pledge screen is shown
  // @deprecated Replaced with screenView
  screenViewClaimHonorPledge() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_claim_honor_pledge",
      properties: properties,
    });
  }

  // When the claims status detail screen is shown
  // @deprecated Replaced with screenView
  screenViewClaimsStatusDetail(claimId: string, claimStatus: string) {
    const properties: { [name: string]: any } = {
      claim_id: claimId,

      claim_status: claimStatus,
    };

    this.networking.send({
      name: "screen_view_claims_status_detail",
      properties: properties,
    });
  }

  // When a common claim detail screen is shown
  // @deprecated Replaced with screenView
  screenViewCommonClaimDetail(id: string) {
    const properties: { [name: string]: any } = {
      id: id,
    };

    this.networking.send({
      name: "screen_view_common_claim_detail",
      properties: properties,
    });
  }

  // Connecting payment with Adyen screen was shown
  // @deprecated Replaced with screenView
  screenViewConnectPaymentAdyen() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_connect_payment_adyen",
      properties: properties,
    });
  }

  // When payment connection did fail
  // @deprecated Replaced with screenView
  screenViewConnectPaymentFailed() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_connect_payment_failed",
      properties: properties,
    });
  }

  // When payment was connected successfully
  // @deprecated Replaced with screenView
  screenViewConnectPaymentSuccess() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_connect_payment_success",
      properties: properties,
    });
  }

  // Connecting payment with Trustly screen was shown
  // @deprecated Replaced with screenView
  screenViewConnectPaymentTrustly() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_connect_payment_trustly",
      properties: properties,
    });
  }

  // When data collection waiting for authentication screen is shown
  // @deprecated Replaced with screenView
  screenViewDataCollectionAuthenticating(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "screen_view_data_collection_authenticating",
      properties: properties,
    });
  }

  // When data collection credentials screen is shown (Insurely)
  // @deprecated Replaced with screenView
  screenViewDataCollectionCredentials(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "screen_view_data_collection_credentials",
      properties: properties,
    });
  }

  // When data collection failed
  // @deprecated Replaced with screenView
  screenViewDataCollectionFail(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "screen_view_data_collection_fail",
      properties: properties,
    });
  }

  // When data collection intro screen is shown (Insurely)
  // @deprecated Replaced with screenView
  screenViewDataCollectionIntro(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "screen_view_data_collection_intro",
      properties: properties,
    });
  }

  // When data collection succeeded
  // @deprecated Replaced with screenView
  screenViewDataCollectionSuccess(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "screen_view_data_collection_success",
      properties: properties,
    });
  }

  // When embark is shown
  // @deprecated Replaced with screenView
  screenViewEmbark(storyName: string) {
    const properties: { [name: string]: any } = {
      story_name: storyName,
    };

    this.networking.send({
      name: "screen_view_embark",
      properties: properties,
    });
  }

  // When embark tooltip screen is shown
  // @deprecated Replaced with screenView
  screenViewEmbarkTooltip() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_embark_tooltip",
      properties: properties,
    });
  }

  // When marketing screen is shown
  // @deprecated Replaced with screenView
  screenViewMarketing() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_marketing",
      properties: properties,
    });
  }

  // Payments screen was shown
  // @deprecated Replaced with screenView
  screenViewPayments() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "screen_view_payments",
      properties: properties,
    });
  }

  // When embark does an external redirect

  embarkExternalRedirect(location: string) {
    const properties: { [name: string]: any } = {
      location: location,
    };

    this.networking.send({
      name: "embark_external_redirect",
      properties: properties,
    });
  }

  // When embark goes back one passage

  embarkPassageGoBack(storyName: string, passageName: string) {
    const properties: { [name: string]: any } = {
      originated_from_embark_story: storyName,

      passage_name: passageName,
    };

    this.networking.send({
      name: "embark_passage_go_back",
      properties: properties,
    });
  }

  // When embark sends a tracking event

  embarkTrack(
    storyName: string,
    eventName: string,
    store: { [name: string]: string | null }
  ) {
    const properties: { [name: string]: any } = {
      originated_from_embark_story: storyName,

      event_name: eventName,

      store: store,
    };

    this.networking.send({
      name: "embark_track",
      properties: properties,
    });
  }

  // When embark does a varianted offer redirect

  embarkVariantedOfferRedirect(allIds: string[], selectedIds: string[]) {
    const properties: { [name: string]: any } = {
      all_ids: allIds,

      selected_ids: selectedIds,
    };

    this.networking.send({
      name: "embark_varianted_offer_redirect",
      properties: properties,
    });
  }

  // Experiment where evaluated, typically means it was shown on screen or similar

  experimentEvaluated(name: string, variant: string) {
    const properties: { [name: string]: any } = {
      name: name,

      variant: variant,
    };

    this.networking.send({
      name: "experiment_evaluated",
      properties: properties,
    });
  }

  // Experiments where loaded from server

  experimentsLoaded(experiments: string[]) {
    const properties: { [name: string]: any } = {
      experiments: experiments,
    };

    this.networking.send({
      name: "experiments_loaded",
      properties: properties,
    });
  }

  // User just logged in

  loggedIn() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "logged_in",
      properties: properties,
    });
  }

  // User just logged out

  loggedOut() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "logged_out",
      properties: properties,
    });
  }

  // A push notification was opened

  notificationOpened(type: string) {
    const properties: { [name: string]: any } = {
      type: type,
    };

    this.networking.send({
      name: "notification_opened",
      properties: properties,
    });
  }

  // The state of notification permission:
  //   granted == true: push notifications permissions are approved
  //   granted == false: push notifications permissions are denied
  //   granted == null: push notifications permissions are not determined yet / unknown
  //

  notificationPermission(granted: boolean | null) {
    const properties: { [name: string]: any } = {
      granted: granted,
    };

    this.networking.send({
      name: "notification_permission",
      properties: properties,
    });
  }

  // When a user clicks "Already a member? Log in" on the marketing screen

  buttonClickMarketingLogin() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "button_click_marketing_login",
      properties: properties,
    });
  }

  // When a user clicks "Get a price quote" on the marketing screen

  buttonClickMarketingOnboard() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "button_click_marketing_onboard",
      properties: properties,
    });
  }

  // When an embark flow is choosen on the choose screen

  onboardingChooseEmbarkFlow(embarkStoryId: string) {
    const properties: { [name: string]: any } = {
      embark_story_id: embarkStoryId,
    };

    this.networking.send({
      name: "onboarding_choose_embark_flow",
      properties: properties,
    });
  }

  // When the user decided to skip data collection

  dataCollectionSkipped(providerId: string) {
    const properties: { [name: string]: any } = {
      provider_id: providerId,
    };

    this.networking.send({
      name: "data_collection_skipped",
      properties: properties,
    });
  }

  // When a market was selected on the market picker screen

  marketSelected(locale: string) {
    const properties: { [name: string]: any } = {
      locale: locale,
    };

    this.networking.send({
      name: "market_selected",
      properties: properties,
    });
  }

  // A payment card was shown on the home screen

  homePaymentCardVisible() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "home_payment_card_visible",
      properties: properties,
    });
  }

  // When quotes are signed in the offer screen

  quotesSigned(quoteIds: string[]) {
    const properties: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    this.networking.send({
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

  receivedQuotes(quoteIds: string[]) {
    const properties: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    const graphQLVariables: { [name: string]: any } = {
      quote_ids: quoteIds,
    };

    this.networking.send({
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

  appBackground() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "app_background",
      properties: properties,
    });
  }

  // App was resumed after being in background

  appResumed() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "app_resumed",
      properties: properties,
    });
  }

  // App was shutdown

  appShutdown() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "app_shutdown",
      properties: properties,
    });
  }

  // App was started

  appStarted() {
    const properties: { [name: string]: any } = {};

    this.networking.send({
      name: "app_started",
      properties: properties,
    });
  }
}

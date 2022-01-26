import Foundation

public struct hAnalyticsEvent {
  public let name: String
  public let properties: [String: Any?]
  public let graphql: [String: Any]?

  public init(name: String, properties: [String: Any?], graphql: [String: Any]? = nil) {
    self.name = name
    self.properties = properties
    self.graphql = graphql
  }
}

public struct hAnalyticsParcel {
  var sender: () -> Void

  init(_ sender: @escaping () -> Void) { self.sender = sender }

  /// sends the event instantly
  public func send() { sender() }
}

extension hAnalyticsEvent {
  /// identifies and registers the trackingId
  public static func identify() { hAnalyticsNetworking.identify() }

  /// When a claim card has been clicked on screen
  public static func claimCardClick(claimId: String, claimStatus: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "claim_card_click", properties: properties))
    }
  }

  /// When a claim card has been shown on screen
  public static func claimCardVisible(claimId: String, claimStatus: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "claim_card_visible", properties: properties))
    }
  }

  /// When contact chat is tapped on claim details
  public static func claimDetailClickOpenChat(claimId: String, claimStatus: String)
    -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claim_status_detail_click_open_chat", properties: properties)
      )
    }
  }

  /// When a claims recording has been played in the claims status screen
  public static func claimsDetailRecordingPlayed(claimId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["claim_id": claimId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claims_detail_recording_played", properties: properties)
      )
    }
  }

  /// When the claims status detail screen is shown
  public static func claimsStatusDetailScreenView(claimId: String, claimStatus: String)
    -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claims_status_detail_screen_view", properties: properties)
      )
    }
  }

  /// When a deep link was opened
  public static func deepLinkOpened(type: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["type": type]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "deep_link_opened", properties: properties))
    }
  }

  /// When embark does an external redirect
  public static func embarkExternalRedirect(location: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["location": location]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "embark_external_redirect", properties: properties)
      )
    }
  }

  /// When embark goes back one passage
  public static func embarkPassageGoBack(storyName: String, passageName: String) -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [
        "originated_from_embark_story": storyName, "passage_name": passageName,
      ]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "embark_passage_go_back", properties: properties)
      )
    }
  }

  /// When embark sends a tracking event
  public static func embarkTrack(storyName: String, eventName: String, store: [String: Any])
    -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [
        "originated_from_embark_story": storyName, "event_name": eventName, "store": store,
      ]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "embark_track", properties: properties))
    }
  }

  /// When embark does a varianted offer redirect
  public static func embarkVariantedOfferRedirect(allIds: [String], selectedIds: [String])
    -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["all_ids": allIds, "selected_ids": selectedIds]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "embark_varianted_offer_redirect", properties: properties)
      )
    }
  }

  /// When embark is shown
  public static func screenViewEmbark() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "screen_view_embark", properties: properties))
    }
  }

  /// When quotes are signed in the offer screen
  public static func quotesSigned(quoteIds: [String]) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["quote_ids": quoteIds]

      let graphQLVariables: [String: Any?] = ["quote_ids": quoteIds]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "quotes_signed",
          properties: properties,
          graphql: [
            "query": """
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
            "selectors": [
              [
                "name": "type_of_contracts",
                "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
              ], ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// When a user clicks &#34;Already a member? Log in&#34; on the marketing screen
  public static func buttonClickMarketingLogin() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "button_click_marketing_login", properties: properties)
      )
    }
  }

  /// When a user clicks &#34;Get a price quote&#34; on the marketing screen
  public static func buttonClickMarketingOnboard() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "button_click_marketing_onboard", properties: properties)
      )
    }
  }

  /// When an embark flow is choosen on the choose screen
  public static func onboardingChooseEmbarkFlow(embarkStoryId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["embark_story_id": embarkStoryId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "onboarding_choose_embark_flow", properties: properties)
      )
    }
  }

  /// When the user decided to skip data collection
  public static func dataCollectionSkipped(providerId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "data_collection_skipped", properties: properties)
      )
    }
  }

  /// When data collection waiting for authentication screen is shown
  public static func screenViewDataCollectionAuthenticating(providerId: String) -> hAnalyticsParcel
  {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_data_collection_authenticating", properties: properties)
      )
    }
  }

  /// When data collection credentials screen is shown (Insurely)
  public static func screenViewDataCollectionCredentials(providerId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_data_collection_credentials", properties: properties)
      )
    }
  }

  /// When data collection failed
  public static func screenViewDataCollectionFail(providerId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_data_collection_fail", properties: properties)
      )
    }
  }

  /// When data collection intro screen is shown (Insurely)
  public static func screenViewDataCollectionIntro(providerId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_data_collection_intro", properties: properties)
      )
    }
  }

  /// When data collection succeeded
  public static func screenViewDataCollectionSuccess(providerId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["provider_id": providerId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_data_collection_success", properties: properties)
      )
    }
  }

  /// When market picker is shown
  public static func screenViewMarketPicker() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_market_picker", properties: properties)
      )
    }
  }

  /// When a market was selected on the market picker screen
  public static func marketSelected(locale: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["locale": locale]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "market_selected", properties: properties))
    }
  }

  /// When Offer screen is shown
  public static func screenViewOffer(offerIds: [String]) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["offer_ids": offerIds]

      let graphQLVariables: [String: Any?] = ["offer_ids": offerIds]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "screen_view_offer",
          properties: properties,
          graphql: [
            "query": """
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
            "selectors": [
              [
                "name": "type_of_contracts",
                "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
              ], ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// When marketing screen is shown
  public static func screenViewMarketing() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_marketing", properties: properties)
      )
    }
  }

  /// A payment card was shown on the home screen
  public static func homePaymentCardVisible() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "home_payment_card_visible", properties: properties)
      )
    }
  }

  /// Connecting payment with Adyen screen was shown
  public static func screenViewConnectPaymentAdyen() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_adyen", properties: properties)
      )
    }
  }

  /// When payment connection did fail
  public static func screenViewConnectPaymentFailed() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_failed", properties: properties)
      )
    }
  }

  /// When payment was connected successfully
  public static func screenViewConnectPaymentSuccess() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_success", properties: properties)
      )
    }
  }

  /// Connecting payment with Trustly screen was shown
  public static func screenViewConnectPaymentTrustly() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_trustly", properties: properties)
      )
    }
  }

  /// When the detail screen of a cross sell is shown
  public static func screenViewCrossSellDetail(typeOfContract: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["type_of_contract": typeOfContract]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_cross_sell_detail", properties: properties)
      )
    }
  }

  /// When Hedvig Forever is shown
  public static func screenViewForever() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_forever", properties: properties)
      )
    }
  }

  /// When Home tab is shown
  public static func screenViewHome() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "screen_view_home", properties: properties))
    }
  }

  /// When detail screen of an insurance is shown
  public static func screenViewInsuranceDetail(contractId: String) -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = ["contract_id": contractId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_insurance_detail", properties: properties)
      )
    }
  }

  /// When Insurances tab is shown
  public static func screenViewInsurances() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      let graphQLVariables: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "screen_view_insurances",
          properties: properties,
          graphql: [
            "query": """
              query ScreenViewInsurances {
              	contracts {
              		typeOfContract
              	}
              }
              """,
            "selectors": [
              [
                "name": "has_accident_insurance",
                "path":
                  "(contracts[?contains(typeOfContract, 'ACCIDENT') == `true`] && true) == true",
              ],
              [
                "name": "has_home_insurance",
                "path":
                  "((contracts[?contains(typeOfContract, 'HOME') == `true`] || contracts[?contains(typeOfContract, 'APARTMENT') == `true`] || contracts[?contains(typeOfContract, 'HOUSE') == `true`]) && true) == true",
              ],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// When moving flow intro screen is shown
  public static func screenViewMovingFlowIntro() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_moving_flow_intro", properties: properties)
      )
    }
  }

  /// When Profile tab is shown
  public static func screenViewProfile() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_profile", properties: properties)
      )
    }
  }

  /// App was put into background
  public static func appBackground() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "app_background", properties: properties))
    }
  }

  /// App was resumed after being in background
  public static func appResumed() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "app_resumed", properties: properties))
    }
  }

  /// App was shutdown
  public static func appShutdown() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "app_shutdown", properties: properties))
    }
  }

  /// App was started
  public static func appStarted() -> hAnalyticsParcel {
    return hAnalyticsParcel {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "app_started", properties: properties))
    }
  }

}

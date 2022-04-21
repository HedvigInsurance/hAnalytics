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

    init(_ sender: @escaping () -> Void) {
        self.sender = sender
    }

    /// sends the event instantly
    public func send() {
        sender()
    }
}



    

        /// An app screen
        public enum AppScreen: String {
            
                case offer = "offer"
            
                case claimsStatusDetail = "claims_status_detail"
            
                case claimHonorPledge = "claim_honor_pledge"
            
                case commonClaimDetail = "common_claim_detail"
            
                case embark = "embark"
            
                case embarkTooltip = "embark_tooltip"
            
                case marketPicker = "market_picker"
            
                case marketing = "marketing"
            
                case dataCollectionAuthenticating = "data_collection_authenticating"
            
                case dataCollectionCredentials = "data_collection_credentials"
            
                case dataCollectionFail = "data_collection_fail"
            
                case dataCollectionIntro = "data_collection_intro"
            
                case dataCollectionSuccess = "data_collection_success"
            
                case connectPaymentAdyen = "connect_payment_adyen"
            
                case connectPaymentTrustly = "connect_payment_trustly"
            
                case connectPaymentFailed = "connect_payment_failed"
            
                case connectPaymentSuccess = "connect_payment_success"
            
                case payments = "payments"
            
                case charity = "charity"
            
                case contactInfo = "contact_info"
            
                case crossSellDetail = "cross_sell_detail"
            
                case forever = "forever"
            
                case home = "home"
            
                case insuranceDetail = "insurance_Detail"
            
                case insurances = "insurances"
            
                case movingFlowIntro = "moving_flow_intro"
            
                case profile = "profile"
            
                case appInformation = "app_information"
            
                case appSettings = "app_settings"
            
                case chat = "chat"
            
        }

    




extension hAnalyticsEvent {
    /// identifies and registers the trackingId
    public static func identify() {
        hAnalyticsNetworking.identify()
    }


    /// A screen was shown in the app
    
    public static func screenView(screen: AppScreen) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "screen_name": screen.rawValue,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "app_screen_view",
                    properties: properties
                ))
        
        }
   }

    /// When a file, video, image, gif is sent in the chat
    
    public static func chatRichMessageSent() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "chat_rich_message_sent",
                    properties: properties
                ))
        
        }
   }

    /// When a text message is sent in the chat
    
    public static func chatTextMessageSent() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "chat_text_message_sent",
                    properties: properties
                ))
        
        }
   }

    /// When a claim card has been clicked on screen
    
    public static func claimCardClick(claimId: String,claimStatus: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "claim_id": claimId,
                    
                            "claim_status": claimStatus,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "claim_card_click",
                    properties: properties
                ))
        
        }
   }

    /// When a claim card has been shown on screen
    
    public static func claimCardVisible(claimId: String,claimStatus: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "claim_id": claimId,
                    
                            "claim_status": claimStatus,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "claim_card_visible",
                    properties: properties
                ))
        
        }
   }

    /// When contact chat is tapped on claim details
    
    public static func claimDetailClickOpenChat(claimId: String,claimStatus: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "claim_id": claimId,
                    
                            "claim_status": claimStatus,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "claim_status_detail_click_open_chat",
                    properties: properties
                ))
        
        }
   }

    /// When a claims recording has been played in the claims status screen
    
    public static func claimsDetailRecordingPlayed(claimId: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "claim_id": claimId,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "claims_detail_recording_played",
                    properties: properties
                ))
        
        }
   }

    /// When the honor pledge slider has been slided
    
    public static func honorPledgeConfirmed() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "honor_pledge_confirmed",
                    properties: properties
                ))
        
        }
   }

    /// When a deep link was opened
    
    public static func deepLinkOpened(type: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "type": type,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "deep_link_opened",
                    properties: properties
                ))
        
        }
   }

    /// User just logged in
    
    public static func loggedIn() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "logged_in",
                    properties: properties
                ))
        
        }
   }

    /// User just logged out
    
    public static func loggedOut() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "logged_out",
                    properties: properties
                ))
        
        }
   }

    /// A push notification was opened
    
    public static func notificationOpened(type: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "type": type,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "notification_opened",
                    properties: properties
                ))
        
        }
   }

    /// The state of notification permission:
///   granted == true: push notifications permissions are approved
///   granted == false: push notifications permissions are denied
///   granted == null: push notifications permissions are not determined yet / unknown
/// 
    
    public static func notificationPermission(granted: Bool?) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "granted": granted,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "notification_permission",
                    properties: properties
                ))
        
        }
   }

    /// When a user clicks "Already a member? Log in" on the marketing screen
    
    public static func buttonClickMarketingLogin() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "button_click_marketing_login",
                    properties: properties
                ))
        
        }
   }

    /// When a user clicks "Get a price quote" on the marketing screen
    
    public static func buttonClickMarketingOnboard() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "button_click_marketing_onboard",
                    properties: properties
                ))
        
        }
   }

    /// When an embark flow is choosen on the choose screen
    
    public static func onboardingChooseEmbarkFlow(embarkStoryId: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "embark_story_id": embarkStoryId,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "onboarding_choose_embark_flow",
                    properties: properties
                ))
        
        }
   }

    /// When the user decided to skip data collection
    
    public static func dataCollectionSkipped(providerId: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "provider_id": providerId,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "data_collection_skipped",
                    properties: properties
                ))
        
        }
   }

    /// When a market was selected on the market picker screen
    
    public static func marketSelected(locale: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "locale": locale,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "market_selected",
                    properties: properties
                ))
        
        }
   }

    /// A payment card was clicked on the home screen
    
    public static func homePaymentCardClick() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "home_payment_card_click",
                    properties: properties
                ))
        
        }
   }

    /// A payment card was shown on the home screen
    
    public static func homePaymentCardVisible() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "home_payment_card_visible",
                    properties: properties
                ))
        
        }
   }

    /// Payment has been connected
    
    public static func paymentConnected() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "payment_connected",
                    properties: properties
                ))
        
        }
   }

    /// When a user starts to record in an embark flow
    
    public static func embarkAudioRecordingBegin(storyName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "story_name": storyName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_audio_recording_begin",
                    properties: properties
                ))
        
        }
   }

    /// When a user starts to playback a previously recordered voice memo in an embark flow
    
    public static func embarkAudioRecordingPlayback(storyName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "story_name": storyName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_audio_recording_playback",
                    properties: properties
                ))
        
        }
   }

    /// When a user removes previous voice memo and records a new one in Embark
    
    public static func embarkAudioRecordingRetry(storyName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "story_name": storyName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_audio_recording_retry",
                    properties: properties
                ))
        
        }
   }

    /// When a user stopped the recording
    
    public static func embarkAudioRecordingStopped(storyName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "story_name": storyName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_audio_recording_stopped",
                    properties: properties
                ))
        
        }
   }

    /// When a user submitted the recording
    
    public static func embarkAudioRecordingSubmitted(storyName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "story_name": storyName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_audio_recording_submitted",
                    properties: properties
                ))
        
        }
   }

    /// When embark does an external redirect
    
    public static func embarkExternalRedirect(location: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "location": location,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_external_redirect",
                    properties: properties
                ))
        
        }
   }

    /// When embark goes back one passage
    
    public static func embarkPassageGoBack(storyName: String,passageName: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "originated_from_embark_story": storyName,
                    
                            "passage_name": passageName,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_passage_go_back",
                    properties: properties
                ))
        
        }
   }

    /// When embark sends a tracking event
    
    public static func embarkTrack(storyName: String,eventName: String,store: [String: String?]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "originated_from_embark_story": storyName,
                    
                            "event_name": eventName,
                    
                            "store": store,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_track",
                    properties: properties
                ))
        
        }
   }

    /// When embark does a varianted offer redirect
    
    public static func embarkVariantedOfferRedirect(allIds: [String],selectedIds: [String]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "all_ids": allIds,
                    
                            "selected_ids": selectedIds,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "embark_varianted_offer_redirect",
                    properties: properties
                ))
        
        }
   }

    /// Experiment where evaluated, typically means it was shown on screen or similar
    
    public static func experimentEvaluated(name: String,variant: String) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "name": name,
                    
                            "variant": variant,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "experiment_evaluated",
                    properties: properties
                ))
        
        }
   }

    /// Experiments where loaded from server
    
    public static func experimentsLoaded(experiments: [String]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "experiments": experiments,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "experiments_loaded",
                    properties: properties
                ))
        
        }
   }

    /// When quotes are signed in the offer screen
    
    public static func quotesSigned(quoteIds: [String]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "quote_ids": quoteIds,
                    
                    
                    
                ]

                
                

                let graphQLVariables: [String: Any?] = [
                    
                            "quote_ids": quoteIds,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
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
                            
                            ["name": "type_of_contracts", "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)"],
                            
                            ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
                            
                        ],
                        "variables": graphQLVariables
                    ]
                ))
        
        }
   }

    /// When the user received some quotes
    
    public static func receivedQuotes(quoteIds: [String]) -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                            "quote_ids": quoteIds,
                    
                    
                    
                ]

                
                

                let graphQLVariables: [String: Any?] = [
                    
                            "quote_ids": quoteIds,
                    
                    
                    
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "received_quotes",
                    properties: properties,
                    graphql: [
                        "query": """
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
                        """,
                        "selectors": [
                            
                            ["name": "type_of_contracts", "path": "quoteBundle.quotes[*].typeOfContract | sort(@)"],
                            
                            ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
                            
                        ],
                        "variables": graphQLVariables
                    ]
                ))
        
        }
   }

    /// App was put into background
    
    public static func appBackground() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "app_background",
                    properties: properties
                ))
        
        }
   }

    /// App was resumed after being in background
    
    public static func appResumed() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "app_resumed",
                    properties: properties
                ))
        
        }
   }

    /// App was shutdown
    
    public static func appShutdown() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "app_shutdown",
                    properties: properties
                ))
        
        }
   }

    /// App was started
    
    public static func appStarted() -> hAnalyticsParcel {
        return hAnalyticsParcel {
        
                let properties: [String: Any?] = [
                    
                    
                    :
                ]

                hAnalyticsNetworking.send(hAnalyticsEvent(
                    name: "app_started",
                    properties: properties
                ))
        
        }
   }

}


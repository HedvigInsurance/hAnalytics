import { hAnalyticsNetworking } from "./hAnalyticsNetworking"


    
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
    networking: hAnalyticsNetworking

    constructor(
        networking: hAnalyticsNetworking
    ) {
        this.networking = networking
    }

    // identifies and registers the trackingId
    identify() {
        this.networking.identify()
    }


    // When embark does an external redirect
    
    embarkExternalRedirect(location: string) {
    
            const properties: { [name: string]: any } = {
                
                        "location": location,
                
                
            }

            this.networking.send({
                name: "embark_external_redirect",
                properties: properties
            })
    
   }

    // When embark goes back one passage
    
    embarkPassageGoBack(storyName: string,passageName: string) {
    
            const properties: { [name: string]: any } = {
                
                        "originated_from_embark_story": storyName,
                
                        "passage_name": passageName,
                
                
            }

            this.networking.send({
                name: "embark_passage_go_back",
                properties: properties
            })
    
   }

    // When embark sends a tracking event
    
    embarkTrack(storyName: string,eventName: string,store: { [name: string]: string | null }) {
    
            const properties: { [name: string]: any } = {
                
                        "originated_from_embark_story": storyName,
                
                        "event_name": eventName,
                
                        "store": store,
                
                
            }

            this.networking.send({
                name: "embark_track",
                properties: properties
            })
    
   }

    // When embark does a varianted offer redirect
    
    embarkVariantedOfferRedirect(allIds: string[],selectedIds: string[]) {
    
            const properties: { [name: string]: any } = {
                
                        "all_ids": allIds,
                
                        "selected_ids": selectedIds,
                
                
            }

            this.networking.send({
                name: "embark_varianted_offer_redirect",
                properties: properties
            })
    
   }

    // Experiment where evaluated, typically means it was shown on screen or similar
    
    experimentEvaluated(name: string,variant: string) {
    
            const properties: { [name: string]: any } = {
                
                        "name": name,
                
                        "variant": variant,
                
                
            }

            this.networking.send({
                name: "experiment_evaluated",
                properties: properties
            })
    
   }

    // Experiments where loaded from server
    
    experimentsLoaded(experiments: string[]) {
    
            const properties: { [name: string]: any } = {
                
                        "experiments": experiments,
                
                
            }

            this.networking.send({
                name: "experiments_loaded",
                properties: properties
            })
    
   }

    // When quotes are signed in the offer screen
    
    quotesSigned(quoteIds: string[]) {
    
            const properties: { [name: string]: any } = {
                
                        "quote_ids": quoteIds,
                
                
            }

            
            

            const graphQLVariables: { [name: string]: any } = {
                
                        "quote_ids": quoteIds,
                
                
            }

            this.networking.send({
                name: "quotes_signed",
                properties: properties,
                graphql: {
                    "query": `
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
                    "selectors": [
                        
                        {"name": "type_of_contracts", "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)"},
                        
                        {"name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"},
                        
                    ],
                    "variables": graphQLVariables
                }
            })
    
   }

    // When the user received some quotes
    
    receivedQuotes(quoteIds: string[]) {
    
            const properties: { [name: string]: any } = {
                
                        "quote_ids": quoteIds,
                
                
            }

            
            

            const graphQLVariables: { [name: string]: any } = {
                
                        "quote_ids": quoteIds,
                
                
            }

            this.networking.send({
                name: "received_quotes",
                properties: properties,
                graphql: {
                    "query": `
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
                    "selectors": [
                        
                        {"name": "type_of_contracts", "path": "quoteBundle.quotes[*].typeOfContract | sort(@)"},
                        
                        {"name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"},
                        
                    ],
                    "variables": graphQLVariables
                }
            })
    
   }

    // App was put into background
    
    appBackground() {
    
            const properties: { [name: string]: any } = {
                
                
            }

            this.networking.send({
                name: "app_background",
                properties: properties
            })
    
   }

    // App was resumed after being in background
    
    appResumed() {
    
            const properties: { [name: string]: any } = {
                
                
            }

            this.networking.send({
                name: "app_resumed",
                properties: properties
            })
    
   }

    // App was started
    
    appStarted() {
    
            const properties: { [name: string]: any } = {
                
                
            }

            this.networking.send({
                name: "app_started",
                properties: properties
            })
    
   }

    // A page was shown on the web
    
    pageView(href: string,pathname: string,hostname: string) {
    
            const properties: { [name: string]: any } = {
                
                        "href": href,
                
                        "pathname": pathname,
                
                        "hostname": hostname,
                
                
            }

            this.networking.send({
                name: "web_page_view",
                properties: properties
            })
    
   }

}


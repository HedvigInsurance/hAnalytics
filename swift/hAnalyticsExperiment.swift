import Foundation


    /// Which login method to use
    public enum LoginMethod {
       
            case bankIdSweden
       
            case nemId
       
            case otp
       
            case bankIdNorway
       

       var variantIdentifier: String {
           switch self {
                
                    case .bankIdSweden:
                        return "bank_id_sweden"
                
                    case .nemId:
                        return "nem_id"
                
                    case .otp:
                        return "otp"
                
                    case .bankIdNorway:
                        return "bank_id_norway"
                
           }
       }

       static func decode(_ payload: [String: Any]) -> Self? {
           
                    
                        if let variant = payload["variant"] as? String, variant == "bank_id_sweden" {
                            return .bankIdSweden
                        }
                    
            
                    
                        if let variant = payload["variant"] as? String, variant == "nem_id" {
                            return .nemId
                        }
                    
            
                    
                        if let variant = payload["variant"] as? String, variant == "otp" {
                            return .otp
                        }
                    
            
                    
                        if let variant = payload["variant"] as? String, variant == "bank_id_norway" {
                            return .bankIdNorway
                        }
                    
            

            return nil
       }
    }

    /// Which payment provider to use
    public enum PaymentType {
       
            case adyen
       
            case trustly
       

       var variantIdentifier: String {
           switch self {
                
                    case .adyen:
                        return "adyen"
                
                    case .trustly:
                        return "trustly"
                
           }
       }

       static func decode(_ payload: [String: Any]) -> Self? {
           
                    
                        if let variant = payload["variant"] as? String, variant == "adyen" {
                            return .adyen
                        }
                    
            
                    
                        if let variant = payload["variant"] as? String, variant == "trustly" {
                            return .trustly
                        }
                    
            

            return nil
       }
    }

    /// no description given
    public enum Test {
       
            case rsds(amount: Double,shouldDoSomething: Bool)
       
            case test
       

       var variantIdentifier: String {
           switch self {
                
                    case .rsds:
                        return "rsds"
                
                    case .test:
                        return "test"
                
           }
       }

       static func decode(_ payload: [String: Any]) -> Self? {
           
                    
                        if let variant = payload["variant"] as? String,
                            let associatedValues = payload["associated_values"] as? [String: Any],
                            variant == "rsds",
                            let amount = (associatedValues["amount"] as? NSNumber)?.doubleValue, let shouldDoSomething = associatedValues["should_do_something"] as? Bool {
                            return .rsds(amount: amount,shouldDoSomething: shouldDoSomething)
                        }
                    
            
                    
                        if let variant = payload["variant"] as? String, variant == "test" {
                            return .test
                        }
                    
            

            return nil
       }
    }


public struct hAnalyticsExperiment {
// loads all experiments from server
public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(filter: ["allow_external_data_collection","forever_february_campaign","french_market","key_gear","login_method","moving_flow","payment_type","post_onboarding_show_payment_step","test"], onComplete: onComplete)
}


    
    /// Allow fetching data with external data providers (for example insurely)
    public static var allowExternalDataCollection: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "allow_external_data_collection"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "allow_external_data_collection",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "allow_external_data_collection",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// Is the forever february campaign activated
    public static var foreverFebruaryCampaign: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "forever_february_campaign"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "forever_february_campaign",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "forever_february_campaign",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// Should the french market be shown
    public static var frenchMarket: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "french_market"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "french_market",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "french_market",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// Is the key gear feature activated
    public static var keyGear: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "key_gear"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "key_gear",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "key_gear",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// Which login method to use
    public static var loginMethod: LoginMethod {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "login_method"
       }), let variant = LoginMethod.decode(experiment) {
           hAnalyticsEvent.experimentEvaluated(
               name: "login_method",
               variant: variant.variantIdentifier
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "login_method",
            variant: LoginMethod.otp.variantIdentifier
       ).send()

        return .otp
    }
    

    
    /// Is moving flow activated
    public static var movingFlow: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "moving_flow"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "moving_flow",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "moving_flow",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// Which payment provider to use
    public static var paymentType: PaymentType {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "payment_type"
       }), let variant = PaymentType.decode(experiment) {
           hAnalyticsEvent.experimentEvaluated(
               name: "payment_type",
               variant: variant.variantIdentifier
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "payment_type",
            variant: PaymentType.trustly.variantIdentifier
       ).send()

        return .trustly
    }
    

    
    /// Show payment step in PostOnboarding
    public static var postOnboardingShowPaymentStep: Bool {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "post_onboarding_show_payment_step"
       }), let variant = experiment["variant"] {
            hAnalyticsEvent.experimentEvaluated(
                name: "post_onboarding_show_payment_step",
                variant: variant
            ).send()
           
           return variant == "enabled"
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "post_onboarding_show_payment_step",
            variant: "disabled"
        ).send()

       return false
    }
    

    
    /// no description given
    public static var test: Test {
       if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
            experiment["name"] == "test"
       }), let variant = Test.decode(experiment) {
           hAnalyticsEvent.experimentEvaluated(
               name: "test",
               variant: variant.variantIdentifier
            ).send()
           
           return variant
       }

       hAnalyticsEvent.experimentEvaluated(
            name: "test",
            variant: Test.rsds(amount: 200,shouldDoSomething: true).variantIdentifier
       ).send()

        return .rsds(amount: 200,shouldDoSomething: true)
    }
    

}
import Foundation
import UIKit
import SwiftUI

extension UIViewController {
    /// Adds a SwiftUI view to the hierarchy that sends a tracking view on appear for UIViewController
    public func trackOnAppear(_ parcel: hAnalyticsParcel) {
        self.view.addSubview(HostingView(rootView: Color.clear.trackOnAppear(parcel)))
    } 
}

extension UIView {
    /// Adds a SwiftUI view to the hierarchy that sends a tracking view on appear for UIView
    public func trackOnAppear(_ parcel: hAnalyticsParcel) {
        self.view.addSubview(HostingView(rootView: Color.clear.trackOnAppear(parcel)))
    } 
}
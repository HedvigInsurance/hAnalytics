import Foundation
import UIKit
import SwiftUI

extension UIViewController {
    /// Adds a SwiftUI view to the hierarchy that sends a tracking view on appear for UIViewController
    public func trackOnAppear(_ parcel: hAnalyticsParcel) {
        self.view.addSubview(HostingView(Color.clear.trackOnAppear(parcel)))
    } 
}
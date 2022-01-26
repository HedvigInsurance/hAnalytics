import Foundation
import SwiftUI

extension View {
    /// sends a tracking event onAppear
    public func trackOnAppear(_ parcel: hAnalyticsParcel) -> some View {
        self.onAppear {
            parcel.send()
        }
    }

    /// sends a tracking event when tapping
    public func trackOnTap(_ parcel: hAnalyticsParcel) -> some View {
        self.simultaneousGesture(
            TapGesture()
                .onEnded { _ in
                    parcel.send()
                }
        )
    }
}
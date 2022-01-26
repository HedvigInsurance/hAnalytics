import Foundation
import SwiftUI

extension View {
    /// sends a tracking event onAppear
    public func trackOnAppear(_ track: hAnalyticsParce) -> some View {
        self.onAppear {
            track.send()
        }
    }

    /// sends a tracking event when tapping
    public func trackOnTap(_ track: hAnalyticsParce) -> some View {
        self.simultaneousGesture(
            TapGesture()
                .onEnded { _ in
                    track.send()
                }
        )
    }
}
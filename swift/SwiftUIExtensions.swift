import Foundation
import SwiftUI

extension View {
    /// sends a tracking event onAppear
    public func trackOnAppear(_ track: AnalyticsClosure) -> some View {
        self.onAppear {
            track.send()
        }
    }

    /// sends a tracking event when tapping
    public func trackOnTap(_ track: AnalyticsClosure) -> some View {
        self.simultaneousGesture(
            TapGesture()
                .onEnded { _ in
                    track.send()
                }
        )
    }
}
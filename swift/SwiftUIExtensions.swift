import Foundation
import SwiftUI

extension View {
    public func trackView(_ track: AnalyticsClosure) -> some View {
        self.onAppear {
            track.send()
        }
    }
}
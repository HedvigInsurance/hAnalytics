import Foundation
import SwiftUI

extension View {
    public func trackView(_ track: @escaping AnalyticsClosure) -> some View {
        self.onAppear {
            track()
        }
    }
}
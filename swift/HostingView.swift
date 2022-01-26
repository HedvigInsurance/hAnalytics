import Foundation
import SwiftUI
import UIKit

class HostingView<Content: View>: UIView {
    let rootViewHostingController: AdjustableHostingController<AnyView>

    public var swiftUIRootView: Content {
        didSet {
            self.rootViewHostingController.rootView = AnyView(swiftUIRootView.edgesIgnoringSafeArea(.all))
        }
    }

    public required init(
        rootView: Content
    ) {
        self.swiftUIRootView = rootView
        self.rootViewHostingController = .init(rootView: AnyView(rootView.edgesIgnoringSafeArea(.all)))

        super.init(frame: .zero)

        rootViewHostingController.view.backgroundColor = .clear

        addSubview(rootViewHostingController.view)
    }

    deinit {
        rootViewHostingController.removeFromParent()
    }

    required init?(
        coder: NSCoder
    ) {
        fatalError("init(coder:) has not been implemented")
    }
}

class AdjustableHostingController<Content: View>: UIHostingController<Content> {
    public override init(
        rootView: Content
    ) {
        super.init(rootView: rootView)

        view.backgroundColor = .clear
    }

    @MainActor @objc required dynamic init?(
        coder aDecoder: NSCoder
    ) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()

        self.view.invalidateIntrinsicContentSize()
    }
}

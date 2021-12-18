// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.
import PackageDescription

let package = Package(
    name: "hAnalytics",
    platforms: [
      .iOS(.v13)
    ],
    products: [
        .library(
            name: "hAnalytics",
            targets: ["hAnalytics"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/adam-fowler/jmespath.swift.git", 
            from: "1.0.0"
        )
    ],
    targets: [
        .target(
            name: "hAnalytics",
            dependencies: ["JMESPath"]
            path: "swift"
        )
    ]
)
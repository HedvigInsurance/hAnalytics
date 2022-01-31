import Foundation

public struct hAnalyticsNetworking {
  public static var sessionId: String = UUID().uuidString
  public static var httpAdditionalHeaders: () -> [AnyHashable: Any] = { [:] }
  public static var trackingId: () -> String = { "" }
  public static var endpointURL: () -> String = { "" }
  static var experimentsPayload: [[String: String]] = []

  static func send(_ event: hAnalyticsEvent) {
    var urlRequest = URLRequest(url: URL(string: endpointURL() + "/event")!)
    urlRequest.httpMethod = "POST"
    urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

    var requestData = getContextProperties().merging(
      ["event": event.name, "properties": event.properties, "trackingId": trackingId(), "sessionId": sessionId, "graphql": event.graphql],
      uniquingKeysWith: { lhs, _ in lhs }
    )

    guard let JSONData = try? JSONSerialization.data(withJSONObject: requestData, options: [])
    else { return }
    urlRequest.httpBody = JSONData

    let configuration = URLSessionConfiguration.default
    configuration.httpAdditionalHeaders = httpAdditionalHeaders()

    let urlSession = URLSession(configuration: configuration)
    let task = urlSession.dataTask(with: urlRequest) { _, _, _ in }

    task.resume()
  }

  static func identify() {
    var urlRequest = URLRequest(url: URL(string: endpointURL() + "/identify")!)
    urlRequest.httpMethod = "POST"
    urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let requestData = ["trackingId": trackingId()]

    guard let JSONData = try? JSONSerialization.data(withJSONObject: requestData, options: [])
    else { return }
    urlRequest.httpBody = JSONData

    let configuration = URLSessionConfiguration.default
    configuration.httpAdditionalHeaders = httpAdditionalHeaders()

    let urlSession = URLSession(configuration: configuration)
    let task = urlSession.dataTask(with: urlRequest) { _, _, _ in }

    task.resume()
  }

  static func loadExperiments(onComplete: @escaping () -> Void) {
    var urlRequest = URLRequest(url: URL(string: endpointURL() + "/experiments")!)
    urlRequest.httpMethod = "POST"
    urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let requestData = getContextProperties().merging(
      ["trackingId": trackingId(), "sessionId": sessionId, "appName": "ios"],
      uniquingKeysWith: { lhs, _ in lhs }
    )

    guard let JSONData = try? JSONSerialization.data(withJSONObject: requestData, options: [])
    else { return }
    urlRequest.httpBody = JSONData

    let configuration = URLSessionConfiguration.default
    configuration.httpAdditionalHeaders = httpAdditionalHeaders()

    let urlSession = URLSession(configuration: configuration)
    let task = urlSession.dataTask(with: urlRequest) { data, _, _ in
        if let data = data, let experimentsPayload =
                try? JSONSerialization.jsonObject(
                    with: data,
                    options: .mutableContainers
                ) as? [[String: String]] {
            hAnalyticsEvent.experimentsLoaded(experimentsPayload)
            
            self.experimentsPayload = experimentsPayload
        }

        onComplete()
    }

    task.resume()
  }

  static func getContextProperties() -> [String: Any] {
    var context: [String: Any] = [:]

    let info = Bundle.main.infoDictionary
    let localizedInfo = Bundle.main.localizedInfoDictionary
    var app = [String: Any]()
    if let info = info { app.merge(info) { (_, new) in new } }
    if let localizedInfo = localizedInfo { app.merge(localizedInfo) { (_, new) in new } }
    context["app"] = [
      "name": app["CFBundleDisplayName"] ?? "", "version": app["CFBundleShortVersionString"] ?? "",
      "build": app["CFBundleVersion"] ?? "", "namespace": Bundle.main.bundleIdentifier ?? "",
    ]

    let device = VendorSystem.current

    context["device"] = [
      "manufacturer": device.manufacturer, "type": device.type, "model": device.model,
      "name": device.name, "id": device.identifierForVendor ?? "",
    ]

    context["os"] = ["name": device.systemName, "version": device.systemVersion]

    let screen = device.screenSize
    context["screen"] = ["width": screen.width, "height": screen.height]

    let userAgent = device.userAgent
    context["userAgent"] = userAgent

    if Locale.preferredLanguages.count > 0 { context["locale"] = Locale.preferredLanguages[0] }

    context["timezone"] = TimeZone.current.identifier

    return context
  }
}

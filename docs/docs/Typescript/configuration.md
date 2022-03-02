# Configuration

Here is an example configuration

```typescript
import { Environment } from "@hedviginsurance/hanalytics-client";

const networking = new hAnalyticsNetworking(() => ({
  httpHeaders: {
    Authorization: "Bearer hedvigtoken", // not required
    // pass all other hedvig standard headers here
  },
  environment:
    Environment.STAGING || Environment.PRODUCTION || Environment.LOCAL,
  context: {
    locale: "sv-SE",
    app: {
      name: "web-onboarding", // name of app
      namespace: "com.hedvig.test.web-onboarding", // namespace, usually uniquely identifies an application inside an environment
      version: "1.0.0", // version, preferably picked from package.json
      build: "3000", // build number or git hash or similar
    },
    device: {
      id: "UUID", // Hedvig Device ID
    },
    session: {
      id: "UUID", // an id which uniquely identifies the session
    },
  },
  userAgent: "Mozilla ...", // user agent of the client
  onEvent: (event) => {
    // allows sending the event to a separate place

    if (typeof window !== "undefined") {
      // example of sending the event to ga
      window.gtag("event", event.name, event.properties);
    }
  },
}));
```

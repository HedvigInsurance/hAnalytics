import "../styles/globals.css";
import {
  HAnalyticsProvider,
  bootstrapExperiments,
  Environment,
} from "@hedviginsurance/hanalytics-client";

const getHAnalyticsConfig = (userAgent) => ({
  httpHeaders: {},
  environment: Environment.STAGING,
  context: {
    locale: "sv-SE",
    app: {
      name: "web-onboarding",
      namespace: "com.hedvig.test.web-onboarding",
      version: "1.0.0",
      build: "3000",
    },
    device: {
      id: "STORE_THE_UUID",
    },
    session: {
      id: "AN_ID",
    },
  },
  userAgent,
  onEvent: (event) => {
    if (typeof window !== "undefined") {
      window.gtag("event", event.name, event.properties);
    }
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HAnalyticsProvider
        getConfig={() => getHAnalyticsConfig(pageProps.userAgent)}
        bootstrapExperiments={pageProps.experimentsBootstrap}
      >
        <Component {...pageProps} />
      </HAnalyticsProvider>
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-TGSXK2QHSD"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-TGSXK2QHSD');
          </script>
          `,
        }}
      ></div>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const userAgent = ctx.req
    ? ctx.req.headers["user-agent"]
    : navigator.userAgent;

  const experimentsBootstrap = await bootstrapExperiments(() =>
    getHAnalyticsConfig(userAgent)
  );

  return { pageProps: { experimentsBootstrap, userAgent } };
};

export default MyApp;

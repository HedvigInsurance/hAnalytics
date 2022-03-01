import "../styles/globals.css";
import {
  HAnalyticsProvider,
  bootstrapExperiments,
} from "@hedviginsurance/hanalytics-client";

const getHAnalyticsConfig = () => ({
  httpHeaders: {},
  endpointURL: "https://hanalytics-staging.herokuapp.com",
  context: {
    locale: "sv-SE",
    app: {
      name: "NextJSExample",
      namespace: "staging",
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
  onSend: (event) => {
    /// send to google analytics or other tracking partner here
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <HAnalyticsProvider
      getConfig={() => getHAnalyticsConfig()}
      bootstrapExperiments={pageProps.experimentsBootstrap}
    >
      <Component {...pageProps} />
    </HAnalyticsProvider>
  );
}

MyApp.getInitialProps = async (appctx) => {
  const experimentsBootstrap = await bootstrapExperiments(getHAnalyticsConfig);
  return { pageProps: { experimentsBootstrap } };
};

export default MyApp;

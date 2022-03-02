# React

To use hAnalytics from React use the supplied provider, like so:

```typescript
<HAnalyticsProvider
    getConfig={() => getHAnalyticsConfig(pageProps.userAgent)}
    bootstrapExperiments={pageProps.experimentsBootstrap}
>
    {...}
</HAnalyticsProvider>
```

then you can use the supplied `useHAnalytics` hook like so:

```typescript
const { trackers } = useHAnalytics();

useEffect(() => {
  trackers.quotesSigned(quoteIds);
}, [quoteIds]);
```

## Experiments

Experiments gives the possibility to tailor your UI and activate / deactive features, do A/B tests and similar, actual feature flag handling is done in Hedvigs hosted [unleash-server](https://hedvig-unleash.herokuapp.com).

### Example

```typescript
const { experiments } = useHAnalytics();

experiments.allowExternalDataCollection(); // this returns a boolean
```

### SSR

To use experiments with SSR you need to bootstrapExperiments, first load the experiments and then supply it to the provider to render the React tree correctly.

Here is an example in Next.js:

```typescript
import {
  HAnalyticsProvider,
  bootstrapExperiments,
  Environment,
} from "@hedviginsurance/hanalytics-client";

const getHAnalyticsConfig = (userAgent) => ({
  // see episode on configuration
});

function App({ Component, pageProps }) {
  return (
    <>
      <HAnalyticsProvider
        getConfig={() => getHAnalyticsConfig(pageProps.userAgent)}
        bootstrapExperiments={pageProps.experimentsBootstrap}
      >
        <Component {...pageProps} />
      </HAnalyticsProvider>
    </>
  );
}

App.getInitialProps = async ({ ctx }) => {
  const userAgent = ctx.req
    ? ctx.req.headers["user-agent"]
    : navigator.userAgent;

  const experimentsBootstrap = await bootstrapExperiments(() =>
    getHAnalyticsConfig(userAgent)
  );

  return { pageProps: { experimentsBootstrap, userAgent } };
};
```

then in any component you just use the hook:

```typescript
import { useHAnalytics } from "@hedviginsurance/hanalytics-client";

export default function Home() {
  const { trackers, experiments } = useHAnalytics();

  return (
    <div>
      <main>
        <button onClick={() => trackers.trackSomething()}>
          Click to send a tracking event
        </button>
        {experiments.allowExternalDataCollection() ? (
          <ShowDataCollection />
        ) : null}
      </main>
    </div>
  );
}
```

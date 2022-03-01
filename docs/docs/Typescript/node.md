# Node

To use hAnalytics from Node.js, create instances of hAnalyticsNetworking, hAnalyticsTrackers and hAnalyticsExperiments:

```typescript
/// custom middleware
app.use(async (req, res, next) => {
  const networking = new hAnalyticsNetworking(() => ({
    // see episode on config
  }));
  const trackers = new hAnalyticsTrackers(networking);
  const experiments = new hAnalyticsExperiments(trackers, networking);
  await experiments.load();

  req.trackers = trackers;
  req.experiments = experiments;

  next();
});

app.get("/your-cool-website", (req, res) => {
  if (req.experiments.shouldShowNewCoolPage()) {
    res.send(coolStuff);
  } else {
    res.send(oldStuff);
  }
});
```

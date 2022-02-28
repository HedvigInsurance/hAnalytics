export type hAnalyticsContext = {
  timezone: string;
  session: {
    id: string;
  };
  locale: string;
  app: {
    name: string;
    version: string;
    build: string;
    namespace: string;
  };
  device: {
    manufacturer: string;
    model: string;
    name: string;
    type: string;
    id: string;
    screen?: {
      density: number;
      height: number;
      width: number;
    };
    os: {
      name: string;
      version: string;
    };
  };
};

export type hAnalyticsConsumerContext = {
    locale: string;
    device: {
        id: string;
    };
    session: {
        id: string;
    }
    app: {
        name: string;
        version: string;
        build: string;
        namespace: string;
    }
};
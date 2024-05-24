import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://78ea7505b0ca17da2b8e9d43c1d9feb1@o4507309089685504.ingest.us.sentry.io/4507309093224448",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

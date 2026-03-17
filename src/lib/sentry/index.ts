import * as Sentry from "@sentry/react-native";

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: true,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    environment: __DEV__ ? "development" : "production",
    debug: false,
    replaysSessionSampleRate: __DEV__ ? 0.1 : 0.0,
    replaysOnErrorSampleRate: __DEV__ ? 1.0 : 0.0,
    integrations: __DEV__ ? [Sentry.mobileReplayIntegration()] : [],
    _experiments: {
      enableLogs: __DEV__,
    },
  });
}

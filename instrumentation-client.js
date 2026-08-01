import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
  tracesSampleRate: 1.0,
  autoSessionTracking: false
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

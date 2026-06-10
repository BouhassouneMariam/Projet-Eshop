import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

export default withSentryConfig(nextConfig, {
  org: "local",
  project: "eco-hardware",
  silent: true,
  sourcemaps: {
    disable: true
  }
});

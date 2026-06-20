"use client";

import * as Sentry from "@sentry/nextjs";

export function startPageReadyTracker(name, attributes = {}) {
  if (typeof window === "undefined" || typeof Sentry.startInactiveSpan !== "function") {
    return null;
  }

  const span = Sentry.startInactiveSpan({
    name,
    op: "ui.load",
    forceTransaction: true,
    attributes
  });

  let hasEnded = false;

  return () => {
    if (hasEnded) {
      return;
    }

    hasEnded = true;
    span.end();
  };
}

export function endAfterNextPaint(endSpan) {
  if (typeof window === "undefined" || typeof endSpan !== "function") {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      endSpan();
    });
  });
}

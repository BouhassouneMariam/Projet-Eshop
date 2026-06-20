const STORAGE_KEY = "eco-hardware:attribution";
const UMAMI_RETRY_DELAY = 300;
const UMAMI_RETRY_LIMIT = 10;

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function sendToUmami(name, payload, attempt = 0) {
  if (typeof window === "undefined") {
    return;
  }

  const tracker = window.umami;

  if (tracker && typeof tracker.track === "function") {
    tracker.track(name, payload);
    return;
  }

  if (attempt >= UMAMI_RETRY_LIMIT) {
    return;
  }

  window.setTimeout(() => {
    sendToUmami(name, payload, attempt + 1);
  }, UMAMI_RETRY_DELAY);
}

export function trackEvent(name, payload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const enrichedPayload = cleanPayload({
    ...readAttribution(),
    ...payload
  });

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics stub]", name, enrichedPayload);
  }

  sendToUmami(name, enrichedPayload);

  window.dispatchEvent(
    new CustomEvent("eco-hardware:track", {
      detail: {
        name,
        payload: enrichedPayload
      }
    })
  );
}

export function persistAttribution({ pathname, search }) {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(search);
  const currentAttribution = readAttribution();
  const nextAttribution = {
    first_pathname: currentAttribution.first_pathname || pathname,
    latest_pathname: pathname,
    ref: currentAttribution.ref || document.referrer || "",
    utm_source: currentAttribution.utm_source || params.get("utm_source") || "",
    utm_medium: currentAttribution.utm_medium || params.get("utm_medium") || "",
    utm_campaign:
      currentAttribution.utm_campaign || params.get("utm_campaign") || ""
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAttribution));
  } catch {
    return;
  }
}

export function readAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

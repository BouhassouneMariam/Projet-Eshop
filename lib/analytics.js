const STORAGE_KEY = "eco-hardware:attribution";

export function trackEvent(name, payload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const enrichedPayload = {
    ...readAttribution(),
    ...payload
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics stub]", name, enrichedPayload);
  }

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

const PAYMENT_ATTEMPT_KEY = "eco-hardware:payment-attempt-count";

function readAttemptCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const rawValue = window.sessionStorage.getItem(PAYMENT_ATTEMPT_KEY);
    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  } catch {
    return 0;
  }
}

function writeAttemptCount(value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(PAYMENT_ATTEMPT_KEY, String(value));
  } catch {
    return;
  }
}

export function registerPaymentAttempt() {
  const nextAttempt = readAttemptCount() + 1;
  writeAttemptCount(nextAttempt);
  return nextAttempt;
}

export function shouldSimulatePaymentFailure(attemptNumber) {
  return attemptNumber % 3 === 0;
}

export function simulateGatewayFailure(context) {
  const error = new TypeError(
    "Cannot read properties of undefined (reading 'authorize')"
  );

  error.name = "CheckoutPaymentError";
  error.code = "PAYMENT_PROVIDER_UNAVAILABLE";
  error.telemetry_context = context;

  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      Promise.reject(error);
    }, 0);
  }

  return error;
}

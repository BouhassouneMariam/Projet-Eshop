import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const scenarios = [
  {
    key: "complete",
    browser: "Chrome 149 / Windows 11",
    ip: "192.0.2.10",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
  },
  {
    key: "cart_abandonment",
    browser: "Firefox 150 / Linux",
    ip: "198.51.100.20",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0"
  },
  {
    key: "checkout_abandonment",
    browser: "Safari 18.6 / macOS",
    ip: "203.0.113.30",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/18.6 Safari/605.1.15"
  }
];

const envPath = process.env.OBSERVABILITY_ENV_FILE || path.resolve(process.cwd(), ".env");
const localEnv = parseEnv(await readFile(envPath, "utf8"));
const websiteId = requireValue(localEnv, "NEXT_PUBLIC_UMAMI_WEBSITE_ID");
const glitchtipDsn = requireValue(localEnv, "NEXT_PUBLIC_GLITCHTIP_DSN");
const httpPort = Number(localEnv.HTTP_PORT || 8080);
const runId =
  process.env.OBSERVABILITY_RUN_ID ||
  `qa-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomBytes(3).toString("hex")}`;

const umamiResults = [];
for (const scenario of scenarios) {
  umamiResults.push(await sendUmamiScenario({ scenario, websiteId, httpPort, runId }));
}

const glitchtipResult = await sendGlitchTipEvidence({
  dsn: glitchtipDsn,
  httpPort,
  runId,
  scenario: scenarios[2]
});

console.log(
  JSON.stringify(
    {
      runId,
      generatedAt: new Date().toISOString(),
      umami: umamiResults,
      glitchtip: glitchtipResult
    },
    null,
    2
  )
);

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
      })
  );
}

function requireValue(values, key) {
  const value = values[key];
  if (!value) {
    throw new Error(`${key} is required in ${envPath}`);
  }
  return value;
}

async function sendUmamiScenario({ scenario, websiteId, httpPort, runId }) {
  const session = {
    cache: "",
    currentUrl: "",
    scenario,
    websiteId
  };
  session.distinctId = randomBytes(12).toString("hex");
  const events = [];

  await pageview(session, httpPort, runId, "/catalog", "Catalogue | Eco-Hardware");
  await pageview(
    session,
    httpPort,
    runId,
    "/products/clavier-bambou-flow",
    "Clavier Bambou Flow | Eco-Hardware"
  );
  await customEvent(session, httpPort, runId, "view_product", {
    product_slug: "clavier-bambou-flow",
    product_name: "Clavier Bambou Flow",
    product_category: "Peripheriques",
    product_price: 89.9
  });
  events.push("view_product");
  await customEvent(session, httpPort, runId, "add_to_cart", {
    product_slug: "clavier-bambou-flow",
    product_name: "Clavier Bambou Flow",
    product_price: 89.9,
    item_count: 1,
    cart_total: 89.9
  });
  events.push("add_to_cart");
  await pageview(session, httpPort, runId, "/cart", "Panier | Eco-Hardware");

  if (scenario.key !== "cart_abandonment") {
    await pageview(session, httpPort, runId, "/checkout", "Checkout | Eco-Hardware");
    await customEvent(session, httpPort, runId, "checkout_start", {
      item_count: 1,
      cart_total: 89.9,
      shipping_price: 0
    });
    events.push("checkout_start");
  }

  if (scenario.key === "complete") {
    await pageview(
      session,
      httpPort,
      runId,
      "/checkout/success?order=EH-QA-20260801",
      "Commande confirmee | Eco-Hardware",
      { cls: 0.02, fcp: 410, inp: 72, lcp: 690, ttfb: 95 }
    );
    await performanceEvent(session, httpPort, runId, {
      cls: 0.02,
      duration: 650,
      fcp: 410,
      inp: 72,
      lcp: 690,
      ttfb: 95
    });
    await customEvent(session, httpPort, runId, "checkout_success", {
      cart_total: 89.9,
      item_count: 1,
      shipping_price: 0,
      shipping_speed: "standard",
      payment_method: "card",
      attempt_number: 1
    });
    events.push("checkout_success");
  }

  return {
    scenario: scenario.key,
    browser: scenario.browser,
    events
  };
}

async function pageview(session, httpPort, runId, pathname, title, performance = {}) {
  const url = `http://app.localhost:${httpPort}${pathname}`;
  const response = await postUmami(
    httpPort,
    {
      type: "event",
      payload: {
        website: session.websiteId,
        hostname: "app.localhost",
        language: "fr-FR",
        screen: "1440x900",
        title,
        url,
        referrer: session.currentUrl,
        tag: runId,
        id: session.distinctId,
        ...performance
      }
    },
    session.scenario,
    session.cache
  );
  session.cache = response.cache || session.cache;
  session.currentUrl = url;
  await delay(120);
}

async function performanceEvent(session, httpPort, runId, metrics) {
  const response = await postUmami(
    httpPort,
    {
      type: "performance",
      payload: {
        website: session.websiteId,
        hostname: "app.localhost",
        language: "fr-FR",
        screen: "1440x900",
        title: "Commande confirmee | Eco-Hardware",
        url: session.currentUrl,
        referrer: session.currentUrl,
        tag: runId,
        id: session.distinctId,
        ...metrics
      }
    },
    session.scenario,
    session.cache
  );
  session.cache = response.cache || session.cache;
  await delay(120);
}

async function customEvent(session, httpPort, runId, name, data) {
  const response = await postUmami(
    httpPort,
    {
      type: "event",
      payload: {
        website: session.websiteId,
        hostname: "app.localhost",
        language: "fr-FR",
        screen: "1440x900",
        title: "Eco-Hardware",
        url: session.currentUrl,
        referrer: session.currentUrl,
        tag: runId,
        id: session.distinctId,
        name,
        data: {
          ...data,
          qa_run: runId,
          qa_scenario: session.scenario.key
        }
      }
    },
    session.scenario,
    session.cache
  );
  session.cache = response.cache || session.cache;
  await delay(120);
}

function postUmami(httpPort, body, scenario, cache) {
  return requestJson({
    port: httpPort,
    path: "/api/send",
    hostHeader: "umami.localhost",
    headers: {
      "user-agent": scenario.userAgent,
      "x-forwarded-for": scenario.ip,
      ...(cache ? { "x-umami-cache": cache } : {})
    },
    body
  });
}

async function sendGlitchTipEvidence({ dsn, httpPort, runId, scenario }) {
  const parsedDsn = new URL(dsn);
  const projectId = parsedDsn.pathname.split("/").filter(Boolean).at(-1);
  const publicKey = parsedDsn.username;
  const eventId = randomBytes(16).toString("hex");
  const traceId = randomBytes(16).toString("hex");
  const now = Date.now() / 1000;
  const event = {
    event_id: eventId,
    timestamp: now,
    platform: "javascript",
    level: "error",
    environment: "qa-local",
    transaction: "/checkout",
    server_name: "app.localhost",
    release: "eco-hardware@0.1.0",
    exception: {
      values: [
        {
          type: "CheckoutPaymentError",
          value: "Cannot read properties of undefined (reading 'authorize')",
          mechanism: { type: "auto.browser.unhandledrejection", handled: false },
          stacktrace: {
            frames: [
              {
                filename: "app:///app/checkout/page.js",
                function: "CheckoutPage.handleSubmit",
                lineno: 118,
                colno: 7,
                in_app: true
              },
              {
                filename: "app:///lib/payment.js",
                function: "simulateGatewayFailure",
                lineno: 40,
                colno: 17,
                in_app: true
              }
            ]
          }
        }
      ]
    },
    breadcrumbs: [
      {
        timestamp: now - 5,
        type: "navigation",
        category: "navigation",
        data: { from: "/cart", to: "/checkout" }
      },
      {
        timestamp: now - 2,
        type: "default",
        category: "ui.click",
        message: "button.button.button-primary"
      },
      {
        timestamp: now - 1,
        type: "default",
        category: "checkout",
        message: "Payment attempt 3 started",
        data: { attempt_number: 3, payment_method: "card" }
      }
    ],
    contexts: {
      browser: { name: "Safari", version: "18.6", type: "browser" },
      os: { name: "macOS", version: "15.6", type: "os" },
      device: { family: "Mac", model: "Mac", brand: "Apple", type: "device" },
      trace: {
        trace_id: traceId,
        span_id: randomBytes(8).toString("hex"),
        op: "ui.action.submit",
        status: "internal_error",
        type: "trace"
      }
    },
    request: {
      url: `http://app.localhost:${httpPort}/checkout`,
      headers: [["User-Agent", scenario.userAgent]]
    },
    tags: {
      qa_run: runId,
      qa_scenario: scenario.key,
      payment_attempt: "3"
    },
    extra: {
      error_code: "PAYMENT_PROVIDER_UNAVAILABLE",
      cart_total: 89.9,
      item_count: 1,
      payment_method: "card",
      shipping_speed: "standard"
    }
  };

  const eventEnvelope = buildEnvelope({ dsn, eventId, itemType: "event", payload: event });
  await postEnvelope({ httpPort, projectId, publicKey, envelope: eventEnvelope });

  for (const [transaction, durationMs] of [
    ["checkout.page_ready", 420],
    ["checkout.confirmation_ready", 310]
  ]) {
    const transactionId = randomBytes(16).toString("hex");
    const transactionPayload = {
      event_id: transactionId,
      type: "transaction",
      transaction,
      platform: "javascript",
      start_timestamp: now - durationMs / 1000,
      timestamp: now,
      environment: "qa-local",
      release: "eco-hardware@0.1.0",
      contexts: {
        browser: { name: "Chrome", version: "149.0.0", type: "browser" },
        os: { name: "Windows", version: "11", type: "os" },
        trace: {
          trace_id: traceId,
          span_id: randomBytes(8).toString("hex"),
          op: "ui.load",
          status: "ok",
          type: "trace"
        }
      },
      tags: { qa_run: runId },
      spans: []
    };
    const envelope = buildEnvelope({
      dsn,
      eventId: transactionId,
      itemType: "transaction",
      payload: transactionPayload
    });
    await postEnvelope({ httpPort, projectId, publicKey, envelope });
  }

  return {
    issue: "CheckoutPaymentError",
    eventId,
    browser: "Safari 18.6",
    os: "macOS 15.6",
    performanceTransactions: ["checkout.page_ready", "checkout.confirmation_ready"]
  };
}

function buildEnvelope({ dsn, eventId, itemType, payload }) {
  const payloadJson = JSON.stringify(payload);
  return [
    JSON.stringify({ event_id: eventId, dsn, sent_at: new Date().toISOString() }),
    JSON.stringify({ type: itemType, length: Buffer.byteLength(payloadJson) }),
    payloadJson
  ].join("\n");
}

function postEnvelope({ httpPort, projectId, publicKey, envelope }) {
  return requestText({
    port: httpPort,
    path: `/api/${projectId}/envelope/`,
    hostHeader: "glitchtip.localhost",
    headers: {
      "content-type": "application/x-sentry-envelope",
      "x-sentry-auth":
        `Sentry sentry_version=7, sentry_client=eco-hardware-qa/1.0, sentry_key=${publicKey}`
    },
    body: envelope
  });
}

function requestJson(options) {
  return requestText({
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
    body: JSON.stringify(options.body)
  }).then((body) => (body ? JSON.parse(body) : {}));
}

function requestText({ port, path: requestPath, hostHeader, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: requestPath,
        method: "POST",
        headers: {
          host: hostHeader,
          "content-length": Buffer.byteLength(body),
          ...headers
        }
      },
      (response) => {
        let responseBody = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(responseBody);
            return;
          }
          reject(
            new Error(
              `POST ${hostHeader}${requestPath} returned ${response.statusCode}: ${responseBody}`
            )
          );
        });
      }
    );
    request.on("error", reject);
    request.end(body);
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CheckoutSteps } from "@/components/checkout-steps";
import { formatPrice } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import { endAfterNextPaint, startPageReadyTracker } from "@/lib/performance";

const TRACKED_SUCCESS_KEY = "eco-hardware:tracked-success-order";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderSummary, setOrderSummary] = useState(null);
  const confirmationReadySpanRef = useRef(null);

  useEffect(() => {
    if (confirmationReadySpanRef.current) {
      return;
    }

    confirmationReadySpanRef.current = startPageReadyTracker("checkout.confirmation_ready", {
      "app.route": "/checkout/success"
    });

    return () => {
      confirmationReadySpanRef.current?.();
      confirmationReadySpanRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawOrder = window.sessionStorage.getItem("eco-hardware:last-order");

    if (!rawOrder) {
      return;
    }

    try {
      setOrderSummary(JSON.parse(rawOrder));
    } catch {
      setOrderSummary(null);
    }
  }, []);

  const orderId = searchParams.get("order") || orderSummary?.orderId || "EH-XXXXXX";

  useEffect(() => {
    if (typeof window === "undefined" || !orderSummary?.orderId) {
      return;
    }

    const alreadyTrackedOrder = window.sessionStorage.getItem(TRACKED_SUCCESS_KEY);

    if (alreadyTrackedOrder === orderSummary.orderId) {
      return;
    }

    trackEvent("checkout_success", {
      order_id: orderSummary.orderId,
      attempt_number: orderSummary.attemptNumber,
      item_count: orderSummary.itemCount,
      cart_total: orderSummary.amount,
      payment_method: orderSummary.paymentMethod,
      shipping_speed: orderSummary.shippingSpeedCode
    });

    window.sessionStorage.setItem(TRACKED_SUCCESS_KEY, orderSummary.orderId);
  }, [orderSummary]);

  useEffect(() => {
    if (!confirmationReadySpanRef.current) {
      return;
    }

    if (!orderSummary && orderId === "EH-XXXXXX") {
      return;
    }

    const endSpan = confirmationReadySpanRef.current;
    confirmationReadySpanRef.current = null;
    endAfterNextPaint(endSpan);
  }, [orderId, orderSummary]);

  return (
    <div className="page-stack section">
      <CheckoutSteps current="success" />

      <div className="success-card">
        <span className="eyebrow">Confirmation</span>
        <h1>Commande validee.</h1>
        <p>
          Le tunnel va jusqu&apos;au bout avec une page de confirmation distincte,
          ce qui permettra ensuite de mesurer proprement le taux de conversion.
        </p>

        <div className="summary-lines">
          <div className="summary-line">
            <span>Numero de commande</span>
            <strong>{orderId}</strong>
          </div>
          <div className="summary-line">
            <span>Articles</span>
            <strong>{orderSummary?.itemCount ?? "-"}</strong>
          </div>
          <div className="summary-line">
            <span>Montant</span>
            <strong>
              {orderSummary?.amount ? formatPrice(orderSummary.amount) : "A confirmer"}
            </strong>
          </div>
          <div className="summary-line">
            <span>Livraison</span>
            <strong>{orderSummary?.shippingSpeed ?? "Standard"}</strong>
          </div>
          <div className="summary-line">
            <span>Tentative</span>
            <strong>{orderSummary?.attemptNumber ?? "-"}</strong>
          </div>
        </div>

        <div className="hero-actions">
          <Link className="button button-primary" href="/catalog">
            Revenir au catalogue
          </Link>
          <Link className="button button-secondary" href="/">
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-stack section">
          <div className="loading-card">
            <span className="eyebrow">Confirmation</span>
            <h1>Chargement de la confirmation...</h1>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckoutSteps } from "@/components/checkout-steps";
import { useCart } from "@/components/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import {
  registerPaymentAttempt,
  shouldSimulatePaymentFailure,
  simulateGatewayFailure
} from "@/lib/payment";

function buildOrderId() {
  return `EH-${Math.floor(Math.random() * 900000 + 100000)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isReady, items, subtotal, shipping, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    postalCode: "",
    shippingSpeed: "standard",
    paymentMethod: "card"
  });
  const [message, setMessage] = useState("");
  const hasTrackedCheckoutStart = useRef(false);

  useEffect(() => {
    if (!isReady || items.length === 0 || hasTrackedCheckoutStart.current) {
      return;
    }

    hasTrackedCheckoutStart.current = true;
    trackEvent("checkout_start", {
      item_count: items.length,
      cart_total: total,
      shipping_price: shipping
    });
  }, [isReady, items.length, shipping, total]);

  const shippingLabel = useMemo(() => {
    return formState.shippingSpeed === "express" ? "Express 24h" : "Standard 48h";
  }, [formState.shippingSpeed]);

  if (!isReady) {
    return (
      <div className="page-stack section">
        <div className="loading-card">
          <span className="eyebrow">Checkout</span>
          <h1>Preparation du checkout...</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-stack section">
        <div className="empty-state">
          <span className="eyebrow">Checkout</span>
          <h1>Impossible de demarrer le paiement sans panier.</h1>
          <p>Ajoute d&apos;abord un produit pour tester le tunnel d&apos;achat.</p>
          <Link className="button button-primary" href="/catalog">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1200);
    });

    const attemptNumber = registerPaymentAttempt();

    if (shouldSimulatePaymentFailure(attemptNumber)) {
      simulateGatewayFailure({
        attempt_number: attemptNumber,
        cart_total: total,
        item_count: items.length,
        payment_method: formState.paymentMethod,
        shipping_speed: formState.shippingSpeed
      });

      setIsSubmitting(false);
      setMessage(
        `La tentative #${attemptNumber} declenche volontairement une erreur technique non geree. C'est le scenario prevu pour les futurs tests GlitchTip.`
      );
      return;
    }

    const orderId = buildOrderId();

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "eco-hardware:last-order",
        JSON.stringify({
          orderId,
          amount: total,
          itemCount: items.length,
          shippingSpeed: shippingLabel,
          attemptNumber
        })
      );
    }

    trackEvent("checkout_success", {
      order_id: orderId,
      attempt_number: attemptNumber,
      item_count: items.length,
      cart_total: total,
      payment_method: formState.paymentMethod,
      shipping_speed: formState.shippingSpeed
    });

    clearCart();
    router.push(`/checkout/success?order=${orderId}`);
  }

  return (
    <div className="page-stack section">
      <CheckoutSteps current="checkout" />

      <div className="checkout-layout">
        <div className="checkout-column">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Checkout</span>
              <h1>Finaliser la commande</h1>
            </div>
            <p className="section-copy">
              Un formulaire volontairement simple pour garder un tunnel lisible,
              facile a instrumenter et a tester plus tard avec de vrais evenements.
            </p>
          </div>

          <div className="info-panel">
            <strong>Scenario de panne deja pret</strong>
            <p>
              Chaque troisieme tentative de paiement declenche volontairement une
              erreur JavaScript non geree, sans exposer de donnees personnelles,
              pour pouvoir brancher GlitchTip proprement ensuite.
            </p>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>Prenom</span>
                <input
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, firstName: event.target.value }))
                  }
                  required
                  type="text"
                  value={formState.firstName}
                />
              </label>

              <label className="field">
                <span>Nom</span>
                <input
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, lastName: event.target.value }))
                  }
                  required
                  type="text"
                  value={formState.lastName}
                />
              </label>

              <label className="field field-full">
                <span>Email</span>
                <input
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                  type="email"
                  value={formState.email}
                />
              </label>

              <label className="field">
                <span>Ville</span>
                <input
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, city: event.target.value }))
                  }
                  required
                  type="text"
                  value={formState.city}
                />
              </label>

              <label className="field">
                <span>Code postal</span>
                <input
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, postalCode: event.target.value }))
                  }
                  pattern="[0-9]{5}"
                  required
                  type="text"
                  value={formState.postalCode}
                />
              </label>
            </div>

            <div className="checkout-panels">
              <fieldset className="option-card">
                <legend>Livraison</legend>

                <label className="option-row">
                  <input
                    checked={formState.shippingSpeed === "standard"}
                    name="shippingSpeed"
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        shippingSpeed: event.target.value
                      }))
                    }
                    type="radio"
                    value="standard"
                  />
                  <span>Standard 48h</span>
                </label>

                <label className="option-row">
                  <input
                    checked={formState.shippingSpeed === "express"}
                    name="shippingSpeed"
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        shippingSpeed: event.target.value
                      }))
                    }
                    type="radio"
                    value="express"
                  />
                  <span>Express 24h</span>
                </label>
              </fieldset>

              <fieldset className="option-card">
                <legend>Paiement</legend>

                <label className="option-row">
                  <input
                    checked={formState.paymentMethod === "card"}
                    name="paymentMethod"
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                    type="radio"
                    value="card"
                  />
                  <span>Carte bancaire</span>
                </label>

                <label className="option-row">
                  <input
                    checked={formState.paymentMethod === "wire"}
                    name="paymentMethod"
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                    type="radio"
                    value="wire"
                  />
                  <span>Virement</span>
                </label>
              </fieldset>
            </div>

            {message ? <p className="status-message status-warning">{message}</p> : null}

            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Validation en cours..." : "Payer ma commande"}
            </button>
          </form>
        </div>

        <aside className="summary-card">
          <h2>Recapitulatif</h2>
          <div className="stack-list compact-list">
            {items.map((item) => (
              <div className="summary-line" key={item.slug}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-lines">
            <div className="summary-line">
              <span>Sous-total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <strong>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</strong>
            </div>
            <div className="summary-line">
              <span>Delai</span>
              <strong>{shippingLabel}</strong>
            </div>
            <div className="summary-line summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

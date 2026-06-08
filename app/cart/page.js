"use client";

import Link from "next/link";
import { CheckoutSteps } from "@/components/checkout-steps";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const {
    isReady,
    items,
    subtotal,
    shipping,
    total,
    removeItem,
    updateQuantity
  } = useCart();

  if (!isReady) {
    return (
      <div className="page-stack section">
        <div className="loading-card">
          <span className="eyebrow">Panier</span>
          <h1>Chargement du panier...</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-stack section">
        <div className="empty-state">
          <span className="eyebrow">Panier</span>
          <h1>Ton panier est encore vide.</h1>
          <p>
            Commence par ajouter quelques references du catalogue pour tester le
            parcours d&apos;achat complet.
          </p>
          <Link className="button button-primary" href="/catalog">
            Parcourir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack section">
      <CheckoutSteps current="cart" />

      <div className="cart-layout">
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Panier</span>
              <h1>Verifier la commande avant le checkout</h1>
            </div>
          </div>

          <div className="info-panel">
            <strong>Tunnel pret pour l&apos;instrumentation</strong>
            <p>
              Cette etape reste simple a mesurer ensuite: panier, passage au
              checkout puis confirmation, sans melanger la logique metier et la
              future couche analytics.
            </p>
          </div>

          <div className="stack-list">
            {items.map((item) => (
              <article className="cart-row" key={item.slug}>
                <div className="cart-visual" style={{ "--accent": item.color }} />

                <div className="cart-copy">
                  <h2>{item.name}</h2>
                  <p>{item.tagline}</p>
                  <span className="price-inline">{formatPrice(item.price)}</span>
                </div>

                <div className="quantity-control">
                  <label htmlFor={`quantity-${item.slug}`}>Quantite</label>
                  <select
                    id={`quantity-${item.slug}`}
                    onChange={(event) => updateQuantity(item.slug, Number(event.target.value))}
                    value={item.quantity}
                  >
                    {[1, 2, 3, 4, 5].map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="text-button"
                  onClick={() => removeItem(item.slug)}
                  type="button"
                >
                  Retirer
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="summary-card">
          <div className="summary-lines">
            <div className="summary-line">
              <span>Sous-total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <strong>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</strong>
            </div>
            <div className="summary-line summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <p className="summary-note">
            Livraison offerte a partir de 120 EUR. Cette valeur sera utile plus
            tard pour l&apos;analyse du panier moyen et du taux de conversion.
          </p>

          <Link className="button button-primary button-block" href="/checkout">
            Passer la commande
          </Link>
          <Link className="button button-secondary button-block" href="/catalog">
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}

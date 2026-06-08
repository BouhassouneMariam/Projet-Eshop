"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";

export function ProductDetails({ product }) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    trackEvent("view_product", {
      product_slug: product.slug,
      product_name: product.name,
      product_category: product.category
    });
  }, [product.category, product.name, product.slug]);

  function handleAddToCart() {
    addItem(product);
    trackEvent("add_to_cart", {
      product_slug: product.slug,
      product_name: product.name,
      product_price: product.price
    });
    setFeedback("Ajoute au panier");
    window.setTimeout(() => setFeedback(""), 1400);
  }

  return (
    <div className="page-stack section detail-layout">
      <div className="detail-visual" style={{ "--accent": product.color }}>
        <div className="detail-device">
          <div className="detail-screen" />
          <div className="detail-base" />
        </div>
      </div>

      <div className="detail-copy">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="hero-text">{product.description}</p>

        <div className="detail-meta">
          <span className="pill">Score {product.rating} / 5</span>
          <span className="pill">Stock limite</span>
          <span className="pill">SKU {product.sku}</span>
        </div>

        <div className="detail-price-row">
          <strong className="detail-price">{formatPrice(product.price)}</strong>
          <span className="detail-note">TVA incluse, expedition depuis Paris.</span>
        </div>

        <div className="hero-actions">
          <button className="button button-primary" onClick={handleAddToCart} type="button">
            {feedback || "Ajouter au panier"}
          </button>
          <Link className="button button-secondary" href="/cart">
            Aller au panier
          </Link>
        </div>

        <section className="detail-section">
          <h2>Points forts</h2>
          <ul className="bullet-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h2>Specifications</h2>
          <div className="spec-grid">
            {Object.entries(product.specifications).map(([label, value]) => (
              <div className="spec-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

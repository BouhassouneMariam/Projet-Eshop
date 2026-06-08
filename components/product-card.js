"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState("");

  function handleAddToCart() {
    addItem(product);
    trackEvent("add_to_cart", {
      product_slug: product.slug,
      product_name: product.name,
      product_price: product.price
    });
    setFeedback("Ajoute");
    window.setTimeout(() => setFeedback(""), 1200);
  }

  return (
    <article className="product-card">
      <Link
        aria-label={`Voir la fiche produit ${product.name}`}
        className="product-visual"
        href={`/products/${product.slug}`}
        style={{ "--accent": product.color }}
      >
        <span className="product-badge">{product.category}</span>
        <div className="product-device">
          <div className="device-screen" />
          <div className="device-stand" />
        </div>
      </Link>

      <div className="product-copy">
        <div className="product-meta">
          <span className="pill">{product.category}</span>
          <span className="rating">{product.rating} / 5</span>
        </div>
        <Link aria-label={`Ouvrir ${product.name}`} className="product-title" href={`/products/${product.slug}`}>
          {product.name}
        </Link>
        <p>{product.tagline}</p>
      </div>

      <div className="product-actions">
        <strong className="price-tag">{formatPrice(product.price)}</strong>
        <div className="action-row">
          <Link className="button button-secondary" href={`/products/${product.slug}`}>
            Details
          </Link>
          <button className="button button-primary" onClick={handleAddToCart} type="button">
            {feedback || "Ajouter"}
          </button>
        </div>
      </div>
    </article>
  );
}

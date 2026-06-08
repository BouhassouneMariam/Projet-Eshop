"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { computeShipping } from "@/lib/format";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawCart = window.localStorage.getItem("eco-hardware:cart");
      if (rawCart) {
        setItems(JSON.parse(rawCart));
      }
    } catch {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("eco-hardware:cart", JSON.stringify(items));
  }, [isReady, items]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = computeShipping(subtotal);
    const total = subtotal + shipping;
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    function addItem(product) {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.slug === product.slug);

        if (existingItem) {
          return currentItems.map((item) =>
            item.slug === product.slug
              ? { ...item, quantity: Math.min(item.quantity + 1, 5) }
              : item
          );
        }

        return [
          ...currentItems,
          {
            slug: product.slug,
            name: product.name,
            tagline: product.tagline,
            price: product.price,
            quantity: 1,
            color: product.color
          }
        ];
      });
    }

    function removeItem(slug) {
      setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
    }

    function updateQuantity(slug, quantity) {
      setItems((currentItems) =>
        currentItems
          .map((item) => (item.slug === slug ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0)
      );
    }

    function clearCart() {
      setItems([]);
    }

    return {
      addItem,
      cartCount,
      clearCart,
      isReady,
      items,
      removeItem,
      shipping,
      subtotal,
      total,
      updateQuantity
    };
  }, [isReady, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

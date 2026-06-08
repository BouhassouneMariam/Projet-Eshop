"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/catalog", label: "Catalogue" },
  { href: "/cart", label: "Panier" },
  { href: "/checkout", label: "Checkout" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-mark" href="/">
          <span className="brand-badge">EH</span>
          <span className="brand-copy">
            <strong>Eco-Hardware</strong>
            <small>e-commerce durable</small>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="nav-row">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
                {item.href === "/cart" && cartCount > 0 ? (
                  <span className="cart-counter">{cartCount}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

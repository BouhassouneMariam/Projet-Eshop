"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, productCategories } from "@/lib/products";

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === "Toutes" || product.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.tagline, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === "price-asc") {
      return [...nextProducts].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...nextProducts].sort((a, b) => b.price - a.price);
    }

    return [...nextProducts].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [activeCategory, query, sortBy]);

  return (
    <div className="page-stack section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Equipe ton espace de travail sans alourdir ton impact.</h1>
        </div>
        <p className="section-copy">
          Des accessoires, de l&apos;energie et du hardware penses pour durer, se
          reparer et se mesurer facilement dans un futur funnel analytics.
        </p>
      </div>

      <section className="catalog-toolbar">
        <div className="chip-row" role="tablist" aria-label="Filtrer par categorie">
          <button
            className={`chip ${activeCategory === "Toutes" ? "chip-active" : ""}`}
            onClick={() => setActiveCategory("Toutes")}
            type="button"
          >
            Toutes
          </button>
          {productCategories.map((category) => (
            <button
              className={`chip ${activeCategory === category.name ? "chip-active" : ""}`}
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="toolbar-row">
          <label className="field field-grow">
            <span>Recherche</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Batterie, clavier, hub..."
              type="search"
              value={query}
            />
          </label>

          <label className="field field-select">
            <span>Trier</span>
            <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              <option value="featured">Selection maison</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix decroissant</option>
            </select>
          </label>
        </div>
      </section>

      <div className="catalog-result">
        <p>{filteredProducts.length} produit(s) disponible(s)</p>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

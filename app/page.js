import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { featuredProducts, productCategories } from "@/lib/products";

const proofPoints = [
  {
    label: "Materiaux traces",
    value: "92%",
    detail: "des references affichent une origine recyclee ou reconditionnee."
  },
  {
    label: "Packaging optimise",
    value: "-38%",
    detail: "de volume carton moyen sur les commandes multi-produits."
  },
  {
    label: "Produits suivis",
    value: "4 etapes",
    detail: "du funnel deja prevues pour le futur tracking analytics."
  }
];

const trustBlocks = [
  "Catalogue pense pour des achats tech plus sobres.",
  "Tunnel d'achat clair, simple et pret pour la telemetrie.",
  "Structure ideale pour brancher Umami et GlitchTip ensuite."
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-panel section">
        <div className="hero-copy">
          <span className="eyebrow">Eco-Hardware</span>
          <h1>
            L&apos;e-commerce hardware pense pour la conversion, la sobriete et
            l&apos;observabilite.
          </h1>
          <p className="hero-text">
            Une base boutique complete pour vendre du materiel tech durable,
            avec un panier fluide, un checkout simple et des points d&apos;accroche
            deja prets pour la future couche analytique.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/catalog">
              Explorer le catalogue
            </Link>
            <Link className="button button-secondary" href="/checkout">
              Voir le checkout
            </Link>
          </div>
        </div>

        <div className="hero-board">
          <div className="hero-grid">
            {proofPoints.map((point) => (
              <article className="metric-card" key={point.label}>
                <span className="metric-label">{point.label}</span>
                <strong className="metric-value">{point.value}</strong>
                <p>{point.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selection maison</span>
            <h2>Produits vitrines</h2>
          </div>
          <Link className="text-link" href="/catalog">
            Voir tout le catalogue
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Architecture produit</span>
            <h2>Une boutique simple, mais deja exploitable</h2>
          </div>
        </div>

        <div className="category-grid">
          {productCategories.map((category) => (
            <article className="info-card" key={category.name}>
              <span className="pill">{category.name}</span>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Pret pour la suite</span>
            <h2>Base ideale pour votre partie telemetrie</h2>
          </div>
        </div>

        <div className="trust-grid">
          {trustBlocks.map((block) => (
            <article className="trust-card" key={block}>
              <p>{block}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

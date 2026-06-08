import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-stack section">
      <div className="empty-state">
        <span className="eyebrow">404</span>
        <h1>Cette reference n&apos;existe pas.</h1>
        <p>Le catalogue continue ici, avec des produits durables et bien ranges.</p>
        <Link className="button button-primary" href="/catalog">
          Retour au catalogue
        </Link>
      </div>
    </div>
  );
}

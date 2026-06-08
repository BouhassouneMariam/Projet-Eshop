import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product-details";
import { getProductBySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug
  }));
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

import { ProductCard } from "@/features/shop/components/product-card";
import type { ProductWithBrand } from "@/features/shop/types/shop.types";

interface ProductGridProps {
  products: ProductWithBrand[];
  /** Eagerly load the first row's images; use on the topmost grid of a page. */
  priorityCount?: number;
}

export const ProductGrid = ({
  products,
  priorityCount = 0,
}: ProductGridProps) => {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
};

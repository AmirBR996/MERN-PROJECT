import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/cards/product_card";
import CategoryFilter from "../components/product/CategoryFilter";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton";
import EmptyState from "../components/ui/EmptyState";
import { getAllProducts } from "../api/product.api";
import { filterAndSortProducts, SORT_OPTIONS } from "../utils/helpers";
import { PackageOpen } from "lucide-react";

const ProductPage = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, { search: searchQuery, category, sort }),
    [products, searchQuery, category, sort]
  );

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-leaf-600">
          Marketplace
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-bark sm:text-5xl">
          Fresh from Nepali farms
        </h1>
        <p className="mt-3 text-mist leading-relaxed">
          Browse vegetables, fruits, grains, and dairy listed directly by local farmers.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter selected={category} onChange={setCategory} />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-soil-200 bg-white px-4 py-2.5 text-sm text-bark outline-none focus:border-leaf-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchQuery || category !== "All"
              ? "Try adjusting your search or category filter."
              : "No farmers have listed products yet. Check back soon!"
          }
          actionLabel="View all products"
          actionTo="/products"
          icon={PackageOpen}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;

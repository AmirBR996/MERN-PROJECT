import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/cards/product_card";
import CategoryChips from "../components/ui/CategoryChips";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton";
import EmptyState from "../components/ui/EmptyState";
import TrustBadge from "../components/ui/TrustBadge";
import { getAllProducts } from "../api/product.api";
import { filterAndSortProducts, SORT_OPTIONS, CATEGORIES } from "../utils/helpers";
import { PackageOpen, Search, SlidersHorizontal, Leaf, ShieldCheck, Truck } from "lucide-react";
import Button from "../components/ui/Button";

const ProductPage = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, { search: localSearch, category, sort }),
    [products, localSearch, category, sort]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Browse Categories
            </h3>
          </div>
          <CategoryChips
            categories={CATEGORIES}
            activeCategory={category}
            onCategoryChange={setCategory}
          />
        </div>

        {/* Main Marketplace Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground mb-6">Refined Search</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Sort By</label>
                  <div className="flex flex-col gap-1.5">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          sort === opt.value
                          ? "bg-primary text-white font-bold shadow-sm"
                          : "text-muted-foreground hover:bg-stone-100 hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full text-xs py-2"
                    onClick={() => { setCategory("All"); setLocalSearch(""); setSort("newest"); }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  {category === "All" ? "PRODUCTS" : `${category} Product`}
                </h2>
              </div>
            </div>

            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No harvests found"
                description={
                  localSearch || category !== "All"
                    ? "Try adjusting your search or category filter to find what you're looking for."
                    : "No farmers have listed products yet. Check back soon!"
                }
                actionLabel="View all produce"
                actionTo="/products"
                icon={PackageOpen}
              />
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 l:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div >
      </div >
    </div >
  );
};

export default ProductPage;

import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/cards/product_card";
import { getAllProducts } from "../api/product.api";

const ProductPage = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [product?.name, product?.description, product?.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [products, searchQuery]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
          Marketplace
        </p>
        <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">
          Krishik Bazar Products
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          Browse products listed by farmers across the marketplace. Seller editing is handled from the My Products dashboard.
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
          {searchQuery.trim() ? "No products match your search." : "No products available."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;

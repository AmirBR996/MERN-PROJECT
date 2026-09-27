import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Leaf,
  Package,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { AuthContext } from "../components/footer/authcontext.jsx";
import { getAllProducts } from "../api/product.api.js";
import ProductCard from "../components/cards/product_card.jsx";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import CategoryChips from "../components/ui/CategoryChips.jsx";
import TrustBadge from "../components/ui/TrustBadge.jsx";

export function Home_page({ searchQuery = "" }) {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { id: "All", label: "All Produce" },
    { id: "Vegetables", label: "Vegetables" },
    { id: "Fruits", label: "Fruits" },
    { id: "Grains", label: "Grains" },
    { id: "Dairy", label: "Dairy" },
  ];

  const trustBadges = [
    { text: "Verified Farmers" },
    { text: "Fresh Harvests" },
    { text: "Fast Local Delivery" },
    { text: "Fair Pricing" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        if (activeCategory !== "All" && product.category?.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
        if (!query) return true;
        const searchableText = [product?.name, product?.description, product?.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      })
      .slice(0, 12);
  }, [products, searchQuery, activeCategory]);

  const features = [
    {
      icon: BadgeCheck,
      title: "Verified Farmers",
      description: "All farmers are verified and authenticated for your trust",
    },
    {
      icon: Leaf,
      title: "Organic Certified",
      description: "Wide range of certified organic products available",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Safe and secure payment gateway for all transactions",
    },
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "Direct connection ensures fair prices for everyone",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white border-b border-border">
        <div className="relative mx-auto grid gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Nepal&apos;s #1 Agri-Tech Platform
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight font-display">
                Buy Fresh Crops <br className="hidden sm:block" />
                <span className="text-primary">Directly from Farmers</span>
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed font-sans">
                Connect with verified farmers across Nepal. Get farm-fresh produce, organic products, and authentic agricultural goods delivered to your doorstep.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 font-sans">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                <div className="rounded-full border border-primary/30 bg-primary/10 p-0.5">
                  <BadgeCheck className="h-3 w-3 text-primary" />
                </div>
                Verified Farmers
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                <div className="rounded-full border border-primary/30 bg-primary/10 p-0.5">
                  <BadgeCheck className="h-3 w-3 text-primary" />
                </div>
                Organic Certified
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[3rem] border border-green-700 p-1 bg-green-800 shadow-5xl">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR49OHGzVdIq4BC6-TZuL_p-_r-wFYasTKi4fZknxyvLQ&s=10"
                alt="Happy Farmer"
                className="h-120 w-full object-cover rounded-[1.8rem]"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden max-w-xs rounded-2xl border border-stone-100 bg-white p-4 shadow-xl md:flex items-center gap-4 transition-transform hover:scale-105">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">77 District</p>
                <p className="text-sm text-muted-foreground mt-1">Verified Farmers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="w-full bg-background py-20 lg:py-15">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="text-xl font-bold uppercase tracking-widest text-primary">
                Straight from the Soil
              </p>
              <CategoryChips
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              View the whole market
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <ProductGridSkeleton count={3} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {filteredProducts.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
          ) : (
            <EmptyState
              title="No products listed yet"
              description="Our regional farmers haven't stocked the virtual shelf today. Please try again soon."
              actionLabel="Browse marketplace"
              actionTo="/products"
              icon={Package}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-20 lg:py-24 border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose Krishik Bazaar?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Trusted by thousands of farmers and buyers across India
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
    </div>
  );
}

export default Home_page;

import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  CheckCircle2,
  Leaf,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Sprout,
  Star,
  TrendingUp,
  Truck,
  Upload,
  Users,
} from "lucide-react";
import { AuthContext } from "../components/footer./authcontext.jsx";
import { createProduct, getAllProducts } from "../api/product.api.js";
import ProductCard from "../components/cards/product_card.jsx";

const initialProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Vegetables",
  image_url: "",
  stock: "",
};

export function Home_page({ searchQuery = "" }) {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [productForm, setProductForm] = useState(initialProductForm);

  const sellerId = user?.id || user?._id || "";
  const canListProducts = user?.user_type === "seller" && Boolean(sellerId);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setStatusMessage("Unable to load products right now.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!query) {
          return true;
        }

        const searchableText = [product?.name, product?.description, product?.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .slice(0, 6);
  }, [products, searchQuery]);

  const stats = [
    { icon: Users, label: "Active Farmers", value: "50,000+" },
    { icon: Package, label: "Products Listed", value: "2L+" },
    { icon: TrendingUp, label: "Orders Delivered", value: "10L+" },
    { icon: ShieldCheck, label: "Trust Score", value: "4.8/5" },
  ];

  const features = [
    {
      icon: BadgeCheck,
      title: "Verified farmers",
      description: "Every seller is visible, traceable, and easy to contact.",
    },
    {
      icon: Leaf,
      title: "Fresh harvests",
      description: "Seasonal produce, grains, dairy, and more in one marketplace.",
    },
    {
      icon: Truck,
      title: "Fast local delivery",
      description: "Move produce from the farm gate to the city shelf faster.",
    },
    {
      icon: CircleDollarSign,
      title: "Fair pricing",
      description: "Buyers and farmers meet directly with less middleman friction.",
    },
  ];

  const farmerSteps = [
    {
      icon: Sprout,
      title: "List harvest",
      description: "Share product details, stock, and images from the farm.",
    },
    {
      icon: Users,
      title: "Reach buyers",
      description: "Your produce becomes discoverable on the live marketplace.",
    },
    {
      icon: TrendingUp,
      title: "Grow income",
      description: "Track what sells and expand the crops that move fastest.",
    },
  ];

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    if (!canListProducts) {
      setStatusMessage("Login as a seller to add a product.");
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock || 0),
      seller_id: sellerId,
    };

    setIsSubmitting(true);

    try {
      const createdProduct = await createProduct(payload);
      setProducts((current) => [createdProduct, ...current]);
      setProductForm(initialProductForm);
      setStatusMessage("Product added successfully.");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Unable to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen text-slate-900">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-leaf-50 via-parchment to-harvest-50 texture-market">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-leaf-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-harvest-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-soil-200 bg-white/80 px-4 py-2 text-sm font-medium text-leaf-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-leaf-500" />
              Nepal&apos;s farmer-first agri marketplace
            </div>

            <div className="space-y-6">
              <h1 className="font-display max-w-3xl text-5xl font-bold tracking-tight text-bark sm:text-6xl lg:text-7xl">
                Sell fresh produce, connect with buyers, and grow from the farm up.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-mist sm:text-xl">
                Krishik Bazar gives farmers a larger digital storefront and buyers a direct path from harvest to table.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-leaf-600/20 transition hover:-translate-y-0.5 hover:bg-leaf-700"
              >
                Browse marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR49OHGzVdIq4BC6-TZuL_p-_r-wFYasTKi4fZknxyvLQ&s=10"
                alt="Farmer in a field"
                className="h-130 w-full object-cover"
              />
            </div>

            <div className="absolute -left-4 top-8 hidden max-w-xs rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Fresh crop spotlight</p>
                  <p className="text-sm text-slate-500">Show new harvests at the top of the feed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-black text-slate-950">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Marketplace highlights
            </p>
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Built for buyers, but designed to help farmers sell faster.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              The home page now acts like a real marketplace entry point with live products, seller-focused actions, and a larger layout that gives the brand room to breathe.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-leaf-600">
              Fresh from the farm
            </p>
            <h2 className="font-display text-3xl font-bold text-bark sm:text-4xl">
              Featured products from local farmers
            </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-slate-500">
              Loading products...
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-slate-500">
              No products available yet.
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-slate-950 py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Built for growth
            </p>
            <h2 className="text-3xl font-black sm:text-4xl">
              Bigger homepage, clearer product flow, and a better path for farmers.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              The redesign gives the landing page more space, stronger hierarchy, and a live listing section that feels like a real marketplace feature instead of a static promo card.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
              >
                Explore products
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Direct sales", text: "Cut friction between the field and the buyer." },
              { title: "Seller visibility", text: "Make farmer profiles and listings easier to discover." },
              { title: "Functional UI", text: "Add products directly from the homepage." },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-lg font-bold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckMark() {
  return <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />;
}

export default Home_page;

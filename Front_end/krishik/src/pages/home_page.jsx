import { useContext, useEffect, useMemo, useState } from "react";
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
import { AuthContext } from "../components/footer./authcontext.jsx";
import { createProduct, getAllProducts } from "../api/product.api.js";
import ProductCard from "../components/cards/product_card.jsx";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

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
    <div className="w-full min-h-screen bg-stone-50 text-stone-800 font-serif selection:bg-orange-200">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50/60 via-stone-100 to-orange-50/30 border-b border-stone-200">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto grid gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-100 px-4 py-1.5 text-xs uppercase tracking-wider font-sans font-semibold text-stone-700 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
              Nepal&apos;s organic agri marketplace
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl lg:text-6xl font-serif leading-tight">
                Sell honest produce, connect directly, and grow from the <span className="italic text-emerald-800 font-medium">ground up.</span>
              </h1>
              <p className="max-w-2xl text-lg font-sans text-stone-600 leading-relaxed">
                Krishik Bazar gives local farmers a direct digital storefront and brings the neighborhood market experience straight to your table.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 font-sans">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3.5 text-sm font-medium text-amber-50 shadow-md transition hover:bg-emerald-800"
              >
                Explore the harvest
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-stone-300 p-2 bg-white shadow-xl">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR49OHGzVdIq4BC6-TZuL_p-_r-wFYasTKi4fZknxyvLQ&s=10"
                alt="Farmer in a field"
                className="h-120 w-full object-cover rounded-lg"
              />
            </div>

            <div className="absolute -left-4 top-8 hidden max-w-xs rounded-lg border border-stone-300 bg-amber-50/95 p-4 shadow-md font-sans md:block">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-emerald-800 p-2.5 text-amber-50">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-stone-900">Market Pick</p>
                  <p className="text-sm text-stone-700 mt-0.5">Spotlight on seasonal local harvests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Featured Products Section */}
      <section className="w-full bg-white py-20 lg:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-800 font-sans">
                Straight from the Soil
              </p>
              <h2 className="text-3xl font-normal text-stone-900 sm:text-4xl">
                Featured local listings
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium font-sans text-stone-700 transition hover:bg-stone-50"
            >
              View the whole market
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <ProductGridSkeleton count={3} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
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
      <section className="w-full bg-stone-100/50 py-20 lg:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-700 font-sans">
              Our Principles
            </p>
            <h2 className="text-3xl font-normal text-stone-900 sm:text-4xl">
              Honest trade, designed to help local farming communities thrive.
            </h2>
            <p className="mt-4 text-base font-sans text-stone-600 leading-relaxed">
              We eliminate technical clutter to deliver a straightforward marketplace path connecting rural growers with city kitchens.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 font-sans">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs transition duration-200 hover:border-stone-400"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                    index % 2 === 0 ? "bg-emerald-50 text-emerald-800" : "bg-orange-50 text-orange-700"
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home_page;
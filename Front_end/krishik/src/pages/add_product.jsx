import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Package, Plus, RefreshCw, Sprout, TrendingUp } from "lucide-react";
import { AuthContext } from "../components/footer./authcontext.jsx";
import ProductCard from "../components/cards/product_card.jsx";
import { createProduct, deleteProduct, getMyProducts, updateProduct } from "../api/product.api.js";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Vegetables",
  image_url: "",
  stock: "",
};

const categoryOptions = ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Other"];

export const Add_product = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const sellerId = user?._id || user?.id || "";
  const isSeller = user?.user_type === "seller";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [form, setForm] = useState(initialForm);

  const loadProducts = async () => {
    if (!sellerId || !isSeller) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to load your products right now.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [sellerId, isSeller]);

  const summary = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((product) => Number(product.stock || 0) > 0).length;
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5).length;
    const totalValue = products.reduce((sum, product) => {
      const price = Number(product.price || 0);
      const stock = Number(product.stock || 0);
      return sum + price * stock;
    }, 0);

    return [
      { label: "Total products", value: total },
      { label: "In stock", value: inStock },
      { label: "Low stock", value: lowStock },
      { label: "Inventory value", value: `Rs. ${totalValue.toFixed(0)}` },
    ];
  }, [products]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const clearForm = () => {
    setForm(initialForm);
    setEditingProductId(null);
    setMessage("");
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price !== undefined ? String(product.price) : "",
      category: product.category || "Vegetables",
      image_url: product.image_url || "",
      stock: product.stock !== undefined ? String(product.stock) : "",
    });
    setMessage("Editing product. Update the fields below and save.");
    setMessageType("info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product._id !== id));
      if (editingProductId === id) {
        clearForm();
      }
      setMessage("Product deleted successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to delete product.");
      setMessageType("error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isSeller) {
      setMessage("Only sellers can manage products.");
      setMessageType("error");
      return;
    }

    if (!sellerId) {
      setMessage("Seller account information is missing.");
      setMessageType("error");
      return;
    }

    if (!form.name || !form.description || !form.price || !form.image_url) {
      setMessage("Fill in all required product details.");
      setMessageType("error");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      seller_id: sellerId,
    };

    try {
      setSaving(true);
      setMessage("");

      if (editingProductId) {
        const updated = await updateProduct(editingProductId, payload);
        setProducts((current) => current.map((product) => (product._id === editingProductId ? updated : product)));
        setMessage("Product updated successfully.");
      } else {
        const created = await createProduct(payload);
        setProducts((current) => [created, ...current]);
        setMessage("Product added successfully.");
      }

      setMessageType("success");
      clearForm();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to save product.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#f5fbf1_0%,#fff9f1_45%,#eef8ff_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-950">Login required</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Please sign in to manage products from your farmer dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Go to login
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isSeller) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#f5fbf1_0%,#fff9f1_45%,#eef8ff_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-950">Seller access only</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This dashboard is available for farmers and sellers who manage product listings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Browse marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f4fbef_0%,#fff8ef_45%,#eff9ff_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Package className="h-4 w-4" />
                Farmer product manager
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : messageType === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-sky-200 bg-sky-50 text-sky-700"
              }`}
            >
              {message}
            </div>
          ) : null}
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {editingProductId ? "Edit product" : "Add product"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {editingProductId ? "Update listing details" : "Create a new listing"}
                </h2>
              </div>
              {editingProductId ? (
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Product name" name="name" value={form.name} onChange={handleChange} placeholder="Fresh tomatoes" />
                <Field label="Price" name="price" value={form.price} onChange={handleChange} placeholder="120" type="number" />
              </div>

              <Field
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short product story, quality, and harvest notes"
                textarea
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-500">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Stock" name="stock" value={form.stock} onChange={handleChange} placeholder="25" type="number" />
              </div>

              <Field
                label="Image URL"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Plus className="h-4 w-4" />
                  {saving ? "Saving..." : editingProductId ? "Save changes" : "Add product"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Your inventory
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Products you can edit anytime
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                {products.length} active listings
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                Loading your products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <h3 className="text-xl font-bold text-slate-950">No products yet</h3>
                <p className="mt-3 text-slate-600">
                  Add your first product to start selling on the marketplace.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = "text", textarea = false }) => {
  const sharedClasses = "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

  return (
    <div>
      <label className="text-sm font-medium text-slate-500">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={sharedClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
        />
      )}
    </div>
  );
};

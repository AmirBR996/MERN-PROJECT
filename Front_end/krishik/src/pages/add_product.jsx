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
      <main className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-stone-50 to-orange-50/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white/90 p-8 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Login required</h1>
          <p className="mt-4 text-base leading-7 text-stone-500">
            Please sign in to manage products from your farmer dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3 text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5 hover:bg-emerald-800">
              Go to login
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-600 hover:text-emerald-800">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isSeller) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-stone-50 to-orange-50/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white/90 p-8 text-center shadow-sm backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-orange-50 text-orange-700">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Seller access only</h1>
          <p className="mt-4 text-base leading-7 text-stone-500">
            This dashboard is available for farmers and sellers who manage product listings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3 text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5 hover:bg-emerald-800">
              Browse marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-600 hover:text-emerald-800">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50/40 via-stone-50 to-orange-50/40 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto space-y-8">
        <section className="overflow-hidden rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Package className="h-4 w-4" />
                Farmer product manager
              </div>
              <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
                Manage your harvest listings in one place
              </h1>
              <p className="text-base leading-7 text-stone-500">
                Add new produce, keep stock levels current, and see how your inventory is performing at a glance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center gap-2 rounded-md border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-600 hover:text-emerald-800"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-leaf-700"
              >
                View marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map((item) => (
              <div key={item.label} className="rounded-md border border-stone-200 bg-stone-100/50 p-5">
                <p className="text-sm font-medium text-stone-500">{item.label}</p>
                <p className="mt-2 font-serif text-2xl font-bold text-stone-900">{item.value}</p>
              </div>
            ))}
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : messageType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-orange-200 bg-orange-50 text-orange-800"
              }`}
            >
              {message}
            </div>
          ) : null}
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-800">
                  {editingProductId ? "Edit product" : "Add product"}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
                  {editingProductId ? "Update listing details" : "Create a new listing"}
                </h2>
              </div>
              {editingProductId ? (
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-md border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-500 transition hover:border-stone-300 hover:text-stone-900"
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
                  <label className="text-sm font-semibold text-stone-900">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
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
                  className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3 text-sm font-semibold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <Plus className="h-4 w-4" />
                  {saving ? "Saving..." : editingProductId ? "Save changes" : "Add product"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-md border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-600 hover:text-emerald-800"
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-800">
                  Your inventory
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
                  Products you can edit anytime
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-stone-100/50 px-4 py-2 text-sm font-semibold text-stone-900">
                <TrendingUp className="h-4 w-4 text-emerald-800" />
                {products.length} active listings
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border border-dashed border-stone-200 bg-stone-100/50 p-12 text-center text-stone-500">
                Loading your products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-200 bg-stone-100/50 p-12 text-center">
                <h3 className="font-serif text-xl font-bold text-stone-900">No products yet</h3>
                <p className="mt-3 text-stone-500">
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
  const sharedClasses =
    "mt-1.5 w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200";

  return (
    <div>
      <label className="text-sm font-semibold text-stone-900">{label}</label>
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

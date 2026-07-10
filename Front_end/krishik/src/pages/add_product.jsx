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
      <main className="min-h-screen bg-gradient-to-br from-leaf-50 via-parchment to-harvest-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soil-200 bg-white/90 p-8 text-center shadow-xl shadow-soil-300/30 backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-bark">Login required</h1>
          <p className="mt-4 text-base leading-7 text-mist">
            Please sign in to manage products from your farmer dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-leaf-700">
              Go to login
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-soil-200 px-6 py-3 text-sm font-semibold text-bark transition hover:border-leaf-300 hover:text-leaf-700">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isSeller) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-leaf-50 via-parchment to-harvest-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soil-200 bg-white/90 p-8 text-center shadow-xl shadow-soil-300/30 backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-harvest-100 text-harvest-700">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-bark">Seller access only</h1>
          <p className="mt-4 text-base leading-7 text-mist">
            This dashboard is available for farmers and sellers who manage product listings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-leaf-700">
              Browse marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-soil-200 px-6 py-3 text-sm font-semibold text-bark transition hover:border-leaf-300 hover:text-leaf-700">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-leaf-50 via-parchment to-harvest-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-leaf-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-harvest-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto space-y-8">
        <section className="overflow-hidden rounded-3xl border border-soil-200 bg-white/90 p-6 shadow-xl shadow-soil-300/30 backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-leaf-50 px-4 py-2 text-sm font-semibold text-leaf-700">
                <Package className="h-4 w-4" />
                Farmer product manager
              </div>
              <h1 className="font-display text-3xl font-bold text-bark sm:text-4xl">
                Manage your harvest listings in one place
              </h1>
              <p className="text-base leading-7 text-mist">
                Add new produce, keep stock levels current, and see how your inventory is performing at a glance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center gap-2 rounded-2xl border border-soil-200 px-5 py-3 text-sm font-semibold text-bark transition hover:border-leaf-300 hover:text-leaf-700"
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
              <div key={item.label} className="rounded-2xl border border-soil-200 bg-soil-50/60 p-5">
                <p className="text-sm font-medium text-mist">{item.label}</p>
                <p className="mt-2 font-display text-2xl font-bold text-bark">{item.value}</p>
              </div>
            ))}
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-leaf-200 bg-leaf-50 text-leaf-700"
                  : messageType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-harvest-200 bg-harvest-50 text-harvest-800"
              }`}
            >
              {message}
            </div>
          ) : null}
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-soil-200 bg-white/90 p-6 shadow-xl shadow-soil-300/30 backdrop-blur sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-600">
                  {editingProductId ? "Edit product" : "Add product"}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-bark">
                  {editingProductId ? "Update listing details" : "Create a new listing"}
                </h2>
              </div>
              {editingProductId ? (
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-full border border-soil-200 px-4 py-2 text-sm font-semibold text-mist transition hover:border-soil-300 hover:text-bark"
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
                  <label className="text-sm font-semibold text-bark">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-soil-200 bg-white px-4 py-3 text-sm text-bark outline-none transition focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-leaf-600/20 transition hover:-translate-y-0.5 hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <Plus className="h-4 w-4" />
                  {saving ? "Saving..." : editingProductId ? "Save changes" : "Add product"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-2xl border border-soil-200 px-6 py-3 text-sm font-semibold text-bark transition hover:border-leaf-300 hover:text-leaf-700"
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-soil-200 bg-white/90 p-6 shadow-xl shadow-soil-300/30 backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-600">
                  Your inventory
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-bark">
                  Products you can edit anytime
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-soil-100 px-4 py-2 text-sm font-semibold text-bark">
                <TrendingUp className="h-4 w-4 text-leaf-600" />
                {products.length} active listings
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-dashed border-soil-200 bg-soil-50/50 p-12 text-center text-mist">
                Loading your products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-soil-200 bg-soil-50/50 p-12 text-center">
                <h3 className="font-display text-xl font-bold text-bark">No products yet</h3>
                <p className="mt-3 text-mist">
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
    "mt-1.5 w-full rounded-xl border border-soil-200 bg-white px-4 py-3 text-sm text-bark outline-none transition placeholder:text-mist focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200";

  return (
    <div>
      <label className="text-sm font-semibold text-bark">{label}</label>
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

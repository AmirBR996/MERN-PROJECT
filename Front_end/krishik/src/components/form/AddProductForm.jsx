import React, { useState, useEffect } from "react";
import { Plus, X, Upload } from "lucide-react";
import { createProduct, updateProduct } from "../../api/product.api.js";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddProductForm = ({
  initialData = null,
  onSubmitSuccess,
  onCancel
}) => {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price !== undefined ? String(initialData.price) : "",
    category: initialData?.category || "Vegetables",
    stock: initialData?.stock !== undefined ? String(initialData.stock) : "",
    location: initialData?.location || "",
    image_url: initialData?.image_url || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const categoryOptions = ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Other"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.description || !form.price || !form.location || !form.image_url) {
      setMessage("Fill in all required details including the image URL.");
      setMessageType("error");
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      stock: form.stock || 0,
      location: form.location,
      image_url: form.image_url,
    };

    try {
      setSaving(true);
      setMessage("");

      let result;
      if (initialData) {
        result = await updateProduct(initialData._id, productData);
      } else {
        result = await createProduct(productData);
      }

      setMessage(initialData ? "Product updated successfully!" : "Product added successfully!");
      setMessageType("success");

      if (onSubmitSuccess) {
        setTimeout(() => onSubmitSuccess(result), 1500);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to save product.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Fresh Tomatoes"
        />
        <Input
          label="Price (₹)"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="120"
          type="number"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-900">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your product quality, origin, and harvest notes..."
          rows={4}
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-stone-900">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Input
          label="Stock Quantity"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="25"
          type="number"
        />
      </div>

      <Input
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="e.g. Nashik, Maharashtra"
      />

      <div className="space-y-3">
        <Input
          label="Product Image URL"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
        {form.image_url && (
          <div className="relative group overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-2 transition hover:border-emerald-400">
            <img
              src={form.image_url}
              alt="Preview"
              className="h-32 w-full rounded-lg object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300";
              }}
            />
            <p className="mt-1 text-[10px] text-center text-stone-500 uppercase font-bold">Image Preview</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${
          messageType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="gap-2">
          <Plus className="h-4 w-4" />
          {saving ? "Saving..." : initialData ? "Update Product" : "Add Product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddProductForm;

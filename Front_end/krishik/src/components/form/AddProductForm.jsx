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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const categoryOptions = ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Other"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.description || !form.price || (!imageFile && !imagePreview)) {
      setMessage("Fill in all required details and upload a photo.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("stock", form.stock || 0);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setSaving(true);
      setMessage("");

      let result;
      if (initialData) {
        result = await updateProduct(initialData._id, formData);
      } else {
        result = await createProduct(formData);
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

      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-900">Product Photo</label>
        <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-4 transition hover:border-emerald-400">
          {imagePreview ? (
            <div className="relative h-48 w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow-sm transition hover:bg-white hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 rounded-full bg-emerald-100 p-3 text-emerald-600">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-stone-900">Click to upload product photo</p>
              <p className="mt-1 text-xs text-stone-500">PNG, JPG or WEBP (max 5MB)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
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

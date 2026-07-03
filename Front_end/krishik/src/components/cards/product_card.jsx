import React from "react";

const ProductCard = ({ product, onDelete, onEdit }) => {
  const price = Number(product?.price || 0);
  const stock = Number(product?.stock || 0);
  const isInStock = stock > 0;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={product?.image_url}
          alt={product?.name || "Product image"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          {product?.category || "Other"}
        </div>
        <div
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            isInStock ? "bg-emerald-100/90 text-emerald-700" : "bg-rose-100/90 text-rose-700"
          }`}
        >
          {isInStock ? `Stock ${stock}` : "Out of stock"}
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{product?.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {product?.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Price</p>
            <p className="text-2xl font-black text-slate-950">₹{price.toFixed(2)}</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            {isInStock ? `Available: ${stock}` : "Restock soon"}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-3">
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(product?._id)}
                className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
};

export { ProductCard };
export default ProductCard;

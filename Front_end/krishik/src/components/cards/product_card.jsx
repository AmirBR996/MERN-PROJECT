import { Link } from "react-router-dom";
import { MapPin, ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice, getSellerId, getSellerName } from "../../utils/helpers";
import Button from "../ui/Button";

const ProductCard = ({ product, onDelete, onEdit, showActions = true }) => {
  const { addToCart } = useCart();
  const price = Number(product?.price || 0);
  const stock = Number(product?.stock || 0);
  const isInStock = stock > 0;
  const sellerName = getSellerName(product?.seller_id);
  const sellerId = getSellerId(product?.seller_id);
  const unit = product?.unit || "kg";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
      <article className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-stone-200/60">
        <Link to={`/products/${product._id}`} className="relative block h-52 overflow-hidden bg-stone-100/50">
          <img
            src={product?.image_url}
            alt={product?.name || "Product"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-800 backdrop-blur">
            {product?.category || "Other"}
          </div>
          <div
            className={`absolute right-3 top-3 rounded-md px-3 py-1 text-xs font-semibold backdrop-blur ${
              isInStock ? "bg-emerald-50/95 text-emerald-800" : "bg-red-100/95 text-red-700"
            }`}
          >
          {isInStock ? "In stock" : "Sold out"}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
            <Link to={`/products/${product._id}`}>
              <h2 className="font-serif text-lg font-bold text-stone-900 transition hover:text-emerald-800">
                {product?.name}
              </h2>
            </Link>

            {sellerId && (
              <Link
                to={`/farmers/${sellerId}`}
                className="mt-1 inline-flex items-center gap-1 text-xs text-stone-500 transition hover:text-emerald-700"
              >
                <MapPin className="h-3 w-3" />
                {sellerName}
                {product?.seller_id?.location && ` · ${product.seller_id.location}`}
              </Link>
            )}

            <p className="mt-2 line-clamp-2 text-sm text-stone-500">{product?.description}</p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">per {unit}</p>
              <p className="font-serif text-xl font-bold text-stone-900">{formatPrice(price)}</p>
          </div>
        </div>

        {onEdit || onDelete ? (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" className="flex-1 py-2.5" onClick={() => onEdit(product)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" className="flex-1 py-2.5" onClick={() => onDelete(product._id)}>
                Delete
              </Button>
            )}
          </div>
        ) : showActions ? (
          <Button
            variant="primary"
            className="w-full py-2.5"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        ) : null}
      </div>
    </article>
  );
};

export { ProductCard };
export default ProductCard;

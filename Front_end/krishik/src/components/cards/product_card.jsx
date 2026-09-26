import { Link } from "react-router-dom";
import { MapPin, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice, getSellerId, getSellerName } from "../../utils/helpers";
import Button from "../ui/Button";
import TrustBadge from "../ui/TrustBadge";

const ProductCard = ({ product, onDelete, onEdit, showActions = true }) => {
  const { addToCart } = useCart();
  const price = Number(product?.price || 0);
  const stock = Number(product?.stock || 0);
  const isInStock = stock > 0;
  const sellerName = getSellerName(product?.seller_id);
  const sellerId = getSellerId(product?.seller_id);
  const unit = product?.unit || "kg";

  // Deterministic mock rating based on product ID
  const rating = (parseInt(product?._id?.slice(-1), 16) || 5) / 2 + 3.5;
  const reviewCount = (parseInt(product?._id?.slice(-2), 16) || 10) % 50 + 10;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
      <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted/50">
          <img
            src={product?.image_url}
            alt={product?.name || "Product"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <TrustBadge type={product?.is_organic ? "organic" : "verified"} />
            <div className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur shadow-sm">
              {product?.category || "Other"}
            </div>
          </div>
          <div
            className={`absolute right-3 top-3 rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur shadow-sm ${
              isInStock ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
          >
          {isInStock ? "In stock" : "Sold out"}
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex-1">
              

              <Link to={`/products/${product._id}`}>
                <h2 className="font-display text-lg font-bold leading-tight text-foreground transition group-hover:text-primary line-clamp-1">
                  {product?.name}
                </h2>
              </Link>

              {sellerId && (
                <Link
                  to={`/farmers/${sellerId}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
                >
                  <MapPin className="h-3 w-3" />
                  <span className="truncate font-medium">{sellerName}</span>
                </Link>
              )}

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{product?.description}</p>
          </div>

          <div className="flex items-end justify-between gap-2 pt-2 border-t border-border/50">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">per {unit}</p>
              <p className="font-display text-2xl font-black text-primary">{formatPrice(price)}</p>
            </div>
          </div>

          {onEdit || onDelete ? (
            <div className="flex gap-2 mt-2">
              {onEdit && (
                <Button variant="outline" className="flex-1 py-2" onClick={() => onEdit(product)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="danger" className="flex-1 py-2" onClick={() => onDelete(product._id)}>
                  Delete
                </Button>
              )}
            </div>
          ) : showActions ? (
            <Button
              variant="primary"
              className="w-full py-3 font-bold rounded-lg transition-all active:scale-95"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          ) : null}
        </div>
      </article>
  );
};

export { ProductCard };
export default ProductCard;

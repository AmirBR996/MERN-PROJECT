import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../contexts/CartContext";
import { formatPrice, getSellerId, getSellerName } from "../utils/helpers";
import QuantitySelector from "../components/ui/QuantitySelector";
import Button from "../components/ui/Button";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import TrustBadge from "../components/ui/TrustBadge";
import { MapPin, ArrowLeft, ShoppingCart } from "lucide-react"; // Removed unused 'Star'

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Kept in case you plan to use it (e.g., redirecting after cart add)
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto px-4 py-10 bg-background min-h-screen">
        <ProductSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center bg-background min-h-screen">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline font-medium">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const stock = Number(product.stock || 0);
  const isInStock = stock > 0;
  const sellerId = getSellerId(product.seller_id);
  const sellerName = getSellerName(product.seller_id); // Currently unused in the UI, but kept for context
  const unit = product.unit || "kg";

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start max-w-6xl mx-auto">
        {/* Product Image Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/30 shadow-sm group">
          <img
            src={product.image_url || "https://via.placeholder.com/300"}
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300";
            }}
          />
          <div className="absolute left-4 top-4">
            <TrustBadge type={product?.is_organic ? "organic" : "verified"} />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl leading-tight">
            {product.name}
          </h1>

          {sellerId && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{product.seller_id?.location || "Local Farm"}</span>
            </div>
          )}

          {/* FIXED: Removed the premature closing </div> here so the content below stays inside the right column */}

          <div className="mt-8 mb-8 py-6 border-y border-border">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-black text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-muted-foreground font-medium text-lg">per {unit}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed font-body text-lg">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <TrustBadge type="verified" />
            <TrustBadge type={product?.is_organic ? "organic" : "local"} />
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">Quantity</span>
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={stock}
                  onChange={setQuantity}
                />
              </div>
              <div className="text-right mt-6">
                <p className={`text-sm font-medium ${isInStock ? "text-secondary" : "text-destructive"}`}>
                  {isInStock ? `${stock} ${unit} available` : "Currently out of stock"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full py-5 text-lg font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default ProductDetailPage;
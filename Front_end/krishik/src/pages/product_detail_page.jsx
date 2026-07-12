import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../contexts/CartContext";
import { formatPrice, getSellerId, getSellerName } from "../utils/helpers";
import QuantitySelector from "../components/ui/QuantitySelector";
import Button from "../components/ui/Button";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { MapPin, ArrowLeft, ShoppingCart, Zap } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div className="mx-auto px-4 py-10">
        <ProductSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-500">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-emerald-700 hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const stock = Number(product.stock || 0);
  const isInStock = stock > 0;
  const sellerId = getSellerId(product.seller_id);
  const sellerName = getSellerName(product.seller_id);
  const unit = product.unit || "kg";

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (addToCart(product, quantity)) {
      navigate("/checkout");
    }
  };

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to marketplace
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-100/50">
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {product.category}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            {product.name}
          </h1>

          {sellerId && (
            <Link
              to={`/farmers/${sellerId}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-emerald-700"
            >
              <MapPin className="h-4 w-4" />
              {sellerName}
              {product.seller_id?.location && ` · ${product.seller_id.location}`}
            </Link>
          )}

          <p className="mt-6 text-stone-500 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-stone-500">/ {unit}</span>
          </div>

          <p
            className={`mt-2 text-sm font-medium ${isInStock ? "text-emerald-700" : "text-red-600"}`}
          >
            {isInStock ? `${stock} ${unit} available` : "Currently out of stock"}
          </p>

          {isInStock && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-stone-900">Quantity</p>
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={stock}
                  onChange={setQuantity}
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              variant="secondary"
              className="flex-1 sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="flex-1 sm:flex-none"
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

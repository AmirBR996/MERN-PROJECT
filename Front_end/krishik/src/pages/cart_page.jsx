import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useCart } from "../contexts/CartContext";
import { AuthContext } from "../components/footer./authcontext.jsx";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/order/OrderSummary";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { DELIVERY_FEE } from "../utils/helpers";
import toast from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const role = String(user.user_type || "").toLowerCase();
    if (role !== "buyer") {
      toast.error("Only buyer accounts can checkout. Sign in as a buyer to place orders.");
      return;
    }

    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Browse the marketplace and add fresh produce from local farmers."
          actionLabel="Browse Marketplace"
          actionTo="/products"
          icon={ShoppingCart}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">Your Cart</h1>
      <p className="mt-1 text-stone-500">
        {items.length} item{items.length !== 1 ? "s" : ""} from local farmers
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <div className="space-y-4">
          <OrderSummary items={items} subtotal={subtotal} deliveryFee={DELIVERY_FEE} />
          <Button type="button" className="w-full" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

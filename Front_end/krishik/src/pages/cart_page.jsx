import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/order/OrderSummary";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { DELIVERY_FEE } from "../utils/helpers";

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-bark">Your Cart</h1>
      <p className="mt-1 text-mist">{items.length} item{items.length !== 1 ? "s" : ""} from local farmers</p>

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
          <Link to="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

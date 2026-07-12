import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order.api";
import OrderCard from "../components/order/OrderCard";
import EmptyState from "../components/ui/EmptyState";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton";
import { Package } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">My Orders</h1>
      <p className="mt-1 text-stone-500">Track your purchases from local farmers</p>

      <div className="mt-8">
        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When you purchase produce from the marketplace, your orders will appear here."
            actionLabel="Browse Marketplace"
            actionTo="/products"
            icon={Package}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

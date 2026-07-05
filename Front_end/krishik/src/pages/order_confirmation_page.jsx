import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/helpers";
import { CheckCircle2, Truck, Loader2 } from "lucide-react";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-leaf-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-mist">Order not found.</p>
        <Link to="/products" className="mt-4 inline-block text-leaf-600 hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100">
        <CheckCircle2 className="h-10 w-10 text-leaf-600" />
      </div>

      <h1 className="mt-6 font-display text-3xl font-bold text-bark">Order Confirmed!</h1>
      <p className="mt-2 text-mist">
        Thank you for supporting local farmers. Your order{" "}
        <strong>#{order._id.slice(-8).toUpperCase()}</strong> has been placed.
      </p>

      <div className="mt-8 rounded-2xl border border-soil-200 bg-white p-6 text-left">
        <div className="flex items-center gap-3 text-sm text-mist">
          <Truck className="h-5 w-5 text-leaf-600" />
          Estimated delivery: {order.estimated_delivery || "3-5 business days"}
        </div>

        <div className="mt-4 space-y-2 border-t border-soil-200 pt-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-bark">
                {item.name} × {item.quantity}
              </span>
              <span className="text-mist">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-soil-200 pt-4 font-display text-lg font-bold text-bark">
          <span>Total paid</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <div className="mt-4 rounded-xl bg-soil-50 p-4 text-sm text-mist">
          <p className="font-semibold text-bark">Delivering to</p>
          <p>{order.delivery_address?.full_name}</p>
          <p>{order.delivery_address?.street}</p>
          <p>
            {order.delivery_address?.city}, {order.delivery_address?.district}
          </p>
          <p>{order.delivery_address?.phone}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/orders">
          <Button variant="outline">View My Orders</Button>
        </Link>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

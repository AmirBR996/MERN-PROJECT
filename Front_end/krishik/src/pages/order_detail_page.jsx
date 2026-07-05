import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";
import { formatPrice } from "../utils/helpers";
import { Loader2, ArrowLeft } from "lucide-react";

const statusStyles = {
  pending: "bg-harvest-100 text-harvest-700",
  confirmed: "bg-leaf-100 text-leaf-700",
  delivered: "bg-soil-100 text-soil-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetailPage = () => {
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
        <Link to="/orders" className="mt-4 inline-block text-leaf-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-mist hover:text-leaf-700">
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-mist">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-NP", { dateStyle: "long" })}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-8 space-y-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex gap-4 rounded-2xl border border-soil-200 bg-white p-4">
            <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-bark">{item.name}</p>
              <p className="text-sm text-mist">
                {item.quantity} × {formatPrice(item.price)} / {item.unit}
              </p>
            </div>
            <p className="font-semibold text-bark">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-soil-200 bg-white p-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-mist">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-mist">
            <span>Delivery</span>
            <span>{formatPrice(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-display text-lg font-bold text-bark">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-soil-50 p-4 text-sm">
          <p className="font-semibold text-bark">Delivery address</p>
          <p className="text-mist">{order.delivery_address?.full_name}</p>
          <p className="text-mist">{order.delivery_address?.street}</p>
          <p className="text-mist">
            {order.delivery_address?.city}, {order.delivery_address?.district}
          </p>
        </div>

        <p className="mt-4 text-sm text-mist">
          Payment: {order.payment_method === "khalti" ? "Khalti" : "Cash on Delivery"} —{" "}
          <span className="capitalize">{order.payment_status}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetailPage;

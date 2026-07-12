import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";

const statusStyles = {
  pending: "bg-orange-50 text-orange-700",
  confirmed: "bg-emerald-50 text-emerald-800",
  delivered: "bg-stone-100/50 text-stone-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderCard = ({ order }) => {
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const date = new Date(order.createdAt).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to={`/orders/${order._id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Order #{order._id?.slice(-8).toUpperCase()}
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-stone-900">{date}</p>
          <p className="text-sm text-stone-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-block rounded-md px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status] || statusStyles.pending}`}
          >
            {order.status}
          </span>
          <p className="mt-2 font-serif font-bold text-stone-900">{formatPrice(order.total)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto">
        {order.items?.slice(0, 4).map((item, i) => (
          <img
            key={i}
            src={item.image_url}
            alt={item.name}
            className="h-12 w-12 shrink-0 rounded-md object-cover"
          />
        ))}
        {order.items?.length > 4 && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-stone-100/50 text-xs font-semibold text-stone-500">
            +{order.items.length - 4}
          </div>
        )}
      </div>
    </Link>
  );
};

export default OrderCard;

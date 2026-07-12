import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import QuantitySelector from "../ui/QuantitySelector";
import { formatPrice } from "../../utils/helpers";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4">
      <Link to={`/products/${item.product_id}`} className="shrink-0">
        <img
          src={item.image_url}
          alt={item.name}
          className="h-20 w-20 rounded-md object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <Link
            to={`/products/${item.product_id}`}
            className="font-serif font-bold text-stone-900 hover:text-emerald-800"
          >
            {item.name}
          </Link>
          <p className="text-sm text-stone-500">
            {item.seller_name}
            {item.seller_location && ` · ${item.seller_location}`}
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-800">
            {formatPrice(item.price)} / {item.unit}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <QuantitySelector
            value={item.quantity}
            max={item.stock}
            onChange={(qty) => onUpdateQuantity(item.product_id, qty)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.product_id)}
            className="rounded-md p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="hidden text-right font-semibold text-stone-900 sm:block">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItem;

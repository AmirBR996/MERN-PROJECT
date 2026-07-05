import { formatPrice, DELIVERY_FEE } from "../../utils/helpers";

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee = DELIVERY_FEE,
  showGrouped = false,
  groupedBySeller,
}) => {
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-2xl border border-soil-200 bg-white p-6">
      <h3 className="font-display text-lg font-bold text-bark">Order Summary</h3>

      {showGrouped && groupedBySeller ? (
        <div className="mt-4 space-y-4">
          {Object.values(groupedBySeller).map((group) => (
            <div key={group.seller_id} className="rounded-xl bg-soil-50 p-4">
              <p className="text-sm font-semibold text-bark">{group.seller_name}</p>
              <p className="text-xs text-mist">{group.seller_location}</p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.product_id} className="flex justify-between text-sm text-mist">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {(items || []).map((item) => (
            <li key={item.product_id} className="flex justify-between text-sm text-mist">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-2 border-t border-soil-200 pt-4 text-sm">
        <div className="flex justify-between text-mist">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-mist">
          <span>Delivery fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-display text-lg font-bold text-bark">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

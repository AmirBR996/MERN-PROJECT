import { formatPrice, DELIVERY_FEE, calculatePlatformFee } from "../../utils/helpers";

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee = DELIVERY_FEE,
  platformFee,
  showGrouped = false,
  groupedBySeller,
}) => {
  const serviceCharge = platformFee ?? calculatePlatformFee(subtotal);
  const total = subtotal + deliveryFee + serviceCharge;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h3 className="font-serif text-lg font-bold text-stone-900">Order Summary</h3>

      {showGrouped && groupedBySeller ? (
        <div className="mt-4 space-y-4">
          {Object.values(groupedBySeller).map((group) => (
            <div key={group.seller_id} className="rounded-md bg-stone-100/50 p-4">
              <p className="text-sm font-semibold text-stone-900">{group.seller_name}</p>
              <p className="text-xs text-stone-500">{group.seller_location}</p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.product_id} className="flex justify-between text-sm text-stone-500">
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
            <li key={item.product_id} className="flex justify-between text-sm text-stone-500">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>Delivery fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>Krishik Bazar service charge</span>
          <span>{formatPrice(serviceCharge)}</span>
        </div>
        <div className="flex justify-between font-serif text-lg font-bold text-stone-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

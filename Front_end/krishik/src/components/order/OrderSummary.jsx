import { formatPrice, DELIVERY_FEE, calculatePlatformFee } from "../../utils/helpers";

const OrderSummary = ({
  items = [],
  subtotal = 0,
  deliveryFee = DELIVERY_FEE || 0,
  platformFee,
  showGrouped = false,
  groupedBySeller,
}) => {
  const safeSubtotal = Number(subtotal) || 0;
  const safeDeliveryFee = Number(deliveryFee) || 0;
  const serviceCharge = platformFee ?? calculatePlatformFee(safeSubtotal) ?? 0;
  const total = safeSubtotal + safeDeliveryFee + (Number(serviceCharge) || 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-foreground">Order Summary</h3>

      {showGrouped && groupedBySeller ? (
        <div className="mt-4 space-y-4">
          {Object.values(groupedBySeller).map((group) => (
            <div key={group.seller_id} className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-foreground">{group.seller_name}</p>
              <p className="text-xs text-muted-foreground">{group.seller_location}</p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.product_id} className="flex justify-between text-sm text-muted-foreground">
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
            <li key={item.product_id} className="flex justify-between text-sm text-muted-foreground">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Krishik Bazar service charge</span>
          <span>{formatPrice(serviceCharge)}</span>
        </div>
        <div className="flex justify-between font-display text-lg font-bold text-foreground">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

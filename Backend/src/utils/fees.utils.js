export const DEFAULT_DELIVERY_FEE = 100;

/** 2% of subtotal, minimum Rs. 10 */
export const calculatePlatformFee = (subtotal) => {
  const fee = subtotal * 0.02;
  return Math.max(10, Math.round(fee * 100) / 100);
};

export const calculateOrderTotals = (subtotal, deliveryFee = DEFAULT_DELIVERY_FEE) => {
  const platform_fee = calculatePlatformFee(subtotal);
  const total = Math.round((subtotal + deliveryFee + platform_fee) * 100) / 100;
  return { subtotal, delivery_fee: deliveryFee, platform_fee, total };
};

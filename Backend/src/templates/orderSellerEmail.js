import { emailWrapper, itemsTable, deliveryBlock } from "./orderEmailShared.js";

const formatPrice = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const buildSellerOrderEmailHtml = (order, seller, sellerItems) => {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const sellerSubtotal = sellerItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const content = `
    <p style="margin:0 0 4px;color:#2c2419;font-size:18px;font-weight:600;">Hi ${seller.first_name},</p>
    <p style="margin:0 0 16px;color:#8a8175;font-size:14px;line-height:1.5;">
      You have a new order <strong>#${orderId}</strong> for your products.
      Please prepare the items below for delivery.
    </p>
    <p style="margin:0 0 8px;color:#3d7629;font-size:14px;font-weight:600;">Your items in this order</p>
    ${itemsTable(sellerItems)}
    <p style="margin:8px 0 0;text-align:right;color:#2c2419;font-size:15px;font-weight:600;">
      Your subtotal: ${formatPrice(sellerSubtotal)}
    </p>
    ${deliveryBlock(order.delivery_address, "Ship to (buyer details)")}
    <p style="margin:16px 0 0;color:#8a8175;font-size:12px;">
      Platform fees and delivery are handled by Krishik Bazar. Focus on preparing fresh produce for the buyer above.
    </p>
  `;

  return emailWrapper(content);
};

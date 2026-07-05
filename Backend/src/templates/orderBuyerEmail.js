import { emailWrapper, itemsTable, feeBreakdown, deliveryBlock } from "./orderEmailShared.js";

export const buildBuyerOrderEmailHtml = (order, buyer) => {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const paymentLabel =
    order.payment_status === "paid"
      ? `Paid via ${order.payment_method?.toUpperCase()}`
      : "Cash on Delivery (pay on arrival)";

  const content = `
    <p style="margin:0 0 4px;color:#2c2419;font-size:18px;font-weight:600;">Hi ${buyer.first_name},</p>
    <p style="margin:0 0 16px;color:#8a8175;font-size:14px;line-height:1.5;">
      Your order <strong>#${orderId}</strong> has been placed successfully.
      ${order.estimated_delivery ? `Estimated delivery: <strong>${order.estimated_delivery}</strong>.` : ""}
    </p>
    <p style="margin:0 0 8px;color:#654b37;font-size:13px;">Payment: ${paymentLabel}</p>
    ${itemsTable(order.items)}
    ${feeBreakdown(order)}
    ${deliveryBlock(order.delivery_address)}
  `;

  return emailWrapper(content);
};

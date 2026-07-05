const formatPrice = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const emailHeader = () => `
  <tr>
    <td style="background:#3d7629;padding:24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;">🌿 Krishik Bazar</h1>
      <p style="margin:8px 0 0;color:#c8e4b8;font-size:13px;">Nepal's farmer-first agri marketplace</p>
    </td>
  </tr>`;

export const itemsTable = (items) => {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #e0d0b8;color:#2c2419;font-size:14px;">${item.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e0d0b8;color:#8a8175;font-size:14px;text-align:center;">${item.quantity} ${item.unit || "kg"}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e0d0b8;color:#8a8175;font-size:14px;text-align:right;">${formatPrice(item.price)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e0d0b8;color:#2c2419;font-size:14px;text-align:right;font-weight:600;">${formatPrice(item.price * item.quantity)}</td>
    </tr>`
    )
    .join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
    <tr style="background:#f0e8dc;">
      <th style="padding:10px 8px;text-align:left;font-size:12px;color:#654b37;">Item</th>
      <th style="padding:10px 8px;text-align:center;font-size:12px;color:#654b37;">Qty</th>
      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#654b37;">Unit</th>
      <th style="padding:10px 8px;text-align:right;font-size:12px;color:#654b37;">Total</th>
    </tr>
    ${rows}
  </table>`;
};

export const feeBreakdown = (order, itemsSubtotal = null) => {
  const subtotal = itemsSubtotal ?? order.subtotal;
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    <tr>
      <td style="padding:4px 0;color:#8a8175;font-size:14px;">Subtotal</td>
      <td style="padding:4px 0;color:#2c2419;font-size:14px;text-align:right;">${formatPrice(subtotal)}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#8a8175;font-size:14px;">Delivery fee</td>
      <td style="padding:4px 0;color:#2c2419;font-size:14px;text-align:right;">${formatPrice(order.delivery_fee)}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#8a8175;font-size:14px;">Krishik Bazar service charge</td>
      <td style="padding:4px 0;color:#2c2419;font-size:14px;text-align:right;">${formatPrice(order.platform_fee)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0 0;color:#2c2419;font-size:16px;font-weight:bold;border-top:2px solid #e0d0b8;">Total</td>
      <td style="padding:8px 0 0;color:#3d7629;font-size:16px;font-weight:bold;text-align:right;border-top:2px solid #e0d0b8;">${formatPrice(order.total)}</td>
    </tr>
  </table>`;
};

export const deliveryBlock = (address, title = "Delivery address") => {
  if (!address) return "";
  return `
  <div style="background:#faf6f1;border-radius:8px;padding:16px;margin-top:16px;">
    <p style="margin:0 0 8px;font-weight:600;color:#2c2419;font-size:14px;">${title}</p>
    <p style="margin:0;color:#8a8175;font-size:14px;line-height:1.6;">
      ${address.full_name}<br>
      ${address.street}<br>
      ${address.city}, ${address.district}<br>
      Phone: ${address.phone}
      ${address.notes ? `<br>Notes: ${address.notes}` : ""}
    </p>
  </div>`;
};

export const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f7f3eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    ${emailHeader()}
    <tr><td style="padding:24px;">${content}</td></tr>
    <tr>
      <td style="padding:16px 24px;background:#faf6f1;text-align:center;color:#8a8175;font-size:12px;">
        © ${new Date().getFullYear()} Krishik Bazar · support@krishikbazar.com
      </td>
    </tr>
  </table>
</body>
</html>`;

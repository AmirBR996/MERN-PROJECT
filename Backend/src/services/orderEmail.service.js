import krishik_User from "../models/user_models.js";
import { sendBuyerOrderEmail, sendSellerOrderEmail } from "./email.service.js";

export const sendOrderConfirmationEmails = async (order) => {
  try {
    const buyer = await krishik_User.findById(order.buyer_id).select(
      "first_name last_name email"
    );
    if (!buyer) return;

    await sendBuyerOrderEmail(order, buyer);

    const sellerIds = [
      ...new Set(order.items.map((item) => String(item.seller_id))),
    ];

    for (const sellerId of sellerIds) {
      const seller = await krishik_User.findById(sellerId).select(
        "first_name last_name email"
      );
      if (!seller) continue;

      const sellerItems = order.items.filter(
        (item) => String(item.seller_id) === sellerId
      );

      await sendSellerOrderEmail(order, seller, sellerItems);
    }
  } catch (error) {
    console.error("Order email notification failed:", error.message);
  }
};

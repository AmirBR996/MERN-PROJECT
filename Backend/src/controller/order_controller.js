import Order from "../models/order_model.js";
import krishik_Product from "../models/product_model.js";
import { calculateOrderTotals } from "../utils/fees.utils.js";
import { sendOrderConfirmationEmails } from "../services/orderEmail.service.js";

export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place orders" });
    }

    const {
      items,
      delivery_address,
      delivery_fee,
      payment_method,
      payment_status,
      transaction_id,
    } = req.body;

    if (!items?.length || !delivery_address) {
      return res.status(400).json({ message: "Items and delivery address are required" });
    }

    for (const item of items) {
      const product = await krishik_Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const totals = calculateOrderTotals(subtotal, delivery_fee ?? 100);

    const validMethods = ["esewa", "khalti", "cod"];
    const method = validMethods.includes(payment_method) ? payment_method : "khalti";
    const status = payment_status === "paid" ? "paid" : "pending";

    const order = await Order.create({
      buyer_id: req.user.id,
      items,
      delivery_address,
      subtotal: totals.subtotal,
      delivery_fee: totals.delivery_fee,
      platform_fee: totals.platform_fee,
      total: totals.total,
      payment_method: method,
      payment_status: status,
      transaction_id: transaction_id || "",
      status: status === "paid" ? "confirmed" : "pending",
    });

    for (const item of items) {
      await krishik_Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity },
      });
    }

    const populated = await Order.findById(order._id)
      .populate("items.seller_id", "first_name last_name location email")
      .populate("items.product_id", "name image_url");

    sendOrderConfirmationEmails(populated).catch((err) =>
      console.error("Email dispatch error:", err.message)
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer_id: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.seller_id", "first_name last_name location")
      .populate("items.product_id", "name image_url");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.seller_id", "first_name last_name location")
      .populate("items.product_id", "name image_url");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.buyer_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

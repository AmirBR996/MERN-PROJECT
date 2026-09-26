import Order from "../models/order_model.js";
import krishik_Product from "../models/product_model.js";
import { calculateOrderTotals } from "../utils/fees.utils.js";
import { sendOrderConfirmationEmails } from "../services/orderEmail.service.js";
import mongoose from "mongoose";

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

// --- Seller Dashboard Endpoints ---

export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Aggregate total earnings and order count from orders containing seller's products
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.seller_id": new mongoose.Types.ObjectId(sellerId), payment_status: "paid" } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalOrders: { $addToSet: "$_id" },
        },
      },
    ]);

    const totalEarnings = stats[0]?.totalEarnings || 0;
    const totalOrders = stats[0]?.totalOrders?.length || 0;

    // Count active products
    const activeProducts = await krishik_Product.countDocuments({ seller_id: sellerId, stock: { $gt: 0 } });

    // Mock rating as review system is not fully implemented
    const rating = 4.7;

    res.json({
      totalEarnings,
      totalOrders,
      activeProducts,
      rating,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSellerSalesAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const currentYear = new Date().getFullYear();

    const salesData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.seller_id": new mongoose.Types.ObjectId(sellerId),
          payment_status: "paid",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          monthlyTotal: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Ensure all months are present
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = months.map((month, index) => {
      const monthData = salesData.find(d => d._id === index + 1);
      return {
        month,
        amount: monthData ? monthData.monthlyTotal : 0
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Find orders that contain at least one product from this seller
    const orders = await Order.find({ "items.seller_id": sellerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("buyer_id", "first_name last_name")
      .populate("items.product_id", "name image_url");

    // Format the orders to only show the items belonging to this seller
    const formattedOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => String(item.seller_id) === String(sellerId));
      const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(-4).toUpperCase()}`,
        customerName: `${order.buyer_id?.first_name} ${order.buyer_id?.last_name}`,
        date: order.createdAt,
        amount: sellerSubtotal,
        status: order.status,
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

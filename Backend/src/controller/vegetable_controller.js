import VegetablePrice from "../models/vegetable_price_model.js";
import { syncVegetablePrices } from "../services/sync.service.js";

const PAGE_SIZE = 20;

const parseNumber = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const getAllVegetables = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const page = parseNumber(req.query.page, 1);
    const limit = parseNumber(req.query.limit, PAGE_SIZE);

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [items, total] = await Promise.all([
      VegetablePrice.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      VegetablePrice.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Error fetching vegetables:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodayVegetables = async (req, res) => {
  try {
    const latest = await VegetablePrice.findOne().sort({ date: -1 }).lean();

    if (!latest) return res.json([]);

    // Match any entry that falls on the same calendar day as the latest record.
    const dayStart = new Date(latest.date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(latest.date);
    dayEnd.setHours(23, 59, 59, 999);

    const items = await VegetablePrice.find({ date: { $gte: dayStart, $lte: dayEnd } })
      .sort({ name: 1 })
      .lean();

    return res.json(items);
  } catch (error) {
    console.error("Error fetching today vegetables:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVegetableHistory = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const limit = parseNumber(req.query.limit, 30);

    const items = await VegetablePrice.find({ name: { $regex: name, $options: "i" } })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    res.json(items);
  } catch (error) {
    console.error("Error fetching vegetable history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const syncVegetables = async (req, res) => {
  try {
    const result = await syncVegetablePrices();
    res.json({
      message: "Sync completed successfully",
      ...result,
    });
  } catch (error) {
    console.error("Manual sync failed:", error);
    res.status(500).json({ message: "Sync failed", error: error.message });
  }
};

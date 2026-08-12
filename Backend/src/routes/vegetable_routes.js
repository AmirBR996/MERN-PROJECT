import express from "express";
import {
  getAllVegetables,
  getTodayVegetables,
  getVegetableHistory,
  syncVegetables,
} from "../controller/vegetable_controller.js";

const router = express.Router();

router.get("/vegetables", getAllVegetables);
router.get("/vegetables/today", getTodayVegetables);
router.get("/vegetables/:name/history", getVegetableHistory);
router.post("/vegetables/sync", syncVegetables);

export default router;

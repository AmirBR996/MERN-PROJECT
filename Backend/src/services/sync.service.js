import cron from "node-cron";
import VegetablePrice from "../models/vegetable_price_model.js";
import { scrapeVegetablePrices } from "./scraper.service.js";

const SYNC_CRON_SCHEDULE = process.env.VEGETABLE_SYNC_CRON || "0 6 * * *";

export const syncVegetablePrices = async () => {
  try {
    const items = await scrapeVegetablePrices();

    let savedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      try {
        await VegetablePrice.findOneAndUpdate(
          { name: item.name, date: item.date },
          item,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        savedCount++;
      } catch (error) {
        if (error.code === 11000) {
          skippedCount++;
        } else {
          console.error(`[VegetableSync] Failed to save ${item.name}:`, error.message);
        }
      }
    }

    console.log(
      `[VegetableSync] Completed. Saved: ${savedCount}, Skipped (duplicates): ${skippedCount}, Total: ${items.length}`
    );

    return { savedCount, skippedCount, total: items.length };
  } catch (error) {
    console.error("[VegetableSync] Scraper or sync failed:", error.message);
    throw error;
  }
};

export const startVegetableSyncCron = () => {
  cron.schedule(SYNC_CRON_SCHEDULE, async () => {
    console.log("[VegetableSync] Starting scheduled daily sync...");
    try {
      await syncVegetablePrices();
    } catch (error) {
      console.error("[VegetableSync] Scheduled sync failed:", error.message);
    }
  });

  console.log(`[VegetableSync] Cron job scheduled: ${SYNC_CRON_SCHEDULE}`);
};

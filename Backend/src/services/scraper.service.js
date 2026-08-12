import axios from "axios";
import * as cheerio from "cheerio";

const RAMROPATRO_VEGETABLE_URL =
  process.env.RAMROPATRO_VEGETABLE_URL || "https://ramropatro.com/vegetable";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const extractPrice = (value) => {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export const scrapeVegetablePrices = async () => {
  const response = await axios.get(RAMROPATRO_VEGETABLE_URL, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    timeout: 15000,
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const dateText = $("#vtitle")
    .text()
    .trim()
    .replace(/^Collected Daily Wholesale Price\s*-\s*/i, "")
    .replace(/\s*A\.D\.?$/i, "")
    .trim();

  const scrapedDate = new Date(dateText);
  if (Number.isNaN(scrapedDate.getTime())) {
    throw new Error("Unable to parse scraped date from RamroPatro");
  }
  scrapedDate.setHours(12, 0, 0, 0);

  const items = [];
  const seen = new Set();

  $("#commodityDailyPrice tbody tr").each((_, element) => {
    const cells = $(element).find("td");
    if (cells.length < 5) return;

    const name = $(cells[0]).text().trim();
    const unit = $(cells[1]).text().trim();
    const minimum = extractPrice($(cells[2]).text());
    const maximum = extractPrice($(cells[3]).text());
    const average = extractPrice($(cells[4]).text());

    if (!name || minimum === null || maximum === null || average === null) {
      return;
    }

    const key = `${name.toLowerCase()}|${unit.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);

    items.push({
      name,
      unit: unit || "Kg",
      minimum,
      maximum,
      average,
      date: scrapedDate,
      source: "RamroPatro",
    });
  });

  if (items.length === 0) {
    throw new Error("No vegetable price records found in RamroPatro response");
  }

  return items;
};

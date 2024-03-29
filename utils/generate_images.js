import puppeteer from "puppeteer";
import {
  generateYearHTML,
  generateYearsHTML,
  generateMonthHTML,
} from "./generate_html.js";

export const generateYearImage = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    defaultViewport: { width: 1280, height: 1280 },
  });

  const page = await browser.newPage();

  await generateYearHTML();

  await page
    .goto(new URL("../html/index_year.html", import.meta.url).toString())
    .catch((err) => console.log(err));

  await page.screenshot({ path: "year.png" });

  await page.close();
  await browser.close();
};

export const generateYearsImage = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    defaultViewport: { width: 1280, height: 1280 },
  });

  const page = await browser.newPage();

  await generateYearsHTML();

  await page
    .goto(new URL("../html/index_years.html", import.meta.url).toString())
    .catch((err) => console.log(err));

  await page.screenshot({ path: "years.png" });

  await page.close();
  await browser.close();
};

export const generateMonthImage = async (offsetMonth) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    defaultViewport: { width: 1280, height: 1280 },
  });

  const page = await browser.newPage();

  await generateMonthHTML(offsetMonth);

  await page
    .goto(new URL("../html/index_month.html", import.meta.url).toString())
    .catch((err) => console.log(err));

  await page.screenshot({ path: "month.png" });

  await page.close();
  await browser.close();
};

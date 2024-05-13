import { expect } from "@playwright/test";
import { test, BASEPATH } from "./test-config";

test("Expect average price socket to change the values", async ({ browser }) => {
  const page = await browser.newPage();

  await page.goto(BASEPATH + "/dashboard?symbol=BTCUSDT");

  const avgPrice = await page.locator("[test-id='current-average-price']");

  const avgPriceValOne = await avgPrice.innerText();

  // To be replaced with a timeout while loop that checks on each iteration
  await page.waitForTimeout(5000);

  const avgPriceValTwo = await avgPrice.innerText();

  expect(avgPriceValOne).not.toBe(avgPriceValTwo);
});

import { expect } from "@playwright/test";
import { test, BASEPATH } from "./test-config";

test("Expect page to load", async ({ browser }) => {
  const page = await browser.newPage();

  await page.goto(BASEPATH + "/dashboard");

  expect(await page.title()).toBe("Flux");
});

test("Expect searchbar to work", async ({ browser }) => {
  const page = await browser.newPage();

  await page.goto(BASEPATH + "/dashboard?symbol=BNBBTC");

  const symbol = await page.getByText("BNBBTC");
  await symbol.waitFor();

  test.step("Initial symbol loaded", () => {
    expect(symbol).not.toBe(false);
  });

  const searchInput = await page.locator("[data-test='search-input']");
  await searchInput.fill("BNBUSDT");

  await page.keyboard.press("ArrowDown");
  await searchInput.press("Enter");

  const bnbusdt = await page.getByText("BNBUSDT");

  test.step("Assert symbol has changed", () => {
    expect(bnbusdt).not.toBe(false);
  });
});

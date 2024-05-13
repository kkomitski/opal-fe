import { chromium, test as baseTest } from "@playwright/test";

export const BASEPATH = "http://localhost:3000";

// Setup browser fixture before all tests and close browser on test end
export const test = baseTest.extend({
  browser: async ({}, use) => {
    const browser = await chromium.launch();
    await use(browser);
    await browser.close();
  },
});

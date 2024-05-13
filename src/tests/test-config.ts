import fs from "fs";
// import { chromium } from "@playwright/test";
import { chromium, test as baseTest } from "@playwright/test";

import packageJson from "../../package.json" assert { type: "json" };

export const SITES_TO_TEST = [
  {
    name: "cmcmarkets",
    href: "https://www.cmcmarkets.com/en-gb",
  },
  {
    name: "optothemes",
    href: "https://optothemes.com/",
  },
  {
    name: "local",
    href: "https://localhost:3005/",
  },
];

/**
 * Creates a new context with the prod script intercepted
 * and replaced with the local build of the script
 */
export async function newContextWithInterceptedScript(browser) {
  const contextWithInterceptedScript = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  // Intercept all incoming requests to te CDN
  await contextWithInterceptedScript.route(
    // ["https://cdn.cmcmarkets.com/global/scripts/big-script/**/*",],
    "https://*.cmcmarkets.com/global/scripts/big-script/**/*",
    async (route) => {
      const requestURL = route.request().url();

      // Get the filename from the intercepted URL
      const file = requestURL.split("/").pop();

      // Read the local build of the script
      const localBuild = await fs.readFileSync(
        `${process.cwd()}/build/v${packageJson.version}/${file}`,
        "utf8"
      );

      // Fulfill the request with the local build
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: localBuild,
      });
    }
  );

  return contextWithInterceptedScript;
}

// let browser;

// test.beforeAll(async () => {
//   browser = await chromium.launch();
// });

// test.afterAll(async () => {
//   await browser.close();
// });

/**
 * Fixture that launches the browser in the begging of the suite
 * and closes it after all tests are done
 */
const base = baseTest.extend({
  browser: async ({}, use) => {
    const browser = await chromium.launch();
    await use(browser);
    await browser.close();
  },
});

/**
 * Fixture that creates a new context with intercepted script
 * for each test and closes it after the test
 */
export const test = base.extend({
  context: async ({ browser }, use) => {
    const context = await newContextWithInterceptedScript(browser);
    await use(context);
    await context.close();
    console.log("Context closed");
  },
});

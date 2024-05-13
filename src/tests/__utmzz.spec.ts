import { expect } from "@playwright/test";
import { SITES_TO_TEST, test } from "../test-config";

const convertCookieToObj = (cookieVal: string) => {
  const cookie = cookieVal.split("|");

  if (!cookie || !cookie.length || cookie[0] === "") {
    return null;
  }

  const cookieAsObj = {};

  cookie.length &&
    cookie.forEach((element) => {
      const cookieKeyValuePair = element.split("=");
      // @ts-ignore
      cookieAsObj[cookieKeyValuePair[0]] = cookieKeyValuePair[1];
    });

  return cookieAsObj;
};

SITES_TO_TEST.forEach((site) => {
  test(`${site.name} - __utmzz cookie loaded and values correct`, async ({
    context,
    // browser,
  }) => {
    // const context = await browser.newContext();
    // const context = await newContextWithInterceptedScript(browser);
    const page = await context.newPage();

    await page.goto(site.href);

    // await page.waitForTimeout(100000);

    const otBannerButton = await page.locator("#onetrust-accept-btn-handler");
    await otBannerButton.waitFor();

    await page.click("#onetrust-accept-btn-handler");

    let __utmzz;
    while (!__utmzz) {
      const cookies = await context.cookies();
      __utmzz = cookies.find((c) => c.name === "__utmzz");
      if (!__utmzz) {
        await page.waitForTimeout(500); // wait for 1 second before checking again
      }
    }

    test.step("__utmzz cookie loaded", () => {
      expect(__utmzz).not.toBe(false);
    });

    test.step("__utmzz cookie values", () => {
      // @ts-ignore
      const __utmzzObject: {
        cp1: string;
        utmcsr: string;
        utmccn: string;
        utmcmd: string;
        mdevid: string;
        MPID?: string;
        utmzz_session_id?: string;
      } = convertCookieToObj(__utmzz.value);

      // Checking CP1
      expect(typeof __utmzzObject.cp1).toBe("string");

      // Checking UTMCSR
      expect(typeof __utmzzObject.utmcsr).toBe("string");

      // Checking UTMCCN
      expect(typeof __utmzzObject.utmccn).toBe("string");

      // Checking UTMCMD
      expect(typeof __utmzzObject.utmcmd).toBe("string");

      // Checking MDEVID
      expect(typeof __utmzzObject.mdevid).toBe("string");

      // Checking MPID
      expect(typeof __utmzzObject.MPID).toBe("string"); // TODO: Add back in

      // Checking utmzz_session_id
      expect(typeof __utmzzObject.utmzz_session_id).toBe("string"); // TODO: add back in
    });
  });
});

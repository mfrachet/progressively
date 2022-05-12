import { test } from "./helpers/hooks";

const userCount = 2;

test(userCount, "chromium", async (browserChain) => {
  await browserChain.openForAll("https://google.com");
  await browserChain.run(async (page) => {
    await page.click(`button:has-text("I agree")`);
  });
});

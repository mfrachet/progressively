import { test } from "./helpers/hooks";

const userCount = 2;

test(
  "percentage based rollout",
  userCount,
  "chromium",
  async (browserChain) => {
    await browserChain.openForAll("http://localhost:3000");
    await browserChain.run(async (page, index) => {
      await await page.$$(`text='User ${index}'`);
    });
  }
);

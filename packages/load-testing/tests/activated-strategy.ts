import { test, TestConfig } from "./helpers/hooks";

const config: TestConfig = {
  userCount: 2,
  type: "chromium",
};

test("percentage based rollout", config, async (browserChain) => {
  await browserChain.openForAll("http://localhost:3000");
  await browserChain.run(async (page, index) => {
    await await page.$$(`text='User ${index}'`);
  });
});

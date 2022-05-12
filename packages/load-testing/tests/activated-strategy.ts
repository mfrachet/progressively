import { test, TestConfig } from "./helpers/hooks";

const config: TestConfig = {
  userCount: 2,
  type: "chromium",
};

test("percentage based rollout", config, async (browsers) => {
  await browsers.open("http://localhost:3000");
  await browsers.run(async (page, index) => {
    await page.$$(`text='User ${index}'`);
    await page.$$(`text='New variant'`);
  });
});

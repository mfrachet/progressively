import { createCounter, expect } from "./helpers/assertions";
import { LocalBrowserType } from "./helpers/BrowserChain";
import { changeFlagStatus } from "./helpers/changeFlagStatus";
import { test, TestConfig } from "./helpers/hooks";

const userCount = process.env.USER_COUNT;
const browserType = process.env.BROWSER_TYPE as LocalBrowserType;

const config: TestConfig = {
  userCount: userCount ? Number(userCount) : 10,
  type: browserType || "chromium",
};

// test(
//   "[Boolean activation]: everybody receives the same variations at load and update time",
//   config,
//   async (browsers) => {
//     await browsers.open("http://localhost:3000");

//     await browsers.run(async (page, index) => {
//       await expect(page).toHaveText(`User ${index}`);
//       await expect(page).toHaveText(`New variant`);
//     });

//     await changeFlagStatus("1", "1", "NOT_ACTIVATED");

//     await browsers.run(async (page, index) => {
//       await expect(page).toHaveText(`User ${index}`);
//       await expect(page).toHaveText(`Old variant`);
//     });
//   }
// );

test(
  "[Percentage activation]: 25% of the people should receive the activated variant when activating it",
  config,
  async (browsers) => {
    await browsers.open("http://localhost:3000");

    await browsers.run(async (page, index) => {
      await expect(page).toHaveText(`User ${index}`);
      await expect(page).toHaveText(`Old footer variant`);
    });

    await changeFlagStatus("1", "2", "ACTIVATED");

    // Checking numbers
    const activatedCounter = createCounter(
      "New footer variant",
      config.userCount
    );

    const notActivatedCounter = createCounter(
      "Old footer variant",
      config.userCount
    );

    await browsers.run(async (page, index) => {
      await activatedCounter.increaseWhenVisible(page);
      await notActivatedCounter.increaseWhenVisible(page);
    });

    await activatedCounter.verifyRange(15, 20);
    await notActivatedCounter.verifyRange(80, 100);
  }
);

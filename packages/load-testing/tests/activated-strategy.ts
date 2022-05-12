import { changeFlagStatus } from "./helpers/changeFlagStatus";
import { expect, test, TestConfig } from "./helpers/hooks";

const config: TestConfig = {
  userCount: 2,
  type: "chromium",
};

test("percentage based rollout", config, async (browsers) => {
  await browsers.open("http://localhost:3000");
  await browsers.run(async (page, index) => {
    await expect(page).toHaveText(`User ${index}`);
    await expect(page).toHaveText(`New variant`);
  });

  await changeFlagStatus("1", "1", "NOT_ACTIVATED");

  await browsers.run(async (page, index) => {
    await expect(page).toHaveText(`User ${index}`);
    await expect(page).toHaveText(`Old variant`);
  });
});

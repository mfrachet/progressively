import { test } from "./helpers/hooks";

const userCount = 2;

test(userCount, "chromium", async (browserChain) => {
  await browserChain.openForAll("https://google.com");
});

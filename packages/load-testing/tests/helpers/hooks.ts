import { BrowserChain, LocalBrowserType } from "./BrowserChain";
import { seedDb, cleanupDb } from "../../src/seed";

export const test = async (
  userCount: number,
  type: LocalBrowserType,
  fn: (browserChain: BrowserChain) => Promise<unknown>
) => {
  await seedDb(userCount);

  try {
    const browserChain = await BrowserChain.create(userCount, type);
    await fn(browserChain);
    await browserChain.closeAll();
  } catch (error) {
    console.info("╳ Test failed");
    console.error(error);
  }

  await cleanupDb();
  console.info("✓ Test succeeded");
};

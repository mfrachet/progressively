import { BrowserChain, LocalBrowserType } from "./BrowserChain";
import { seedDb, cleanupDb } from "../../src/seed";

export const test = async (
  name: string,
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
    console.error(`╳ FAILED: ${name}\n`, error);
  }

  await cleanupDb();
  console.info(`✓ ${name}`);
};

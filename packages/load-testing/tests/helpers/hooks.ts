import { BrowserChain, LocalBrowserType } from "./BrowserChain";
import { seedDb, cleanupDb } from "../../src/seed";

export const test = async (
  userCount: number,
  type: LocalBrowserType,
  fn: (browserChain: BrowserChain) => Promise<unknown>
) => {
  await seedDb(userCount);
  console.log("Seeding finished\n-----------------------");

  const browserChain = await BrowserChain.create(userCount, type);
  await fn(browserChain);
  await browserChain.closeAll();

  await cleanupDb();
  console.log("-----------------------\nCleanup finished");
};

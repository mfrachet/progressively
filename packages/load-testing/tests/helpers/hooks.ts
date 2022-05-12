import { BrowserChain, LocalBrowserType } from "./BrowserChain";
import { seedDb, cleanupDb } from "../../src/seed";

export interface TestConfig {
  userCount: number;
  type: LocalBrowserType;
}

export const test = async (
  name: string,
  config: TestConfig,
  fn: (browserChain: BrowserChain) => Promise<unknown>
) => {
  await seedDb(config.userCount);

  try {
    const browserChain = await BrowserChain.create(
      config.userCount,
      config.type
    );

    await fn(browserChain);
    await browserChain.closeAll();
  } catch (error) {
    console.error(`╳ FAILED: ${name}\n`, error);
  }

  await cleanupDb();
  console.info(`✓ ${name}`);
};

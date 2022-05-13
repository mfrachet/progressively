import chalk from "chalk";
import { BrowserChain, LocalBrowserType } from "./BrowserChain";

export interface TestConfig {
  userCount: number;
  type: LocalBrowserType;
}

export const test =
  (
    name: string,
    config: TestConfig,
    fn: (browserChain: BrowserChain) => Promise<unknown>
  ) =>
  async () => {
    try {
      const browserChain = await BrowserChain.create(
        config.userCount,
        config.type
      );

      await fn(browserChain);
      await browserChain.closeAll();
      console.info(chalk.green(`✓ ${name}`));
    } catch (error) {
      console.error(chalk.red(`FAILED: ${name}\n`));
      throw error;
    }
  };

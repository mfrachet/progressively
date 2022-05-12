import { seedDb, cleanupDb } from "../src/seed";
import {
  Browser,
  BrowserType,
  chromium,
  firefox,
  Page,
  webkit,
} from "playwright";

const userCount = 10;
const browserConfig = { headless: false };

type LocalBrowserType = "chromium" | "firefox" | "webkit";

class LocalBrowser {
  private page?: Page;

  constructor(private browser: Browser) {
    this.page = undefined;
  }

  public async open(url: string) {
    this.page = await this.browser.newPage();
    await this.page.goto(url);
  }

  public async close() {
    await this.browser.close();
  }
}

class BrowserChain {
  constructor(private browsers: Array<LocalBrowser>) {}

  static async create(
    browserCount: number,
    type: LocalBrowserType = "chromium"
  ) {
    let browserType: BrowserType<{}>;

    switch (type) {
      case "chromium":
        browserType = chromium;
        break;

      case "firefox":
        browserType = firefox;
        break;

      default:
      case "webkit":
        browserType = webkit;
        break;
    }

    const browserPromises = [];

    for (let i = 0; i < browserCount; i++) {
      browserPromises.push(browserType.launch(browserConfig));
    }

    const browsers: Array<Browser> = await Promise.all(browserPromises);
    const localBrowsers = browsers.map((b) => new LocalBrowser(b));

    return new BrowserChain(localBrowsers);
  }

  public async openForAll(url: string) {
    const browserPromises = this.browsers.map((browser) => browser.open(url));

    await Promise.all(browserPromises);
  }

  public async closeAll() {
    const browserPromises = this.browsers.map((browser) => browser.close());

    await Promise.all(browserPromises);
  }
}

async function beforeRun() {
  await seedDb(userCount);
  console.log("Seeding finished\n-----------------------");
}

async function afterRun() {
  await cleanupDb();
  console.log("-----------------------\nCleanup finished");
}

async function run() {
  await beforeRun();

  const browserChain = await BrowserChain.create(userCount, "chromium");
  await browserChain.openForAll("https://google.com");
  await browserChain.closeAll();

  await afterRun();
}

run();

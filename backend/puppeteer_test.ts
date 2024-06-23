import puppeteer, { Browser, Page } from 'puppeteer'; // or import puppeteer from 'puppeteer-core';
import { getClickables, getInputs, getOuterHTML } from './utils';

// chrome path: /Users/adityapawar_1/.cache/puppeteer/chrome/mac_arm-126.0.6478.55/chrome-mac-arm64/Google\ Chrome\ for\ Testing.app/Contents/MacOS/Google\ Chrome\ for\ Testing
const main = async () => {
  const browserURL = 'http://127.0.0.1:21222';

  let browser: Browser;
  try {
    browser = await puppeteer.connect({ browserURL })
    console.log("Connected to existing browser.");
  } catch (err) {
    console.log(err);
    console.log("Can't connect to existing browser, creating a new one.");
    browser = await puppeteer.launch({ headless: false });
  }
  const pages = await browser.pages();
  let page: Page;
  if (pages.length == 0) {
    page = await browser.newPage();
  } else {
    page = pages[0];
  }

  //await page.goto('https://developer.chrome.com/');
  //await page.setViewport({ width: 1080, height: 1024 });

  console.log(JSON.stringify(await getClickables(page)))
  console.log(JSON.stringify(await getInputs(page)))

  await browser.disconnect();
}

main()



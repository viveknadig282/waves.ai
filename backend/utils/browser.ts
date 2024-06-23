import { Browser, Page } from "puppeteer";

export async function getActivePage(browser: Browser, timeout = 200) {
  let start = new Date().getTime();
  let pages: Page[] = []

  while (new Date().getTime() - start < timeout) {
    pages = await browser.pages();
    let active = [];

    for (const p of pages) {
      if (await p.evaluate(() => { return document.visibilityState == 'visible' })) {
        active.push(p);
      }
    }

    if (active.length == 1) {
      console.log(active[0].url());
      return active[0];
    }
  }
  return pages[pages.length - 1];
}

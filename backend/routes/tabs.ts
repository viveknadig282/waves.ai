import { browser } from "../server";
import { getActivePage } from "../utils/browser";

const defaultUrl = "https://www.google.com/"

export default async function routes(fastify, options) {
  fastify.post('/tab/new', async (request, reply) => {
    const page = await browser.newPage();

    if (request.body['url']) {
      const url = request.body.url;
      await page.goto(url);
    } else {
      await page.goto(defaultUrl);
    }
  })

  fastify.get('/tab/urls', async (request, reply) => {
    const pages = await browser.pages();
    const urls = pages.map(page => page.url());
    return urls;
  })

  fastify.post('/tab/close/current', async (request, reply) => {
    const page = await getActivePage(browser);
    page.close();
  })

  fastify.post('/tab/close', async (request, reply) => {
    const id = request.body.id;
    const pages = await browser.pages();
    pages[id].close();
  })

  fastify.post('/tab/focus', async (request, reply) => {
    const id = request.body.id;
    const pages = await browser.pages();
    pages[id].bringToFront();
  })

}

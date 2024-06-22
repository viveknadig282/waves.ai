import { getClickables, getNthClickable } from "../utils/html";
import { browser } from "../server";
import { getActivePage } from "../utils/browser";

export default async function routes(fastify, options) {
  fastify.get('/click', async (request, reply) => {
    const page = await getActivePage(browser);
    return getClickables(page);
  })

  fastify.post('/click/selector', async (request, reply) => {
    const selector: string = request.body.selector;
    const page = await getActivePage(browser);
    page.click(selector);
  })

  fastify.post('/click/index', async (request, reply) => {
    const n: number = request.body.n;

    const page = await getActivePage(browser);
    const element = await getNthClickable(page, n);
    element.click();
  })
}

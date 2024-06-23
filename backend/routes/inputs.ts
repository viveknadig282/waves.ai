import { browser } from "../server";
import { getActivePage } from "../utils/browser";
import { getInputs, getNthInput } from "../utils/html";

export default async function routes(fastify, options) {
  fastify.get('/input/all', async (request, reply) => {
    const page = await getActivePage(browser);
    return getInputs(page);
  })

  fastify.post('/input/selector', async (request, reply) => {
    const selector: string = request.body.selector;
    const text: string = request.body.text;

    const page = await getActivePage(browser);
    page.type(selector, text);
  })

  fastify.post('/input/index', async (request, reply) => {
    const n: number = request.body.n;
    const text: string = request.body.text;
    console.log(n);
    console.log(typeof n);

    const page = await getActivePage(browser);

    const element = await getNthInput(page, n);
    element.type(text);
  })
}

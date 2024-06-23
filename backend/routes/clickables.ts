import { stringSimilarity } from "string-similarity-js";
import { getClickables, getNthClickable } from "../utils/html";
import { browser } from "../server";
import { getActivePage } from "../utils/browser";

export default async function routes(fastify, options) {
  fastify.get('/click/all', async (request, reply) => {
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

    await element.evaluate(b => b.click());
  })

  fastify.post('/click/context', async (request, reply) => {
    const element: string = request.body.element;
    const page = await getActivePage(browser);
    const clickables = await getClickables(page);

    let bestIndex = 0;
    let bestSimilarity = 0;

    for (let i = 0; i < clickables.length; i++) {
      const clickable = clickables[i];

      if (clickable == element) {
        console.log("FOUND MATCH");
        const element = await getNthClickable(page, i);
        const json = await element.jsonValue()
        console.log(json);
        await element.evaluate(b => b.click());
        return;
      }

      let similarity = stringSimilarity(element, clickable);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestIndex = i;
      }
    }

    if (bestSimilarity > 0.9) {
      console.log("COMPROMISING");

      const element = await getNthClickable(page, bestIndex);
      await element.evaluate(b => b.click());
    }
  })
}

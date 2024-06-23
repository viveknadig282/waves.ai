import stringSimilarity from "string-similarity-js";
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
    const page = await getActivePage(browser);

    const element = await getNthInput(page, n);
    element.type(text);
  })

  fastify.post('/input/context', async (request, reply) => {
    const element: string = request.body.element;
    const text: string = request.body.text;

    const page = await getActivePage(browser);
    const inputs = await getInputs(page);

    let bestIndex = 0;
    let bestSimilarity = 0;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      if (input == element) {
        const element = await getNthInput(page, i);
        element.type(text)
        return;
      }

      let similarity = stringSimilarity(element, input);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestIndex = i;
      }
    }

    if (bestSimilarity > 0.9) {
      const element = await getNthInput(page, bestIndex);
      element.type(text)
    }
  })

}

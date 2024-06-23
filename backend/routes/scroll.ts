import { FastifyInstance, FastifyPlugin, RequestBodyDefault } from "fastify";
import { browser } from "../server";
import { getActivePage } from "../utils/browser";
import { ReplyDefault } from "fastify/types/utils";
import { FastifyReplyType } from "fastify/types/type-provider";

export default async function routes(fastify, options) {
  fastify.post('/scroll', async (request, reply: FastifyReplyType) => {
    const pixels = request.body.pixels;
    const page = await getActivePage(browser);
    await page.evaluate((pixels) => {
      const currentHeight = window.scrollY;
      window.scrollTo({ top: currentHeight + pixels, behavior: 'smooth' });
    }, pixels);
  })

  fastify.post('/scroll/to', async (request, reply) => {
    const selector = request.body.selector;
    const page = await getActivePage(browser);
    const element = await page.$(selector)
    if (element) {
      await element.scrollIntoView()
    }
  })

  fastify.post('/scroll/top', async (request: any, reply) => {
    const page = await getActivePage(browser);
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })

  fastify.post('/scroll/bottom', async (request, reply) => {
    const page = await getActivePage(browser);
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  })
}

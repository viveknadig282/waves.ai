import Fastify from 'fastify'
import puppeteer, { Browser, Page } from 'puppeteer'; // or import puppeteer from 'puppeteer-core';

import tabs from './routes/tabs'
import inputs from './routes/inputs'
import clickables from './routes/clickables'
import scroll from './routes/scroll'

// const browserURL = 'http://127.0.0.1:21222';
const browserURL = "ws://127.0.0.1:21222/devtools/browser/ff5208dc-1090-4e99-862a-cdcfc15c06f8"
export let browser: Browser;
const fastify = Fastify({
  logger: true
})

fastify.register(tabs);
fastify.register(inputs);
fastify.register(clickables);
fastify.register(scroll);

const main = async () => {
  try {
    browser = await puppeteer.connect({ browserWSEndpoint: browserURL })
    console.log("Connected to existing browser.");
  } catch (err) {
    //console.log(err);
    console.log("Can't connect to existing browser, creating a new one.");
    browser = await puppeteer.launch({ headless: false });
  }

  fastify.listen({ port: 3000 }, async function(err, address) {
    if (err) {
      fastify.log.error(err)
      await browser.disconnect();
      process.exit(1)
    }
  })
}

main();

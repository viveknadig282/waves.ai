import { ElementHandle } from "puppeteer";

export const getOuterHTML = async (elements: ElementHandle<HTMLLabelElement | HTMLInputElement>[]): Promise<string[]> => {
  const elementProperties = await Promise.all(elements.map(input => input.getProperty("outerHTML")));
  return Promise.all(elementProperties.map(i => i.jsonValue()));
}

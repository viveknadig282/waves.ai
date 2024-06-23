import { ElementHandle, Page } from "puppeteer";

const inputsSelector = "textarea, input:not([type=hidden])"
const clickableSelector = "button, label"
const linkSelector = "a"

export const getInputs = async (page: Page) => {
  const inputs = await page.$$(inputsSelector);
  return await getOuterHTML(inputs);
}

export const getNthInput = async (page: Page, n: number) => {
  const inputs = await page.$$(inputsSelector);
  return inputs[n];
}

export const getClickables = async (page: Page) => {
  const buttons = await page.$$(clickableSelector);
  const buttonOuterHTML = await getOuterHTML(buttons);

  const links = await page.$$(linkSelector);
  const linkText = await getText(links);
  const linkHtml = linkText.map(link => `<a>${link}</a>`)

  return buttonOuterHTML.concat(linkHtml);
}

export const getNthClickable = async (page: Page, n: number) => {
  let i = 0
  const buttons = await page.$$(clickableSelector);

  for (const button of buttons) {
    if (i == n) {
      return button;
    }
    i++;
  }

  const links = await page.$$(linkSelector);
  for (const link of links) {
    if (i == n) {
      return link;
    }
    i++;
  }
}

const getOuterHTML = async (elements: ElementHandle<HTMLElement>[]): Promise<string[]> => {
  const elementProperties = await Promise.all(elements.map(input => input.getProperty("outerHTML")));
  return Promise.all(elementProperties.map(async i => cleanHTML(await i.jsonValue())));
}

const getText = async (elements: ElementHandle<HTMLElement>[]): Promise<(string)[]> => {
  const elementProperties = await Promise.all(elements.map(input => input.getProperty("textContent")));
  return Promise.all(elementProperties.map(async i => cleanHTML(await i.jsonValue())));
}

const cleanHTML = (element: string | null): string => {
  const whitespace = /(?:\s)(\s+)/
  if (element) {
    return element.replace(whitespace, "");
  } else {
    return ""
  }
}

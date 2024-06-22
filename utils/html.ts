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
  console.log(inputs);
  return inputs[n];
}

export const getClickables = async (page: Page) => {
  const buttons = await page.$$(clickableSelector);
  const buttonOuterHTML = await getOuterHTML(buttons);

  const linkSelector = "a"
  const links = await page.$$(linkSelector);
  const linkText = await getText(links);
  const linkHtml = linkText.map(link => `<a>${link}</a>`)

  return buttonOuterHTML.concat(linkHtml);
}

export const getNthClickable = async (page: Page, n: number) => {
  const buttons = await page.$$(clickableSelector);
  console.log(buttons);
  if (n < buttons.length) {
    return buttons[n];
  }

  const links = await page.$$(linkSelector);
  console.log(links);
  return links[n - buttons.length];
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

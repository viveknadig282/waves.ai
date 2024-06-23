import { log } from "console";

export async function get(url: string, body: string) {
  console.log(`Getting ${url} with body ${body}`);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      //body: body,
    });

    const data: unknown = await response.json();
    console.log(`Getting ${url} with body ${body}, response ${data}`);
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function post(url: string, body: string) {
  console.log(`Posting ${url} with body ${body}`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: (body),
    });
    const data: unknown = await response.json();
    console.log(`Posting ${url} with body ${body}, response ${JSON.stringify(data)}`);

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export function print(string: string) {
  console.log(string);
}

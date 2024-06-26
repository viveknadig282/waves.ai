import type { PlasmoMessaging } from "@plasmohq/messaging"
import { log } from "console";
import { getRequest } from "~background/puppeteer";
import { get, post } from "~background/route";

// open a websocket to langserver cloud
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const transcript = req.body.transcript;
  if (!transcript) {
    return;
  }
  const body = JSON.stringify({ prompt: transcript })

  const response = await post('http://ec2-3-143-137-102.us-east-2.compute.amazonaws.com/no_context', body);
  let data = await response.json();
  data = data.data[0];

  if (data.name == "RandomNoise") {
    return;
  }

  if (data.name == "NeedsContext") {
    const puppeteerReq = getRequest(data.name, data); // route, method, type
    const url = `http://localhost:3000${puppeteerReq.url}`;
    console.log(JSON.stringify(puppeteerReq));

    let action: string;
    if (data.needs_clickables_context) {
      action = "click"
    } else if (data.needs_inputs_context) {
      action = "type"
    } else {
      action = "tab"
    }

    const res = await get(url, "")
    const context = await res.json()
    const body = JSON.stringify({
      prompt: transcript,
      ctx: context.data.join(",").replace("\"", "\'"),
      action: action
    })
    const r = await post('http://ec2-3-143-137-102.us-east-2.compute.amazonaws.com/context', body);

    data = await r.json();
    data = data.data[0];

    if (data.name == "RandomNoise") {
      return;
    }
  }


  const puppeteerReq = getRequest(data.name, data); // url, type, and body of the request
  const puppeteerParam = JSON.stringify(puppeteerReq.body);
  const url = `http://localhost:3000${puppeteerReq.url}`;
  console.log(puppeteerReq.type);

  if (puppeteerReq.type == "POST") {
    post(url, puppeteerParam);
    return;
  } else {
    get(url, puppeteerParam);
    return
  }
}

export default handler

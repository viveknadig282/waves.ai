import type { PlasmoMessaging } from "@plasmohq/messaging"
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

  if (data.name == "NeedsContext" || data.name == "RandomNoise") {
    return;
  }
  
  const puppeteerReq = getRequest(data.name, data); // url, type, and body of the request
  const puppeteerParam = JSON.stringify(puppeteerReq.body);
  const url = `http://localhost:3000${puppeteerReq.url}`;

  if (puppeteerReq.type == "POST") {
      post(url, puppeteerParam);
  } else {
      get(url, puppeteerParam);
  }
 
  res.send({
    response
  })
}
 
export default handler
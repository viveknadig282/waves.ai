import type { PlasmoMessaging } from "@plasmohq/messaging"
import { post } from "~background/route";
 
// open a websocket to langserver cloud
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const transcript = req.body.transcript;
  if (!transcript) {
    return;
  }

  const response = await post('', transcript);

  // handle response and send it to puppeteer

  res.send({
    response
  })
}
 
export default handler
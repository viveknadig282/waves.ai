import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  console.log("request: ", req)
  
  //TODO: send a post request with transcript to puppeteer

  res.send({
    message: "success"
  })
}
 
export default handler
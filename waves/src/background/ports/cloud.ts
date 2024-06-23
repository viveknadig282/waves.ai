import type { PlasmoMessaging } from "@plasmohq/messaging"
 
// open a websocket to langserver cloud
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  console.log("request: ", req)

  res.send({
    message: "success"
  })
}
 
export default handler
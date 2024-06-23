import type { PlasmoMessaging } from "@plasmohq/messaging"
import { get, post } from "~background/route";
import { ACTIONS, PUPPETEER_ROUTES} from "~constants";

const getChildRoute = (action: string, variables: Record<any, any>, input: any) => {
    const a = input[0]["args"]!; // args

    switch (action) {
        case "ClickElementAction":
            if (a.element_from_context) {
                return "/all";
            }
        case "TypeTextAction":
            if (a.element_from_context) {
                return "/all";
            }        
        case "ScrollAction":
            if (a.top) {
                return "/top";
            } else if (a.bottom) {
                return "/bottom";
            } else if (a.relative) {
                variables["pixels"] = a.pixels;
                return "/";
            }
            break;
        case "TabAction":
            if (a.close_an_existing_tab) {
                return "/close/current";
            } else if (a.create_new_tab) {
                variables["new_tab_url"] = a.new_tab_url;
                return "/new";
            } else if (a.focus_an_existing_tab) {
                return "/focus";
            }
            break;
        default:
            return null;
    }
}

const getRequest = (action: string, input: any) => {
    const parent: string = ACTIONS[action]; // parent route
    let variables = {};

    const child: string = getChildRoute(action, variables, input);

    return {
        url: parent + child, // concatenate parent route and child route strings
        type: PUPPETEER_ROUTES[parent][child],
        body: variables
    }
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const request = getRequest(req.name, req); // url, type, and body of the request
    const body = JSON.stringify(request.body);
    if (request.type == "POST") {
        post(request.url, body)
    } else {
        get(request.url, body)
    }
}
 
export default handler
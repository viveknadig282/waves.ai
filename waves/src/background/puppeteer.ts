import { ACTIONS, PUPPETEER_ROUTES} from "~constants";

const getChildRoute = (action: string, variables: Record<any, any>, input: any) => {
    const a = input.args; // args

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
                variables["url"] = a.new_tab_url;
                return "/new";
            } else if (a.focus_an_existing_tab) {
                return "/focus";
            }
            break;
        default:
            return null;
    }
}

export const getRequest = (action: string, input: any) => {
    const parent: string = ACTIONS[action]; // parent route
    let variables = {};

    const child: string = getChildRoute(action, variables, input);

    return {
        url: parent + child, // concatenate parent route and child route strings
        type: PUPPETEER_ROUTES[parent][child],
        body: variables
    }
}
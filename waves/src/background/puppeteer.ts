import { ACTIONS, PUPPETEER_ROUTES } from "~constants";

const getChildRoute = (action: string, input: any) => {
  const a = input.args; // args
  let variables = {}

  switch (action) {
    case "NeedsContext":
      if (a.needs_clickables_context) {
        return { route: "/click/all", method: "GET", variables };
      } else if (a.needs_input_context) {
        return { route: "/input/all", method: "GET", variables };
      } else {
        return { route: "/tab/urls", method: "GET", variables };
      }
    case "ClickElementAction":
      variables["element"] = a.element_from_context
      return { route: "/tab/context", method: "POST", variables };
    case "TypeTextAction":
      variables["element"] = a.element_from_context
      return { route: "/input/context", method: "POST", variables };
    case "ScrollAction":
      if (a.top) {
        return { route: "/scroll/top", method: "POST", variables };
      } else if (a.bottom) {
        return { route: "/scroll/bottom", method: "POST", variables };
      } else if (a.relative) {
        variables["pixels"] = a.pixels;
        return { route: "/scroll", method: "POST", variables };
      }
      break;
    case "TabAction":
      if (a.close_an_existing_tab) {
        return { route: "/tab/close/current", method: "POST", variables };
      } else if (a.create_new_tab) {
        variables["url"] = a.new_tab_url;
        return { route: "/tab/new", method: "POST", variables };
      } else if (a.focus_an_existing_tab) {
        variables["tabId"] = a.tab_index
        return { route: "/tab/focus", method: "POST", variables };
      }
      break;
    default:
      return null;
  }
}

export const getRequest = (action: string, input: any) => {
  const { route, method, variables } = getChildRoute(action, input);

  return {
    url: route, // concatenate parent route and child route strings
    type: method,
    body: variables
  }
}

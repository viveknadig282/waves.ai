type Actions = Record<string, string>
type PuppeteerRoutes = Record<string, Record<string, string>>

export const ACTIONS: Actions = {
    "ClickElementAction" : "/click",
    "TypeTextAction" : "/input",
    "ScrollAction" : "/scroll",
    "TabAction" : "/tab",
}

export const PUPPETEER_ROUTES: PuppeteerRoutes = {
    "/click" : {
        "/all": "GET",
        "/selector": "POST",
        "/index": "POST"
    },
    "/input" : {
        "/": "GET",
        "/selector": "POST",
        "/index": "POST"
    },
    "/scroll" : {
        "/": "POST",
        "/top": "POST",
        "/top/current": "POST",
        "/bottom": "POST"
    },
    "/tab" : {
        "/new": "POST",
        "/focus": "POST",
        "/urls": "GET",
        "/close": "GET"
    },
}
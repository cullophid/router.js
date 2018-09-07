import {Action} from "history"
import createBrowserHistory from "history/createBrowserHistory"

const history = createBrowserHistory()
const routes:Route[] = []

type LocationUpdate = {
    action: Action,
    hash: string;
    state:any,
    pathname: string;
    search: string;
    query: {
      [key:string]: string;
    };
    params: {
      [key: string]:string;
    };
    key?: string;
}

type Resolver = (location:LocationUpdate) => void
type Route = [string[], Resolver]

let isVar = (s:string) => s.indexOf(":") == 0;
const matchRoute = (selector:string[], location:LocationUpdate) => {
  let path = location.pathname.split("/")
  let params = {}
  for (let i in selector) {
    // vars gets added to params
    if (selector[i] === "*") {
      return {...location, params}
    } else if (isVar(selector[i])) {
      params[selector[i].slice(1)] = path[i]
    } else if (selector[i] !== path[i]) { // non vars must match the selector
      return null
    }
  }
  return {...location, params}
}


const resolve = (location:LocationUpdate) => {
  for (let [selector, handler] of routes) {
    let loc = matchRoute(selector, location);
    if (loc !== null) {
      return handler(loc)
    }
  }
}

const parseQuery = (query:string) => 
  query.split("?")
    .map(param => param.split("=").map(decodeURIComponent))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {})

history.listen((location, action) => {
  let locationUpdate:LocationUpdate = {
    ...location,
    action: action,
    query: parseQuery(location.search),
    params: {}
  }
  resolve(locationUpdate)
})

export const push = history.push

export const replace = history.replace

export const on = (path:string, resolver: (location:LocationUpdate) => void) => {
  routes.push([path.split("/"), resolver])
}
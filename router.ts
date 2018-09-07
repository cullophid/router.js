import {Action, History, Location} from "history"
import createBrowserHistory from "history/createBrowserHistory"
import createMemoryHistory from "history/createMemoryHistory"
import createHashHistory from "history/createHashHistory"

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
  if (selector.length > path.length) return null // ensure we match the full url

  return {...location, params}
}

const parseQuery = (query:string) => 
  query.split("?")
    .map(param => param.split("=").map(decodeURIComponent))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {})

  const resolve = (routes: Route[], locationUpdate:LocationUpdate) => {
    for (let [selector, handler] of routes) {
      let loc = matchRoute(selector, locationUpdate);
      if (loc !== null) {
        return handler(loc)
      }
    }
  }

type Config = {
  type?: "Hash" | "Memory" | "Browser"
  basename?:string
}

class Router {
  routes:Route[]
  history:History
  constructor(config:Config) {
    switch (config.type) {
      case "Hash":
        this.history = createHashHistory()
        break;
      case "Memory":
        this.history = createMemoryHistory()
        break;
      default:
        this.history = createBrowserHistory()
        break;
    }
    this.routes = []
    this.history.listen((location:Location, action:Action) => {
      let locationUpdate:LocationUpdate = {
        ...location,
        action: action,
        query: parseQuery(location.search),
        params: {}
      }
      resolve(this.routes, locationUpdate)
    })
  }
  add(selector:string, resolver:Resolver) {
    this.routes.push([selector.split("/"), resolver])
    return this
  }
  push(url:string| Location<any>) {
    this.history.push(url)
  }
  replace(url:string | Location<any>) {
    this.history.replace(url)
  }
  go(n:number) {
    this.history.go(n)
  }
  goForward() {
    this.history.goForward()
  }
  goBack(n:number) {
    this.history.goBack(n)
  }
}

export default (config:Config) => new Router(config)




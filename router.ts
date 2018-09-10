

export type Params = {[key:string]: string}
export type Query = {[key:string]: string}
export type Route<T> = {route: string, handler: (params:Params, query:Query) => T}

let isVar = (s:string) => s.indexOf(":") == 0;
const matchRoute = (route:string, location:Location) => {
  let locationPath = location.pathname.split("/")
  let params:Params = {}
  let routePath = route.split("/")
  for (let i in routePath) {
    // vars gets added to params
    if (routePath[i] === "*") {
      return params
    } else if (isVar(routePath[i])) {
      params[routePath[i].slice(1)] = locationPath[i]
    } else if (routePath[i] !== locationPath[i]) { // non vars must match the selector
      return null
    }
  }
  if (routePath.length > locationPath.length) return null // ensure we match the full url

  return params
}

export const parseQueryString = (query:string):Query => 
  query === "" ? {} : 
  query
    .slice(1)
    .split("&")
    .map(param => param.split("=").map(decodeURIComponent))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {})


export const match = <T>(location:Location, routes:Route<T>[]) => {
    for (let {route, handler} of routes) {
      let params = matchRoute(route, location);
      if (params !== null) {
        return handler(params, parseQueryString(location.search))
      }
    }
 }
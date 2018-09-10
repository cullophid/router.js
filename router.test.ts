import * as Router from "./router"
const location:Location = {
  host:"",
  hostname:"",
  pathname:"/",
  hash:"",
  search:"",
  href:"",
  origin: "",
  port:"",
  protocol:"",
  assign: a => a,
  reload: a => a,
  replace: a => a
}

test("parseQueryString should return an object with key values", () => {
  let query = Router.parseQueryString("?name=bobo&title=clown")
  expect(query).toEqual({name:"bobo", title:"clown"})
})

test("parseQueryString should return emopty for ''", () => {
  let query = Router.parseQueryString("")
  expect(query).toEqual({})
})
test("parseQueryString should return emopty for '?'", () => {
  let query = Router.parseQueryString("?")
  expect(query).toEqual({})
})

test("match should match the first valid route", () => {
  const routes = [
    {route:"/", handler: () => "HOME"},
    {route:"/users", handler: () => "USERS"},
    {route:"/users/:userId", handler: (params:Router.Params) => "USER: " + params.userId}
  ]
  expect(Router.match({...location, pathname: "/users"}, routes)).toEqual("USERS")
})

test("match should parse params", () => {
  const routes = [
    {route:"/users/:userId/:title", handler: (params:Router.Params) => params}
  ]
  expect(Router.match({...location, pathname: "/users/bobo/clown"}, routes)).toEqual({userId: "bobo", title:"clown"})
})

test("match should parse query", () => {
  const routes = [
    {route:"/", handler: (params:Router.Params, query:Router.Query) => query}
  ]
  expect(Router.match({...location, pathname: "/", search:"?name=bobo&title=clown"}, routes)).toEqual({name: "bobo", title:"clown"})
})
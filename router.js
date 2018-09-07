"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var createBrowserHistory_1 = require("history/createBrowserHistory");
var createMemoryHistory_1 = require("history/createMemoryHistory");
var createHashHistory_1 = require("history/createHashHistory");
var isVar = function (s) { return s.indexOf(":") == 0; };
var matchRoute = function (selector, location) {
    var path = location.pathname.split("/");
    var params = {};
    for (var i in selector) {
        // vars gets added to params
        if (selector[i] === "*") {
            return __assign({}, location, { params: params });
        }
        else if (isVar(selector[i])) {
            params[selector[i].slice(1)] = path[i];
        }
        else if (selector[i] !== path[i]) { // non vars must match the selector
            return null;
        }
    }
    if (selector.length > path.length)
        return null; // ensure we match the full url
    return __assign({}, location, { params: params });
};
var parseQuery = function (query) {
    return query.split("?")
        .map(function (param) { return param.split("=").map(decodeURIComponent); })
        .reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        var _b;
        return (__assign({}, acc, (_b = {}, _b[key] = value, _b)));
    }, {});
};
var Router = /** @class */ (function () {
    function Router(config) {
        switch (config.type) {
            case "Hash":
                this.history = createHashHistory_1["default"]();
                break;
            case "Memory":
                this.history = createMemoryHistory_1["default"]();
                break;
            default:
                this.history = createBrowserHistory_1["default"]();
                break;
        }
        this.routes = [];
        this.history.listen(this.resolve);
    }
    Router.prototype.resolve = function (location, action) {
        var locationUpdate = __assign({}, location, { action: action, query: parseQuery(location.search), params: {} });
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var _b = _a[_i], selector = _b[0], handler = _b[1];
            var loc = matchRoute(selector, locationUpdate);
            if (loc !== null) {
                return handler(loc);
            }
        }
    };
    Router.prototype.add = function (selector, resolver) {
        this.routes.push([selector.split("/"), resolver]);
        return this;
    };
    Router.prototype.push = function (url) {
        this.history.push(url);
    };
    Router.prototype.replace = function (url) {
        this.history.replace(url);
    };
    Router.prototype.go = function (n) {
        this.history.go(n);
    };
    Router.prototype.goForward = function () {
        this.history.goForward();
    };
    Router.prototype.goBack = function (n) {
        this.history.goBack(n);
    };
    return Router;
}());
exports["default"] = (function (config) { return new Router(config); });

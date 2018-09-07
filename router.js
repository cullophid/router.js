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
var history = createBrowserHistory_1["default"]();
var routes = [];
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
    return __assign({}, location, { params: params });
};
var resolve = function (location) {
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var _a = routes_1[_i], selector = _a[0], handler = _a[1];
        var loc = matchRoute(selector, location);
        if (loc !== null) {
            return handler(loc);
        }
    }
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
history.listen(function (location, action) {
    var locationUpdate = __assign({}, location, { action: action, query: parseQuery(location.search), params: {} });
    resolve(locationUpdate);
});
exports.push = history.push;
exports.replace = history.replace;
exports.on = function (path, resolver) {
    routes.push([path.split("/"), resolver]);
};

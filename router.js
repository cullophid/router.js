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
var isVar = function (s) { return s.indexOf(":") == 0; };
var matchRoute = function (route, location) {
    var locationPath = location.pathname.split("/");
    var params = {};
    var routePath = route.split("/");
    for (var i in routePath) {
        // vars gets added to params
        if (routePath[i] === "*") {
            return params;
        }
        else if (isVar(routePath[i])) {
            params[routePath[i].slice(1)] = locationPath[i];
        }
        else if (routePath[i] !== locationPath[i]) { // non vars must match the selector
            return null;
        }
    }
    if (routePath.length > locationPath.length)
        return null; // ensure we match the full url
    return params;
};
exports.parseQueryString = function (query) {
    return query === "" ? {} :
        query
            .slice(1)
            .split("&")
            .map(function (param) { return param.split("=").map(decodeURIComponent); })
            .reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            var _b;
            return (__assign({}, acc, (_b = {}, _b[key] = value, _b)));
        }, {});
};
exports.match = function (location, routes) {
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var _a = routes_1[_i], route = _a.route, handler = _a.handler;
        var params = matchRoute(route, location);
        if (params !== null) {
            return handler(params, exports.parseQueryString(location.search));
        }
    }
};

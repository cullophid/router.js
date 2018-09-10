export declare type Params = {
    [key: string]: string;
};
export declare type Query = {
    [key: string]: string;
};
export declare type Route<T> = {
    route: string;
    handler: (params: Params, query: Query) => T;
};
export declare const parseQueryString: (query: string) => Query;
export declare const match: <T>(location: Location, routes: Route<T>[]) => T;

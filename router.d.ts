import { Action, History, Location } from "history";
declare type LocationUpdate = {
    action: Action;
    hash: string;
    state: any;
    pathname: string;
    search: string;
    query: {
        [key: string]: string;
    };
    params: {
        [key: string]: string;
    };
    key?: string;
};
declare type Resolver = (location: LocationUpdate) => void;
declare type Route = [string[], Resolver];
declare type Config = {
    type?: "Hash" | "Memory" | "Browser";
    basename?: string;
};
declare class Router {
    routes: Route[];
    history: History;
    constructor(config: Config);
    private resolve;
    add(selector: string, resolver: Resolver): this;
    push(url: string | Location<any>): void;
    replace(url: string | Location<any>): void;
    go(n: number): void;
    goForward(): void;
    goBack(): void;
}
declare const _default: (config: Config) => Router;
export default _default;

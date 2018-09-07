import { Action } from "history";
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
export declare const push: any;
export declare const replace: any;
export declare const on: (path: string, resolver: (location: LocationUpdate) => void) => void;
export {};

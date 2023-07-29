export interface Reference<T> {
    [key: string]: T;
}
interface Query {
    [key: string]: undefined | string | string[] | Query | Query[];
}
export interface YourDeepLinkOptions {
    pageTitle: string;
    androidPackageName: string;
    appLink: string;
    desktopLink: string;
    playStoreLink: string;
    iosStoreLink: string;
    fallbackLink: string;
    customIndexPath: string;
    customScriptPath: string;
    params: Reference<string>;
    query: Query;
    body: any;
}
export {};

interface User {
    index: number;
    UserName: string;
    cookie: string;
    UserAgent: string;
}
declare class JDHelloWorld {
    scriptName: string;
    needHelp: boolean;
    cookiesArr: string[];
    users: User[];
    constructor(scriptName?: string, needHelp?: boolean);
    getCookie(check?: boolean): Promise<void>;
    checkCookie(cookie: string): Promise<boolean>;
    exceptCookie(filename?: string): any;
    get(url: string, headers?: any): Promise<unknown>;
    post(url: string, data: any, headers?: any): Promise<object>;
    wait(ms?: number): Promise<unknown>;
    o2s(obj: object, title?: string): void;
    getShareCodePool(key: string, num: number): Promise<string[]>;
    getshareCodeHW(key: string): Promise<string[]>;
    getRandomNumberByRange(start: number, end: number): number;
    getRandomString(e: number, word?: number): string;
    getRandomNumString(e: number): string;
    run(son: {
        main: any;
        help?: any;
        tips?: any;
    }, help?: Function, tips?: Function): Promise<void>;
}
export { User, JDHelloWorld };

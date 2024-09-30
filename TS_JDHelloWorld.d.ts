interface User {
    index: number;
    UserName: string;
    cookie: string;
    UserAgent: string;
    end?: boolean;
}
declare class JDHelloWorld {
    scriptName: string;
    cookiesArr: string[];
    users: User[];
    constructor(scriptName?: string);
    getCookie(): Promise<void>;
    exceptCookie(filename?: string): string[];
    get(url: string, headers?: any, params?: object): Promise<any>;
    post(url: string, data: string | object, headers?: object, params?: object): Promise<any>;
    wait(ms?: number): Promise<unknown>;
    o2s(msg: string | object, title?: string): void;
    getShareCodePool(key: string, num: number): Promise<string[]>;
    getshareCodeHW(key: string): Promise<string[]>;
    getRandomWord(): string;
    getRandomNumberByRange(start: number, end: number): number;
    getRandomNumString(e: number): string;
    getEncStr(fn: string, body: {
        id?: number;
        taskType?: number;
    }): object;
    getSign(fn: string, body: object): Promise<string>;
    getIosVer(): string;
    getFp(): Promise<string>;
    getFp4_1(): Promise<string>;
    algo(appId: string, fp: string, ua: string, pin: string, url: string, og: string): Promise<object>;
    h5st(version: string, appId: string, ua: string): any;
    run(son: {
        main: Function;
        help?: Function;
        tips?: Function;
    }, help?: Function, tips?: Function): Promise<void>;
}
export { User, JDHelloWorld };

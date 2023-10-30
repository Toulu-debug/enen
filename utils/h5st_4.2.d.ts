declare class H5ST_42 {
    appId: string;
    fp: string;
    ua: string;
    pin: string;
    url: string;
    og: string;
    _algo: {
        tk: string;
        algo: string;
        fp: string;
    };
    constructor(appId: string, ua: string, pin: string, url: string, og: string);
    randomString(n: number, s: string): string;
    algo(): Promise<void>;
    _fp(): string;
    __genSign(t: string, n: {
        key: string;
        value: string;
    }[]): string;
    h5st(body: any): string;
}
export { H5ST_42 };

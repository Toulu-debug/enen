declare class H5ST {
    timestamp: number;
    fp_appid: string;
    functionId: string;
    client: string;
    clientVersion: string;
    ua: string;
    url: string;
    og: string;
    pin: string;
    fp: string;
    algo: {
        tk: string;
        algo: string;
        fp: string;
    };
    constructor(fp_appid: string, fp: string, ua: string, pin: string, url: string, og: string);
    randomString(n: number, s: string): string;
    genAlgo(): Promise<void>;
    genH5st(appid: string, body: object, client: string, clientVersion: string, functionId: string, t: number): string;
}
export { H5ST };

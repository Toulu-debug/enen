declare class JDHelloWorld {
    getCookie(check?: boolean): Promise<string[]>;
    checkCookie(cookie: string): Promise<boolean>;
    get(url: string, headers?: any): Promise<unknown>;
    post(url: string, data: any, headers?: any): Promise<unknown>;
    wait(timeout?: number): Promise<unknown>;
    run(son: {
        main: any;
    }): Promise<void>;
}
export { JDHelloWorld };

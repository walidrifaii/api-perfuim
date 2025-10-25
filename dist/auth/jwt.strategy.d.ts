declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        sub: string;
        email: string;
        isAdmin: boolean;
    }): Promise<{
        userId: string;
        email: string;
        isAdmin: boolean;
    }>;
}
export {};

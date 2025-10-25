import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
export declare function createNestApp(adapter?: ExpressAdapter): Promise<INestApplication>;
export declare function createExpressAdapter(): {
    expressApp: import("express-serve-static-core").Express;
    adapter: ExpressAdapter;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = require("serverless-http");
const app_factory_1 = require("../src/app.factory");
let cached;
async function handler(req, res) {
    if (!cached) {
        const { expressApp, adapter } = (0, app_factory_1.createExpressAdapter)();
        const app = await (0, app_factory_1.createNestApp)(adapter);
        await app.init();
        cached = (0, serverless_http_1.default)(expressApp);
    }
    return cached(req, res);
}
exports.default = handler;
//# sourceMappingURL=index.js.map
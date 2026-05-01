"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_factory_1 = require("./app.factory");
async function bootstrap() {
    const app = await (0, app_factory_1.createNestApp)();
    if (process.env.VERCEL) {
        console.log('✅ Running on Vercel serverless function');
    }
    else {
        const port = process.env.PORT || 3000;
        await app.listen(port);
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📘 Swagger Docs available at http://localhost:${port}/docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map
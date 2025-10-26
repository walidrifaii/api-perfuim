"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_factory_1 = require("./app.factory");
async function bootstrap() {
    const app = await (0, app_factory_1.createNestApp)();
    await app.listen(3000);
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📘 Swagger Docs available at http://localhost:3000/docs');
}
bootstrap();
//# sourceMappingURL=main.js.map
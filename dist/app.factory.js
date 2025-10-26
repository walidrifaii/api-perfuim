"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressAdapter = exports.createNestApp = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
async function createNestApp(adapter) {
    const app = adapter
        ? await core_1.NestFactory.create(app_module_1.AppModule, adapter)
        : await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('perfuim API')
        .setDescription('API documentation for perfuim')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
        .addServer('/')
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, doc, {
        swaggerOptions: { persistAuthorization: true },
    });
    return app;
}
exports.createNestApp = createNestApp;
function createExpressAdapter() {
    const expressApp = (0, express_1.default)();
    return { expressApp, adapter: new platform_express_1.ExpressAdapter(expressApp) };
}
exports.createExpressAdapter = createExpressAdapter;
//# sourceMappingURL=app.factory.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressAdapter = exports.createNestApp = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
function buildAllowedOrigins() {
    var _a, _b, _c;
    const fromEnv = (_b = (_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',').map((s) => s.trim()).filter(Boolean)) !== null && _b !== void 0 ? _b : [];
    const frontend = (_c = process.env.FRONTEND_URL) === null || _c === void 0 ? void 0 : _c.trim();
    const defaults = [
        'https://a-h-tau.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        ...(frontend ? [frontend] : []),
    ];
    return [...new Set([...defaults, ...fromEnv])];
}
async function createNestApp(adapter) {
    const app = adapter
        ? await core_1.NestFactory.create(app_module_1.AppModule, adapter)
        : await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = buildAllowedOrigins();
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(null, false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
        ],
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
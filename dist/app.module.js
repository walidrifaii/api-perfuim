"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const product_module_1 = require("./product/product.module");
const auth_module_1 = require("./auth/auth.module");
const admin_module_1 = require("./admin/admin.module");
const order_module_1 = require("./order/order.module");
const product_schema_1 = require("./product/schemas/product.schema");
const admin_schema_1 = require("./admin/schemas/admin.schema");
const order_schema_1 = require("./order/schemas/order.schema");
const book_schema_1 = require("./book/schemas/book.schema");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const postgresUrl = configService.get('DATABASE_URL') ||
                        configService.get('DB_URI');
                    if (!postgresUrl) {
                        throw new Error('Missing DATABASE_URL (or DB_URI) environment variable. Add it to your .env file.');
                    }
                    return {
                        type: 'postgres',
                        url: postgresUrl,
                        entities: [product_schema_1.Product, admin_schema_1.Admin, order_schema_1.Order, book_schema_1.Book],
                        synchronize: true,
                        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                    };
                },
            }),
            admin_module_1.AdminsModule,
            auth_module_1.AuthModule,
            product_module_1.ProductModule,
            order_module_1.OrderModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
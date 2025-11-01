"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
let ProductController = class ProductController {
    constructor(productService, cloudinary) {
        this.productService = productService;
        this.cloudinary = cloudinary;
    }
    async create(body, file) {
        if (file === null || file === void 0 ? void 0 : file.buffer) {
            const res = await this.cloudinary.uploadBuffer(file.buffer, file.originalname);
            body.image = res.secure_url;
        }
        return this.productService.create(body);
    }
    async update(id, body, file) {
        if (file === null || file === void 0 ? void 0 : file.buffer) {
            const res = await this.cloudinary.uploadBuffer(file.buffer, file.originalname);
            body.image = res.secure_url;
        }
        return this.productService.updateById(id, body);
    }
    async getMenProducts() {
        return this.productService.findBySex('men');
    }
    async getWomenProducts() {
        return this.productService.findBySex('women');
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a product (image upload to Cloudinary)' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Product created successfully' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'brand', 'price', 'sex'],
            properties: {
                name: { type: 'string', example: 'Body Lotion' },
                brand: { type: 'string', example: 'Nivea' },
                price: { type: 'number', example: 29.99 },
                quantity: { type: 'number', example: 500 },
                description: { type: 'string', example: 'Rich moisturizing lotion' },
                size: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['100 ml', '200 ml'],
                },
                sex: {
                    type: 'string',
                    enum: ['men', 'women', 'unisex'],
                    example: 'women',
                },
                isActive: { type: 'boolean', example: true },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: (0, multer_1.memoryStorage)() })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product by id (optional image upload to Cloudinary)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product updated successfully' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product Mongo ObjectId' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                brand: { type: 'string' },
                price: { type: 'number' },
                description: { type: 'string' },
                size: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['250 ml', '500 ml'],
                },
                sex: { type: 'string', enum: ['men', 'women', 'unisex'] },
                isActive: { type: 'boolean' },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: (0, multer_1.memoryStorage)() })),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products for men' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of products for men' }),
    (0, common_1.Get)('men'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getMenProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products for women' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of products for women' }),
    (0, common_1.Get)('women'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getWomenProducts", null);
ProductController = __decorate([
    (0, swagger_1.ApiTags)('Admin Products'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        cloudinary_service_1.CloudinaryService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map
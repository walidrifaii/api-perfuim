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
exports.PublicProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
let PublicProductController = class PublicProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getAllWithQuery(sex, brand, minPrice, maxPrice, size) {
        const filters = {
            sex,
            brand,
            minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
            size,
        };
        return this.productService.findWithFilters(filters);
    }
    async getMenProducts() {
        return this.productService.findBySex('men');
    }
    async getWomenProducts() {
        return this.productService.findBySex('women');
    }
    async getOne(id) {
        return this.productService.findById(id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products (public)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of products returned' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'sex', required: false, enum: ['men', 'women', 'unisex'] }),
    (0, swagger_1.ApiQuery)({ name: 'brand', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false }),
    __param(0, (0, common_1.Query)('sex')),
    __param(1, (0, common_1.Query)('brand')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getAllWithQuery", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all men products (public)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of men products returned' }),
    (0, common_1.Get)('/men'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getMenProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all women products (public)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of women products returned' }),
    (0, common_1.Get)('/women'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getWomenProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a product by id (public)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product returned' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product Mongo ObjectId' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getOne", null);
PublicProductController = __decorate([
    (0, swagger_1.ApiTags)('user products'),
    (0, common_1.Controller)('user/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], PublicProductController);
exports.PublicProductController = PublicProductController;
//# sourceMappingURL=public-product.controller.js.map
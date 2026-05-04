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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_schema_1 = require("./schemas/product.schema");
const size_prices_util_1 = require("./size-prices.util");
let ProductService = class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findAll() {
        return this.productRepository.find();
    }
    async findWithFilters(filters) {
        const where = { isActive: true };
        if (filters.sex)
            where.sex = filters.sex;
        if (filters.brand)
            where.brand = filters.brand;
        const products = await this.productRepository.find({ where });
        return products.filter((p) => {
            var _a;
            const variants = (_a = p.sizePrices) !== null && _a !== void 0 ? _a : [];
            if (filters.size) {
                const want = String(filters.size).trim();
                if (!variants.some((v) => v.size.trim() === want))
                    return false;
            }
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                if (variants.length === 0)
                    return false;
                const minF = filters.minPrice;
                const maxF = filters.maxPrice;
                return variants.some((v) => {
                    if (minF !== undefined && v.price < minF)
                        return false;
                    if (maxF !== undefined && v.price > maxF)
                        return false;
                    return true;
                });
            }
            return true;
        });
    }
    async findById(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found.');
        return product;
    }
    async create(dto) {
        (0, size_prices_util_1.assertDistinctSizes)(dto.sizePrices);
        const created = this.productRepository.create(dto);
        return this.productRepository.save(created);
    }
    async updateById(id, dto) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found.');
        }
        if (dto.sizePrices !== undefined) {
            if (!dto.sizePrices.length) {
                throw new common_1.BadRequestException('sizePrices cannot be empty');
            }
            (0, size_prices_util_1.assertDistinctSizes)(dto.sizePrices);
        }
        const merged = this.productRepository.merge(product, dto);
        return this.productRepository.save(merged);
    }
    async findBySex(sex) {
        return this.productRepository.find({
            where: { sex: sex, isActive: true },
        });
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_schema_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map
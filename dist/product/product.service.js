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
        if (filters.minPrice !== undefined)
            where.price = (0, typeorm_2.MoreThanOrEqual)(filters.minPrice);
        if (filters.maxPrice !== undefined)
            where.price =
                filters.minPrice !== undefined
                    ? (0, typeorm_2.Between)(filters.minPrice, filters.maxPrice)
                    : (0, typeorm_2.LessThanOrEqual)(filters.maxPrice);
        const products = await this.productRepository.find({ where });
        if (filters.size) {
            return products.filter((p) => { var _a; return (_a = p.size) === null || _a === void 0 ? void 0 : _a.includes(filters.size); });
        }
        return products;
    }
    async findById(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found.');
        return product;
    }
    async create(dto) {
        const created = this.productRepository.create(dto);
        return this.productRepository.save(created);
    }
    async updateById(id, dto) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found.');
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
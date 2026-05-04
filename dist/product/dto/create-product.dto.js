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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = exports.ProductSex = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const size_price_dto_1 = require("./size-price.dto");
var ProductSex;
(function (ProductSex) {
    ProductSex["MEN"] = "men";
    ProductSex["WOMEN"] = "women";
    ProductSex["UNISEX"] = "unisex";
})(ProductSex = exports.ProductSex || (exports.ProductSex = {}));
class CreateProductDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Body Lotion' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nivea' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Each variant: size label and its price (JSON array or multipart string)',
        type: [size_price_dto_1.SizePriceDto],
        example: [
            { size: '100 ml', price: 19.99 },
            { size: '200 ml', price: 34.99 },
        ],
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value == null || value === '')
            return undefined;
        let raw = value;
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                raw = Array.isArray(parsed) ? parsed : [parsed];
            }
            catch (_a) {
                return value;
            }
        }
        if (!Array.isArray(raw))
            return raw;
        return raw.map((item) => (0, class_transformer_1.plainToInstance)(size_price_dto_1.SizePriceDto, item, { enableImplicitConversion: true }));
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => size_price_dto_1.SizePriceDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "sizePrices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rich moisturizing lotion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'unisex', enum: ProductSex }),
    (0, class_validator_1.IsEnum)(ProductSex),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 'true'),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://res.cloudinary.com/.../image.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, minimum: 0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "quantity", void 0);
exports.CreateProductDto = CreateProductDto;
//# sourceMappingURL=create-product.dto.js.map
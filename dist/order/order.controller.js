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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_schema_1 = require("./schemas/order.schema");
const create_order_dto_1 = require("./dto/create-order.dto");
const order_service_1 = require("./order.service");
const checkout_user_query_dto_1 = require("./dto/checkout-user-query.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(dto) {
        return this.orderService.checkout(dto);
    }
    async getUserCheckouts(query) {
        return this.orderService.getUserCheckouts(query.customerEmail, query.customerPhone);
    }
    async getCheckoutDetails(id, query) {
        return this.orderService.getCheckoutDetails(id, query.customerEmail, query.customerPhone);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Place order (Cash on Delivery)' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Order placed successfully' }),
    (0, swagger_1.ApiBody)({ type: create_order_dto_1.CreateOrderDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all checkouts for a user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of user checkouts', type: [order_schema_1.Order] }),
    (0, swagger_1.ApiQuery)({ name: 'customerEmail', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'customerPhone', required: false, type: String }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_user_query_dto_1.CheckoutUserQueryDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserCheckouts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get checkout details for a user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Checkout details', type: order_schema_1.Order }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Checkout ID (UUID)' }),
    (0, swagger_1.ApiQuery)({ name: 'customerEmail', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'customerPhone', required: false, type: String }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, checkout_user_query_dto_1.CheckoutUserQueryDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getCheckoutDetails", null);
OrderController = __decorate([
    (0, swagger_1.ApiTags)('checkout'),
    (0, common_1.Controller)('user/checkout'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map
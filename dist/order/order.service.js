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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const mailer_service_1 = require("./mailer.service");
let OrderService = class OrderService {
    constructor(orderModel, productModel, mailer) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.mailer = mailer;
    }
    async checkout(dto) {
        var _a, _b, _c, _d;
        if (dto.paymentMethod !== 'COD') {
            throw new common_1.BadRequestException('Only Cash on Delivery is supported');
        }
        const ids = dto.items.map((i) => new mongoose_2.Types.ObjectId(i.productId));
        const products = await this.productModel
            .find({ _id: { $in: ids }, isActive: true })
            .lean()
            .exec();
        const byId = new Map(products.map((p) => [String(p._id), p]));
        let subtotal = 0;
        const items = dto.items.map((it) => {
            var _a;
            const pidStr = String(it.productId);
            const p = byId.get(pidStr);
            if (!p) {
                throw new common_1.BadRequestException('Product not available');
            }
            if (((_a = p.quantity) !== null && _a !== void 0 ? _a : 0) < it.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${p.name}`);
            }
            const unitPrice = p.price;
            const lineTotal = unitPrice * it.quantity;
            subtotal += lineTotal;
            return {
                productId: new mongoose_2.Types.ObjectId(pidStr),
                quantity: it.quantity,
                unitPrice,
                lineTotal,
                name: p.name,
                brand: p.brand,
                size: p.size,
            };
        });
        const ops = dto.items.map((it) => ({
            updateOne: {
                filter: {
                    _id: it.productId,
                    isActive: true,
                    quantity: { $gte: it.quantity },
                },
                update: { $inc: { quantity: -it.quantity } },
            },
        }));
        const bulk = await this.productModel.bulkWrite(ops, { ordered: true });
        const modified = (_a = bulk.modifiedCount) !== null && _a !== void 0 ? _a : (typeof ((_b = bulk.result) === null || _b === void 0 ? void 0 : _b.nModified) === 'number'
            ? bulk.result.nModified
            : Array.isArray(bulk.result)
                ? bulk.result.reduce((a, r) => { var _a; return a + ((_a = r === null || r === void 0 ? void 0 : r.nModified) !== null && _a !== void 0 ? _a : 0); }, 0)
                : 0);
        if (modified !== dto.items.length) {
            const rollbackOps = dto.items.map((it) => ({
                updateOne: {
                    filter: { _id: it.productId },
                    update: { $inc: { quantity: it.quantity } },
                },
            }));
            try {
                await this.productModel.bulkWrite(rollbackOps, { ordered: false });
            }
            catch (_e) {
            }
            throw new common_1.BadRequestException('Stock changed while ordering. Please try again.');
        }
        const total = subtotal;
        const [order] = await this.orderModel.create([
            {
                customerName: dto.customerName,
                customerPhone: dto.customerPhone,
                customerEmail: dto.customerEmail,
                addressLine1: dto.addressLine1,
                addressLine2: (_c = dto.addressLine2) !== null && _c !== void 0 ? _c : '',
                city: dto.city,
                notes: (_d = dto.notes) !== null && _d !== void 0 ? _d : '',
                paymentMethod: 'COD',
                items,
                subtotal,
                total,
                status: 'placed',
            },
        ]);
        const html = this.renderEmail(order);
        this.mailer
            .sendOrderEmail(`New COD Order #${order._id}`, html)
            .catch((error) => console.error('Failed to send order email:', error));
        return order;
    }
    renderEmail(order) {
        var _a;
        const rows = order.items
            .map((i) => {
            var _a, _b, _c;
            return `
          <tr>
            <td>${(_a = i.name) !== null && _a !== void 0 ? _a : ''}</td>
            <td>${(_b = i.brand) !== null && _b !== void 0 ? _b : ''}</td>
            <td>${(_c = i.size) !== null && _c !== void 0 ? _c : ''}</td>
            <td>${i.quantity}</td>
            <td>${i.unitPrice.toFixed(2)}</td>
            <td>${i.lineTotal.toFixed(2)}</td>
          </tr>`;
        })
            .join('');
        return `
      <h2>New COD Order #${order._id}</h2>
      <p><b>Name:</b> ${order.customerName}</p>
      <p><b>Phone:</b> ${order.customerPhone}</p>
      <p><b>Email:</b> ${order.customerEmail}</p>
      <p><b>Address:</b> ${order.addressLine1} ${(_a = order.addressLine2) !== null && _a !== void 0 ? _a : ''}, ${order.city}</p>
      <p><b>Notes:</b> ${order.notes || '-'}</p>
      <p><b>Payment:</b> Cash on Delivery</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr><th>Name</th><th>Brand</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td colspan="5" align="right"><b>Subtotal</b></td><td>${order.subtotal.toFixed(2)}</td></tr>
          <tr><td colspan="5" align="right"><b>Total</b></td><td>${order.total.toFixed(2)}</td></tr>
        </tfoot>
      </table>
    `;
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mailer_service_1.MailerService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map
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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const admin_schema_1 = require("./schemas/admin.schema");
let AdminsService = class AdminsService {
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async createAdmin(email, password) {
        const exists = await this.adminModel.findOne({ email });
        if (exists)
            throw new common_1.BadRequestException('Admin already exists with this email');
        const passwordHash = await bcrypt.hash(password, 10);
        return this.adminModel.create({ email, passwordHash, isAdmin: true });
    }
    async validateAdmin(email, password) {
        const admin = await this.adminModel.findOne({ email, isAdmin: true });
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return admin;
    }
    async findById(id) {
        return this.adminModel.findById(id);
    }
};
AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminsService);
exports.AdminsService = AdminsService;
//# sourceMappingURL=admin.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailerService = MailerService_1 = class MailerService {
    constructor() {
        var _a, _b;
        this.logger = new common_1.Logger(MailerService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number((_a = process.env.SMTP_PORT) !== null && _a !== void 0 ? _a : 465),
            secure: String((_b = process.env.SMTP_SECURE) !== null && _b !== void 0 ? _b : 'true') === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            pool: true,
            maxConnections: 1,
            maxMessages: 20,
            socketTimeout: 15000,
        });
    }
    async sendOrderEmail(subject, html) {
        const to = process.env.ORDER_TO_EMAIL || process.env.SMTP_USER;
        if (!to) {
            this.logger.warn('ORDER_TO_EMAIL is not set; skipping email');
            return;
        }
        await this.transporter.sendMail({
            from: `"Store Bot" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    }
};
MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)()
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map
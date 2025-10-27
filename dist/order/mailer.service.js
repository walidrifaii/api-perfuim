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
        this.logger = new common_1.Logger(MailerService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            requireTLS: true,
            connectionTimeout: 10000,
            greetingTimeout: 8000,
            socketTimeout: 15000,
            family: 4,
        });
    }
    async sendOrderEmail(subject, html) {
        const to = process.env.ORDER_TO_EMAIL;
        if (!to) {
            this.logger.warn('ORDER_TO_EMAIL is not set; skipping email');
            return;
        }
        try {
            await this.transporter.sendMail({
                from: `walidrifaii53@gmail.com`,
                to,
                subject,
                html,
            });
            this.logger.log('✅ Order email sent successfully');
        }
        catch (err) {
            this.logger.error('❌ Failed to send order email:', err.message);
        }
    }
};
MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)()
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map
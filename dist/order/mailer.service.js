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
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailerService = MailerService_1 = class MailerService {
    constructor() {
        this.logger = new common_1.Logger(MailerService_1.name);
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async sendOrderEmail(subject, html) {
        const to = process.env.ORDER_TO_EMAIL;
        if (!to) {
            this.logger.warn('ORDER_TO_EMAIL is not set; skipping email');
            return;
        }
        try {
            const response = await this.resend.emails.send({
                from: 'Walid Rifaii <onboarding@resend.dev>',
                to,
                subject,
                html,
            });
            this.logger.log('✅ Order email sent successfully');
            this.logger.debug('Resend response:', response);
        }
        catch (err) {
            this.logger.error('❌ Failed to send order email:', err);
            if (err.name) {
                this.logger.error('Error Name:', err.name);
            }
            if (err.message) {
                this.logger.error('Error Message:', err.message);
            }
            if (err.stack) {
                this.logger.error('Stack Trace:', err.stack);
            }
        }
    }
};
MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map
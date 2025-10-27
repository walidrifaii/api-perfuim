import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // important for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    requireTLS: true,
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });

  async sendOrderEmail(subject: string, html: string) {
    const to = process.env.ORDER_TO_EMAIL;
    if (!to) {
      this.logger.warn('ORDER_TO_EMAIL is not set; skipping email');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Store Bot" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      this.logger.log('✅ Order email sent successfully');
    } catch (err) {
      this.logger.error('❌ Failed to send order email:', err.message);
    }
  }
}

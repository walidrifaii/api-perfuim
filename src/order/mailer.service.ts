// src/order/mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // 👇 reuse TLS connection so future mails are quick
    pool: true,
    maxConnections: 1,
    maxMessages: 20,
    socketTimeout: 15000,
  });

  async sendOrderEmail(subject: string, html: string) {
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
}

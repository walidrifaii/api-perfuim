import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // required for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // must be Gmail App Password
    },
    requireTLS: true,
    connectionTimeout: 10000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    family: 4,
  });

  async sendOrderEmail(subject: string, html: string) {
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
    } catch (err: any) {
      // Log the full error object for detailed information
      this.logger.error('❌ Failed to send order email:', err);

      // Optionally log specific useful properties
      if (err.response) {
        this.logger.error('SMTP Response:', err.response);
      }
      if (err.code) {
        this.logger.error('Error Code:', err.code);
      }
      if (err.stack) {
        this.logger.error('Stack Trace:', err.stack);
      }
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOrderEmail(subject: string, html: string) {
    const to = process.env.ORDER_TO_EMAIL;
    if (!to) {
      this.logger.warn('ORDER_TO_EMAIL is not set; skipping email');
      return;
    }

    try {
      const response = await this.resend.emails.send({
        from: 'Walid Rifaii <onboarding@resend.dev>', // you can change this after verifying your domain
        to,
        subject,
        html,
      });

      this.logger.log('✅ Order email sent successfully');
      this.logger.debug('Resend response:', response);
    } catch (err: any) {
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
}

export declare class MailerService {
    private readonly logger;
    private transporter;
    sendOrderEmail(subject: string, html: string): Promise<void>;
}

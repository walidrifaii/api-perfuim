export declare class MailerService {
    private readonly logger;
    private readonly resend;
    constructor();
    sendOrderEmail(subject: string, html: string): Promise<void>;
}

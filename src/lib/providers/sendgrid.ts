import sgMail from '@sendgrid/mail';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class SendGridProvider
 * @description The SendGrid provider for sending emails.
 */
export class SendGridProvider implements EmailProvider {
  name = 'sendgrid';
  weight: number;

  constructor(apiKey: string, weight: number) {
    sgMail.setApiKey(apiKey);
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using SendGrid.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const msg = {
      to: options.to,
      from: options.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((attachment) => ({
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.contentType,
        disposition: 'attachment',
      })),
    };
    try {
      const data = await sgMail.send(msg);
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error) {
      throw new EmailProviderError(
        `SendGrid Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

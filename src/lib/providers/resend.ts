import { Resend } from 'resend';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class ResendProvider
 * @description The Resend provider for sending emails.
 */
export class ResendProvider implements EmailProvider {
  name = 'resend';
  weight: number;
  private resend: Resend;

  constructor(apiKey: string, weight: number) {
    this.resend = new Resend(apiKey);
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Resend.
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
        contentType: attachment.contentType,
      })),
    };
    try {
      const data = await this.resend.emails.send(msg);
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error) {
      throw new EmailProviderError(
        `Resend Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

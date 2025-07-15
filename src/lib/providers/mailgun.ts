import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class MailgunProvider
 * @description The Mailgun provider for sending emails.
 */
export class MailgunProvider implements EmailProvider {
  name = 'mailgun';
  weight: number;
  private mailgun: Mailgun;
  private domain: string;
  private apiKey: string;

  constructor(apiKey: string, domain: string, weight: number) {
    this.mailgun = new Mailgun(formData);
    this.weight = weight;
    this.domain = domain;
    this.apiKey = apiKey;
  }

  /**
   * @method send
   * @description Sends an email using Mailgun.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const mg = this.mailgun.client({
      username: 'api',
      key: this.apiKey,
    });

    const messageData = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachment: options.attachments?.map((a) => ({
        filename: a.filename,
        data: a.content,
      })),
    };

    try {
      const data = await mg.messages.create(this.domain, messageData);
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `Mailgun Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

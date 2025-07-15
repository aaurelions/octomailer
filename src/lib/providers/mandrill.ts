import mailchimp from '@mailchimp/mailchimp_transactional';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class MandrillProvider
 * @description The Mandrill provider for sending emails.
 */
export class MandrillProvider implements EmailProvider {
  name = 'mandrill';
  weight: number;
  private client: any;

  constructor(apiKey: string, weight: number) {
    this.client = mailchimp(apiKey);
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Mandrill.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const message = {
      to: [{ email: options.to }],
      from_email: options.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((a) => ({
        name: a.filename,
        content: a.content,
        type: a.contentType,
      })),
    };

    try {
      const data = await this.client.messages.send({ message });
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error) {
      throw new EmailProviderError(
        `Mandrill Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

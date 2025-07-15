import { ServerClient } from 'postmark';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class PostmarkProvider
 * @description The Postmark provider for sending emails.
 */
export class PostmarkProvider implements EmailProvider {
  name = 'postmark';
  weight: number;
  private client: ServerClient;

  constructor(serverToken: string, weight: number) {
    this.client = new ServerClient(serverToken);
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Postmark.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const message = {
      To: options.to,
      From: options.from,
      Subject: options.subject,
      TextBody: options.text,
      HtmlBody: options.html,
      Attachments: options.attachments?.map((a) => ({
        Name: a.filename,
        Content: a.content,
        ContentType: a.contentType,
        ContentID: null,
      })),
    };

    try {
      const data = await this.client.sendEmail(message);
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `Postmark Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

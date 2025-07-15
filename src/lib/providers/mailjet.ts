import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import Mailjet from 'node-mailjet';
import { EmailProviderError } from '../errors';

/**
 * @class MailjetProvider
 * @description The Mailjet provider for sending emails.
 */
export class MailjetProvider implements EmailProvider {
  name = 'mailjet';
  weight: number;
  private mailjet: Mailjet;

  constructor(apiKey: string, apiSecret: string, weight: number) {
    this.mailjet = new Mailjet({
      apiKey,
      apiSecret,
    });
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Mailjet.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const request = this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: options.from,
          },
          To: [
            {
              Email: options.to,
            },
          ],
          Subject: options.subject,
          TextPart: options.text,
          HTMLPart: options.html,
          Attachments: options.attachments?.map((a) => ({
            Filename: a.filename,
            Content: a.content,
            ContentType: a.contentType,
          })),
        },
      ],
    });

    try {
      const data = await request;
      return {
        provider: this.name,
        options,
        data: data.body,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `Mailjet Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

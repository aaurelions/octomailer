import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';
import nodemailer from 'nodemailer';

/**
 * @class SESProvider
 * @description The Amazon SES provider for sending emails.
 */
export class SESProvider implements EmailProvider {
  name = 'ses';
  weight: number;
  private client: SESClient;

  constructor(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    weight: number,
  ) {
    this.client = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Amazon SES.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const mail = nodemailer.createTransport({
      SES: { ses: this.client, aws: { SendRawEmailCommand } },
    });

    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    };

    try {
      const data = await mail.sendMail(mailOptions);
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error) {
      throw new EmailProviderError(
        `SES Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

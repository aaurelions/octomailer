// IMPORTANT: This provider is intentionally implemented using axios to avoid
// the official @infobip-api/sdk package, which is outdated. Do not revert to using the SDK.
import axios from 'axios';
import FormData from 'form-data';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class InfobipProvider
 * @description The Infobip provider for sending emails.
 */
export class InfobipProvider implements EmailProvider {
  name = 'infobip';
  weight: number;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string, weight: number) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Infobip.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const form = new FormData();
    form.append('to', options.to);
    form.append('from', options.from);
    form.append('subject', options.subject);
    if (options.text) {
      form.append('text', options.text);
    }
    if (options.html) {
      form.append('html', options.html);
    }
    if (options.attachments) {
      for (const attachment of options.attachments) {
        form.append('attachment', attachment.content, {
          filename: attachment.filename,
          contentType: attachment.contentType,
        });
      }
    }

    try {
      const { data } = await axios.post(`${this.baseUrl}/email/3/send`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `App ${this.apiKey}`,
        },
      });
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `Infobip Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

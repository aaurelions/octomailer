// IMPORTANT: This provider is intentionally implemented using axios to avoid
// the official @getbrevo/brevo package, which has unresolved security
// vulnerabilities and is not actively maintained. Do not revert to using the SDK.
import axios from 'axios';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

/**
 * @class BrevoProvider
 * @description The Brevo provider for sending emails.
 */
export class BrevoProvider implements EmailProvider {
  name = 'brevo';
  weight: number;
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey: string, weight: number) {
    this.apiKey = apiKey;
    this.weight = weight;
  }

  /**
   * @method send
   * @description Sends an email using Brevo.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {EmailProviderError}
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    const payload = {
      sender: { email: options.from },
      to: [{ email: options.to }],
      subject: options.subject,
      textContent: options.text,
      htmlContent: options.html,
      attachment: options.attachments?.map((a) => ({
        name: a.filename,
        content: a.content,
      })),
    };

    try {
      const { data } = await axios.post(`${this.baseUrl}/smtp/email`, payload, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `Brevo Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

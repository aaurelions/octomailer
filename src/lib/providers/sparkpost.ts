// IMPORTANT: This provider is intentionally implemented using axios to avoid
// the official sparkpost package, which is deprecated and has unresolved security
// vulnerabilities. Do not revert to using the SDK.
import axios from 'axios';
import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import { EmailProviderError } from '../errors';

export class SparkPostProvider implements EmailProvider {
  name = 'sparkpost';
  weight: number;
  private apiKey: string;
  private baseUrl = 'https://api.sparkpost.com/api/v1';

  constructor(apiKey: string, weight: number) {
    this.apiKey = apiKey;
    this.weight = weight;
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    const payload = {
      content: {
        from: options.from,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments?.map((a) => ({
          name: a.filename,
          type: a.contentType,
          data: a.content,
        })),
      },
      recipients: [{ address: options.to }],
    };

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/transmissions`,
        payload,
        {
          headers: {
            Authorization: this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        provider: this.name,
        options,
        data,
      };
    } catch (error: any) {
      throw new EmailProviderError(
        `SparkPost Error: ${(error as Error).message}`,
        this.name,
        error,
      );
    }
  }
}

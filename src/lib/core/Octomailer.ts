import { EmailOptions, EmailProvider, EmailResult } from '../common/types';
import {
  OctomailerError,
  NoProvidersError,
  NoProviderFoundError,
} from '../errors';

/**
 * @class Octomailer
 * @description A universal library for sending emails using different services.
 */
export class Octomailer {
  private providers: EmailProvider[] = [];
  private logger?: (message: string) => void;

  /**
   * @constructor
   * @param {EmailProvider[]} providers - An array of email providers.
   * @param {(message: string) => void} [logger] - An optional logger function.
   */
  constructor(providers: EmailProvider[], logger?: (message: string) => void) {
    if (!providers || providers.length === 0) {
      throw new NoProvidersError();
    }
    this.providers = providers;
    this.logger = logger;
  }

  /**
   * @method send
   * @description Sends an email using a randomly selected provider based on weights.
   * If a provider fails, it will try the next one until all have been tried.
   * @param {EmailOptions} options - The email options.
   * @returns {Promise<EmailResult>}
   * @throws {OctomailerError}
   */
  public async send(options: EmailOptions): Promise<EmailResult> {
    const providers = this.getShuffledProviders();
    if (providers.length === 0) {
      throw new NoProviderFoundError();
    }

    for (const provider of providers) {
      try {
        this.log(`Sending email with ${provider.name}...`);
        const result = await provider.send(options);
        this.log(`Email sent successfully with ${provider.name}.`);
        return result;
      } catch (error) {
        this.log(
          `Failed to send email with ${provider.name}. Error: ${
            (error as Error).message
          }`,
        );
      }
    }

    throw new OctomailerError('All providers failed to send the email.');
  }

  /**
   * @method getShuffledProviders
   * @description Returns a shuffled array of providers based on their weights.
   * @returns {EmailProvider[]} - The shuffled array of providers.
   */
  private getShuffledProviders(): EmailProvider[] {
    const weightedProviders: EmailProvider[] = [];
    for (const provider of this.providers) {
      for (let i = 0; i < provider.weight; i++) {
        weightedProviders.push(provider);
      }
    }

    // Fisher-Yates shuffle algorithm
    for (let i = weightedProviders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedProviders[i], weightedProviders[j]] = [
        weightedProviders[j],
        weightedProviders[i],
      ];
    }

    return [...new Set(weightedProviders)];
  }

  /**
   * @method selectProvider
   * @description Selects a provider based on weights.
   * @returns {EmailProvider | null} - The selected provider or null if no providers are available.
   */
  private selectProvider(): EmailProvider | null {
    const totalWeight = this.providers.reduce(
      (acc, provider) => acc + provider.weight,
      0,
    );

    if (totalWeight <= 0) {
      if (this.providers.length > 0) {
        return this.providers[
          Math.floor(Math.random() * this.providers.length)
        ];
      }
      return null;
    }

    let random = Math.random() * totalWeight;
    for (const provider of this.providers) {
      if (random < provider.weight) {
        return provider;
      }
      random -= provider.weight;
    }

    return this.providers[this.providers.length - 1];
  }

  /**
   * @method log
   * @description Logs a message if a logger is available.
   * @param {string} message - The message to log.
   */
  private log(message: string) {
    if (this.logger) {
      this.logger(message);
    }
  }
}

export class OctomailerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OctomailerError';
  }
}

export class NoProvidersError extends OctomailerError {
  constructor() {
    super('At least one email provider is required.');
    this.name = 'NoProvidersError';
  }
}

export class NoProviderFoundError extends OctomailerError {
  constructor() {
    super('No provider available to send email.');
    this.name = 'NoProviderFoundError';
  }
}

export class InvalidProviderError extends OctomailerError {
  constructor(provider: string) {
    super(`Invalid provider: ${provider}`);
    this.name = 'InvalidProviderError';
  }
}

export class EmailProviderError extends Error {
  constructor(
    message: string,
    public provider?: string,
    public cause?: any,
  ) {
    super(message);
    this.name = 'EmailProviderError';
  }
}

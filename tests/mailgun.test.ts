import { MailgunProvider } from '../src/lib/providers/mailgun';
import { EmailOptions } from '../src/lib/common/types';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

jest.mock('mailgun.js', () => {
  const mockMailgunClient = {
    messages: {
      create: jest.fn(),
    },
  };
  return jest.fn().mockImplementation(() => ({
    client: jest.fn(() => mockMailgunClient),
  }));
});

describe('MailgunProvider', () => {
  const apiKey = 'TEST_API_KEY';
  const domain = 'test.mailgun.org';
  const weight = 1;
  let mailgunClient: { messages: { create: jest.Mock } };

  beforeEach(() => {
    jest.clearAllMocks();
    const mailgun = new Mailgun(formData);
    mailgunClient = mailgun.client({ username: 'api', key: 'key' }) as any;
  });

  it('should send an email and return the result', async () => {
    const provider = new MailgunProvider(apiKey, domain, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = {
      id: '<20111114174239.25659.5817@samples.mailgun.org>',
    };
    mailgunClient.messages.create.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mailgunClient.messages.create).toHaveBeenCalledWith(
      'test.mailgun.org',
      {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachment: undefined,
      },
    );

    expect(result).toEqual({
      provider: 'mailgun',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new MailgunProvider(apiKey, domain, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Mailgun API Error');
    mailgunClient.messages.create.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Mailgun Error: ${error.message}`,
    );
  });
});

import { SendGridProvider } from '../src/lib/providers/sendgrid';
import { EmailOptions } from '../src/lib/common/types';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe('SendGridProvider', () => {
  const apiKey = 'TEST_API_KEY';
  const weight = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the API key on construction', () => {
    new SendGridProvider(apiKey, weight);
    expect(sgMail.setApiKey).toHaveBeenCalledWith(apiKey);
  });

  it('should send an email and return the result', async () => {
    const provider = new SendGridProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = [{ statusCode: 202, headers: {} }];
    (sgMail.send as jest.Mock).mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(sgMail.send).toHaveBeenCalledWith({
      to: options.to,
      from: options.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: undefined,
    });

    expect(result).toEqual({
      provider: 'sendgrid',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new SendGridProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('SendGrid API Error');
    (sgMail.send as jest.Mock).mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `SendGrid Error: ${error.message}`,
    );
  });
});

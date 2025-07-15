import { MandrillProvider } from '../src/lib/providers/mandrill';
import { EmailOptions } from '../src/lib/common/types';
import mailchimp from '@mailchimp/mailchimp_transactional';

jest.mock('@mailchimp/mailchimp_transactional', () => {
  const mockMailchimp = {
    messages: {
      send: jest.fn(),
    },
  };
  return jest.fn(() => mockMailchimp);
});

describe('MandrillProvider', () => {
  const apiKey = 'API_KEY';
  const weight = 1;
  let mailchimpClient: { messages: { send: jest.Mock } };

  beforeEach(() => {
    jest.clearAllMocks();
    mailchimpClient = mailchimp(apiKey) as any;
  });

  it('should send an email and return the result', async () => {
    const provider = new MandrillProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = [{ status: 'sent' }];
    mailchimpClient.messages.send.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mailchimpClient.messages.send).toHaveBeenCalledWith({
      message: {
        to: [{ email: options.to }],
        from_email: options.from,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: undefined,
      },
    });

    expect(result).toEqual({
      provider: 'mandrill',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new MandrillProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Mandrill API Error');
    mailchimpClient.messages.send.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Mandrill Error: ${error.message}`,
    );
  });
});

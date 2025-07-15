import { PostmarkProvider } from '../src/lib/providers/postmark';
import { EmailOptions } from '../src/lib/common/types';

const mockSendEmail = jest.fn();

jest.mock('postmark', () => ({
  ServerClient: jest.fn().mockImplementation(() => ({
    sendEmail: mockSendEmail,
  })),
}));

describe('PostmarkProvider', () => {
  const serverToken = 'SERVER_TOKEN';
  const weight = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email and return the result', async () => {
    const provider = new PostmarkProvider(serverToken, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = {
      To: 'recipient@example.com',
      SubmittedAt: '2023-01-01T00:00:00Z',
      MessageID: 'message-id',
      ErrorCode: 0,
      Message: 'OK',
    };
    mockSendEmail.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mockSendEmail).toHaveBeenCalledWith({
      To: options.to,
      From: options.from,
      Subject: options.subject,
      TextBody: options.text,
      HtmlBody: options.html,
      Attachments: undefined,
    });

    expect(result).toEqual({
      provider: 'postmark',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new PostmarkProvider(serverToken, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Postmark API Error');
    mockSendEmail.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Postmark Error: ${error.message}`,
    );
  });
});

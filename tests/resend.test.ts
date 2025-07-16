import { ResendProvider } from '../src/lib/providers/resend';
import { EmailOptions } from '../src/lib/common/types';
import { Resend } from 'resend';

const sendMock = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: sendMock,
    },
  })),
}));

describe('ResendProvider', () => {
  const apiKey = 'TEST_API_KEY';
  const weight = 1;

  let provider: ResendProvider;

  beforeEach(() => {
    sendMock.mockClear();
    (Resend as jest.Mock).mockClear();
    provider = new ResendProvider(apiKey, weight);
  });

  it('should construct the Resend client with the API key', () => {
    expect(Resend).toHaveBeenCalledWith(apiKey);
  });

  it('should send an email and return the result', async () => {
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = { id: 'resend-id' };
    sendMock.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(sendMock).toHaveBeenCalledWith({
      to: options.to,
      from: options.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: undefined,
    });

    expect(result).toEqual({
      provider: 'resend',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Resend API Error');
    sendMock.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Resend Error: ${error.message}`,
    );
  });
});

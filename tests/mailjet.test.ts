import { MailjetProvider } from '../src/lib/providers/mailjet';
import { EmailOptions } from '../src/lib/common/types';
import Mailjet from 'node-mailjet';

jest.mock('node-mailjet', () => {
  const mockMailjet = {
    post: jest.fn().mockReturnThis(),
    request: jest.fn(),
  };
  return jest.fn(() => mockMailjet);
});

describe('MailjetProvider', () => {
  const apiKey = 'API_KEY';
  const apiSecret = 'API_SECRET';
  const weight = 1;
  let mailjetClient: Mailjet;

  beforeEach(() => {
    jest.clearAllMocks();
    mailjetClient = new Mailjet({
      apiKey,
      apiSecret,
    });
  });

  it('should send an email and return the result', async () => {
    const provider = new MailjetProvider(apiKey, apiSecret, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = {
      body: {
        Messages: [
          {
            Status: 'success',
            To: [{ Email: 'recipient@example.com' }],
          },
        ],
      },
    };
    (mailjetClient.post('send').request as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    const result = await provider.send(options);

    expect(mailjetClient.post('send').request).toHaveBeenCalledWith({
      Messages: [
        {
          From: { Email: options.from },
          To: [{ Email: options.to }],
          Subject: options.subject,
          TextPart: options.text,
          HTMLPart: options.html,
          Attachments: undefined,
        },
      ],
    });

    expect(result).toEqual({
      provider: 'mailjet',
      options,
      data: mockResponse.body,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new MailjetProvider(apiKey, apiSecret, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Mailjet API Error');
    (mailjetClient.post('send').request as jest.Mock).mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Mailjet Error: ${error.message}`,
    );
  });
});

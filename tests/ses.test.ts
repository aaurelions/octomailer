import { SESProvider } from '../src/lib/providers/ses';
import { EmailOptions } from '../src/lib/common/types';
import nodemailer from 'nodemailer';

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('SESProvider', () => {
  const region = 'us-east-1';
  const accessKeyId = 'ACCESS_KEY';
  const secretAccessKey = 'SECRET_KEY';
  const weight = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email and return the result', async () => {
    const provider = new SESProvider(
      region,
      accessKeyId,
      secretAccessKey,
      weight,
    );
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = { messageId: '12345' };
    mockSendMail.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: undefined,
    });

    expect(result).toEqual({
      provider: 'ses',
      options,
      data: mockResponse,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new SESProvider(
      region,
      accessKeyId,
      secretAccessKey,
      weight,
    );
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('SES API Error');
    mockSendMail.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `SES Error: ${error.message}`,
    );
  });
});

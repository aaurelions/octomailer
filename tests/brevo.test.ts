import { BrevoProvider } from '../src/lib/providers/brevo';
import { EmailOptions } from '../src/lib/common/types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BrevoProvider', () => {
  const apiKey = 'TEST_API_KEY';
  const weight = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email and return the result', async () => {
    const provider = new BrevoProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = { data: { messageId: '12345' } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: options.from },
        to: [{ email: options.to }],
        subject: options.subject,
        textContent: options.text,
        htmlContent: options.html,
        attachment: undefined,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual({
      provider: 'brevo',
      options,
      data: mockResponse.data,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new BrevoProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Brevo API Error');
    mockedAxios.post.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Brevo Error: ${error.message}`,
    );
  });
});

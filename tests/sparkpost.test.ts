import { SparkPostProvider } from '../src/lib/providers/sparkpost';
import { EmailOptions } from '../src/lib/common/types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SparkPostProvider', () => {
  const apiKey = 'TEST_API_KEY';
  const weight = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email and return the result', async () => {
    const provider = new SparkPostProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = { data: { results: { id: '12345' } } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.sparkpost.com/api/v1/transmissions',
      {
        content: {
          from: options.from,
          subject: options.subject,
          html: options.html,
          text: options.text,
          attachments: undefined,
        },
        recipients: [{ address: options.to }],
      },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual({
      provider: 'sparkpost',
      options,
      data: mockResponse.data,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new SparkPostProvider(apiKey, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('SparkPost API Error');
    mockedAxios.post.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `SparkPost Error: ${error.message}`,
    );
  });
});

import { InfobipProvider } from '../src/lib/providers/infobip';
import { EmailOptions } from '../src/lib/common/types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InfobipProvider', () => {
  const apiKey = 'API_KEY';
  const baseUrl = 'BASE_URL';
  const weight = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email and return the result', async () => {
    const provider = new InfobipProvider(apiKey, baseUrl, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
      html: '<p>This is a test.</p>',
    };

    const mockResponse = {
      data: {
        messages: [
          {
            messageId: 'message-id',
            status: {
              groupId: 1,
              groupName: 'GENERAL',
              id: 26,
              name: 'MESSAGE_ACCEPTED',
              description: 'Message accepted',
            },
            to: 'recipient@example.com',
          },
        ],
      },
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await provider.send(options);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${baseUrl}/email/3/send`,
      expect.any(Object),
      {
        headers: {
          'content-type': expect.stringContaining('multipart/form-data'),
          Authorization: `App ${apiKey}`,
        },
      },
    );

    expect(result).toEqual({
      provider: 'infobip',
      options,
      data: mockResponse.data,
    });
  });

  it('should throw an EmailProviderError on failure', async () => {
    const provider = new InfobipProvider(apiKey, baseUrl, weight);
    const options: EmailOptions = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'This is a test.',
    };

    const error = new Error('Infobip API Error');
    mockedAxios.post.mockRejectedValue(error);

    await expect(provider.send(options)).rejects.toThrow(
      `Infobip Error: ${error.message}`,
    );
  });
});

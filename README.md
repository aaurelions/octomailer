# Octomailer: The Ultimate Email Delivery Library

[![NPM Version](https://img.shields.io/npm/v/octomailer.svg)](https://www.npmjs.com/package/octomailer)
[![Build Status](https://github.com/aaurelions/octomailer/actions/workflows/publish.yml/badge.svg)](https://github.com/aaurelions/octomailer/actions)
[![License: ISC](https://img.shields.io/npm/l/octomailer.svg)](https://opensource.org/licenses/ISC)

![Mascot Octomailer](scr.png)

**Octomailer** is a powerful, universal Node.js library for sending transactional emails. It provides a single, unified API to interact with multiple email service providers, allowing you to switch between them effortlessly and implement sophisticated sending strategies.

## Key Features

- **Unified API**: A simple, consistent API for all supported providers. No need to learn different SDKs.
- **Weighted Load Balancing**: Distribute your email sending across multiple providers based on weights you define. This is perfect for managing sending quotas or optimizing costs. For example, if SendGrid offers 100 free emails and Brevo offers 300, you can give Brevo a weight of 3 and SendGrid a weight of 1 to use Brevo three times more often.
- **Provider Flexibility**: Easily switch between providers without changing your application code.
- **TypeScript Support**: Written in TypeScript for a better developer experience with static typing and autocompletion.
- **Extensible**: Easily add your own custom providers.

## Supported Providers & Free Tiers

| Provider       | Free Tier                                    |
| :------------- | :------------------------------------------- |
| **Resend**     | 3,000 emails/month (100 emails/day)          |
| **SendGrid**   | 100 emails/day                               |
| **Brevo**      | 300 emails/day (9,000 emails/month)          |
| **Mailgun**    | 100 emails/day                               |
| **Amazon SES** | 3,000 messages/month for the first 12 months |
| **Postmark**   | 100 emails/month                             |
| **Mandrill**   | No free tier                                 |
| **SparkPost**  | 500 emails/month (for testing)               |
| **Infobip**    | 100 messages/day (60-day free trial)         |
| **Mailjet**    | 200 emails/day (6,000 emails/month)          |

## Installation

```bash
npm install octomailer
```

## Quick Start

Here's a simple example of how to use Octomailer with two providers:

```typescript
import {
  Octomailer,
  SendGridProvider,
  ResendProvider,
  EmailOptions,
} from 'octomailer';

// 1. Initialize your chosen providers with their credentials and weights
const sendgridProvider = new SendGridProvider('YOUR_SENDGRID_API_KEY', 1);
const resendProvider = new ResendProvider('YOUR_RESEND_API_KEY', 3);

// 2. Create an instance of Octomailer with your providers
const mailer = new Octomailer([sendgridProvider, resendProvider]);

// 3. Define your email
const email: EmailOptions = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Hello from Octomailer!',
  text: 'This is the plain text body of the email.',
  html: '<h1>This is the HTML body of the email.</h1>',
};

// 4. Send the email
mailer
  .send(email)
  .then(() => console.log('Email sent successfully!'))
  .catch((error) => console.error('Error sending email:', error));
```

## Provider Configuration

Below are the details for configuring each supported provider.

---

### ResendProvider

- **Website**: [resend.com](https://resend.com)
- **Constructor**: `new ResendProvider(apiKey: string, weight: number)`

```typescript
import { ResendProvider } from 'octomailer';
const provider = new ResendProvider('YOUR_RESEND_API_KEY', 1);
```

---

### SendGridProvider

- **Website**: [sendgrid.com](https://sendgrid.com)
- **Constructor**: `new SendGridProvider(apiKey: string, weight: number)`

```typescript
import { SendGridProvider } from 'octomailer';
const provider = new SendGridProvider('YOUR_SENDGRID_API_KEY', 1);
```

---

### BrevoProvider

- **Website**: [brevo.com](https://www.brevo.com)
- **Constructor**: `new BrevoProvider(apiKey: string, weight: number)`

```typescript
import { BrevoProvider } from 'octomailer';
const provider = new BrevoProvider('YOUR_BREVO_API_KEY', 3);
```

---

### MailgunProvider

- **Website**: [mailgun.com](https://www.mailgun.com)
- **Constructor**: `new MailgunProvider(apiKey: string, domain: string, weight: number)`

```typescript
import { MailgunProvider } from 'octomailer';
const provider = new MailgunProvider(
  'YOUR_MAILGUN_API_KEY',
  'YOUR_MAILGUN_DOMAIN',
  2,
);
```

---

### SESProvider (Amazon SES)

- **Website**: [aws.amazon.com/ses](https://aws.amazon.com/ses)
- **Constructor**: `new SESProvider(region: string, accessKeyId: string, secretAccessKey: string, weight: number)`

```typescript
import { SESProvider } from 'octomailer';
const provider = new SESProvider(
  'us-east-1',
  'YOUR_AWS_ACCESS_KEY_ID',
  'YOUR_AWS_SECRET_ACCESS_KEY',
  4,
);
```

---

### PostmarkProvider

- **Website**: [postmarkapp.com](https://postmarkapp.com)
-. **Constructor**: `new PostmarkProvider(serverToken: string, weight: number)`

```typescript
import { PostmarkProvider } from 'octomailer';
const provider = new PostmarkProvider('YOUR_POSTMARK_SERVER_TOKEN', 1);
```

---

### MandrillProvider

- **Website**: [mailchimp.com/mandrill](https://mailchimp.com/mandrill)
- **Constructor**: `new MandrillProvider(apiKey: string, weight: number)`

```typescript
import { MandrillProvider } from 'octomailer';
const provider = new MandrillProvider('YOUR_MANDRILL_API_KEY', 1);
```

---

### InfobipProvider

- **Website**: [infobip.com](https://www.infobip.com)
- **Constructor**: `new InfobipProvider(apiKey: string, baseUrl: string, weight: number)`

```typescript
import { InfobipProvider } from 'octomailer';
const provider = new InfobipProvider(
  'YOUR_INFOBIP_API_KEY',
  'YOUR_INFOBIP_BASE_URL',
  2,
);
```

---

### MailjetProvider

- **Website**: [mailjet.com](https://www.mailjet.com)
- **Constructor**: `new MailjetProvider(apiKey: string, apiSecret: string, weight: number)`

```typescript
import { MailjetProvider } from 'octomailer';
const provider = new MailjetProvider(
  'YOUR_MAILJET_API_KEY',
  'YOUR_MAILJET_API_SECRET',
  2,
);
```

---

### SparkPostProvider

- **Website**: [sparkpost.com](https://www.sparkpost.com)
- **Constructor**: `new SparkPostProvider(apiKey: string, weight: number)`

```typescript
import { SparkPostProvider } from 'octomailer';
const provider = new SparkPostProvider('YOUR_SPARKPOST_API_KEY', 1);
```

## API Reference

### `Octomailer` Class

#### `constructor(providers: Provider[])`

Creates a new Octomailer instance.

- `providers`: An array of instantiated provider objects.

#### `send(options: EmailOptions): Promise<void>`

Sends an email using one of the configured providers, selected based on their weight.

- `options`: An `EmailOptions` object containing the email details.

### `EmailOptions` Interface

```typescript
interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
}

interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}
```

### `Provider` Interface

This is the interface that all providers must implement.

```typescript
interface Provider {
  name: string;
  weight: number;
  send(options: EmailOptions): Promise<EmailResult>;
}
```

## Development

To get started with development:

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the tests: `npm test`
4.  Build the project: `npm run build`

### Available Scripts

- `npm test`: Run the tests.
- `npm run test:watch`: Run the tests in watch mode.
- `npm run build`: Build the project.
- `npm run lint`: Lint the code.
- `npm run format`: Format the code.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
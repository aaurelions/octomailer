/**
 * @interface EmailAttachment
 * @description Interface for email attachments
 * @property {string} filename - The name of the attachment
 * @property {string} content - The content of the attachment in base64
 * @property {string} contentType - The content type of the attachment
 */
export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

/**
 * @interface EmailOptions
 * @description Interface for email options
 * @property {string} to - The recipient of the email
 * @property {string} from - The sender of the email
 * @property {string} subject - The subject of the email
 * @property {string} text - The text body of the email
 * @property {string} [html] - The html body of the email
 * @property {EmailAttachment[]} [attachments] - An array of attachments
 */
export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
}

/**
 * @interface EmailResult
 * @description Interface for the result of a sent email
 * @property {any} data - The response from the provider
 * @property {EmailOptions} options - The original email options
 * @property {string} provider - The name of the provider used to send the email
 */
export interface EmailResult {
  data: any;
  options: EmailOptions;
  provider: string;
}

/**
 * @interface EmailProvider
 * @description Interface for email providers
 * @property {string} name - The name of the provider
 * @property {number} weight - The weight of the provider for random selection
 * @property {function} send - The function to send an email
 */
export interface EmailProvider {
  name: string;
  weight: number;
  send(options: EmailOptions): Promise<EmailResult>;
}

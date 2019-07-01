import { DotenvParseOutput } from 'dotenv';
import { Template } from '../../templates/templateInterface';
import { fetchClientEmail } from '.';
import { getValidationFailures } from '../../query';
import { Connection } from 'typeorm';
import { Message } from './../index'
import { ValidationFailures } from 'src/models';

export const getMailOptions = async (
  config: DotenvParseOutput,
  template: Template,
  connection: Connection,
  message: Message
) => {
  const { html, text } = template;
  const { clientId, source, migrationId } = message;
  const subject = `Data migration for ${new Date()}`;
  const from = config.DEW_MAIL_FROM || 'Kuunika <noreply@kuunika.org>';
  const to = await fetchClientEmail(clientId).catch(error => console.log(error.Message)) || 'kuunika@gmail.com';
  let attachments = [];
  if (source === 'element_validation') {
    const validationFailures = await getValidationFailures(connection, migrationId);
    const reducer = (previuos: string, current: ValidationFailures): string => {
      return `${previuos + current['reason']}\n`;
    }
    const filename = 'validation-errors.txt';
    const content = Buffer.from(validationFailures.reduce(reducer, ''), 'utf-8');
    const contentType = 'text/plain';
    const attachment = { filename, content, contentType }
    attachments.push(attachment);
  }
  const mailOptions = { from, to, subject, html, text, attachments };
  return mailOptions;
};

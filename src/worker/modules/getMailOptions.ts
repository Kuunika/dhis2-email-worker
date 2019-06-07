import { DotenvParseOutput } from 'dotenv';
import { Template } from '../../templates/templateInterface';
import { fetchClientEmail } from '.';

export const getMailOptions = async (
  config: DotenvParseOutput,
  clientId: string,
  template: Template
) => {
  const { html, text } = template;
  const subject = `Data migration for ${new Date()}`;
  const from = config.DEW_MAIL_FROM || 'Kuunika <noreply@kuunika.org>';
  const to = await fetchClientEmail(clientId).catch(error => console.log(error.Message)) || 'kuunika@gmail.com';
  const mailOptions = { from, to, subject, html, text };
  return mailOptions;
};

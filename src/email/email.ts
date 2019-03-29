import { Message, fetchClientEmail } from '../worker';
import { loadTemplate } from '../templates';
import nodemailer = require('nodemailer');
import juice = require('juice');
import htmlToText = require('html-to-text');

const sendEmail = async (message: Message): Promise<boolean> => {
  const html: any = await loadTemplate(message);

  const inlinedHtml: any = juice(html);
  const text: any = htmlToText.fromString(inlinedHtml);

  const mailOptions = {
    from: `Kuunika <noreply@kuunika.org>`,
    to: await fetchClientEmail(message.clientId),
    subject: `Data migration for ${new Date()}`,
    html,
    text,
  };

  const transport: any = await nodemailer.createTransport({
    host: process.env.DEW_MAIL_HOST,
    port: process.env.DEW_MAIL_PORT,
    auth: {
      user: process.env.DEW_MAIL_USER,
      pass: process.env.DEW_MAIL_PASS,
    },
  });

  const { rejected = [] } = await transport.sendMail(mailOptions);
  if (rejected.length > 0) {
    return false;
  }
  return true;
};

export { sendEmail };

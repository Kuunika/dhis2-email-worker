import { Connection } from 'typeorm';
import { DotenvParseOutput } from 'dotenv';
import { Message, fetchClientEmail } from '../worker';
import { loadTemplate } from '../templates';
import nodemailer = require('nodemailer');
import juice = require('juice');
import htmlToText = require('html-to-text');
import { PusherLogger } from '../Logger';

const sendEmail = async (
  config: DotenvParseOutput,
  connection: Connection,
  message: Message
): Promise<boolean> => {
  const { channelId } = message;
  const pusherLogger = await new PusherLogger(config, channelId);
  const html: any = await loadTemplate(connection, message);

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
    host: config.DEW_MAIL_HOST,
    port: config.DEW_MAIL_PORT,
    auth: {
      user: config.DEW_MAIL_USER,
      pass: config.DEW_MAIL_PASS,
    },
  });

  const { rejected = [] } = await transport.sendMail(mailOptions);
  if (rejected.length > 0) {
    await pusherLogger.error('email not sent');
    return false;
  } else {
    await pusherLogger.info('email sent successfully');
    return true;
  }
};

export { sendEmail };

import juice = require('juice');
import { Connection } from 'typeorm';
import nodemailer = require('nodemailer');
import { DotenvParseOutput } from 'dotenv';
import htmlToText = require('html-to-text');

import { Message } from '../worker';
import { PusherLogger } from '../Logger';
import { loadTemplate } from '../templates';
import { fetchClientEmail } from './fetchClientEmail';

export const sendEmail = async (
  config: DotenvParseOutput,
  connection: Connection,
  message: Message
): Promise<boolean> => {
  const { channelId } = message;
  const pusherLogger = await new PusherLogger(config, channelId);
  const html: any = await loadTemplate(connection, message);

  const inlinedHtml: any = await juice(html);
  const text: any = await htmlToText.fromString(inlinedHtml);

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

  const { rejected = [] } = await transport
    .sendMail(mailOptions)
    .catch(e => console.log(e.message));

  if (rejected.length > 0) {
    await pusherLogger.error('email not sent');
    return false;
  } else {
    await pusherLogger.info('email sent successfully');
    return true;
  }
};

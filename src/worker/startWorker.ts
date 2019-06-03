import { Connection } from 'typeorm';
import { DotenvParseOutput } from 'dotenv';

import Worker = require('tortoise');

// import { sendEmail } from '../email';
import { consumeMessage, createWorker, Message, getMailOptions, createTransport } from '.';
import { loadTemplate } from '../templates';

export const startWorker = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const worker: Worker = await createWorker(config);

  const callback = async (message: any, ack: any) => {
    try {
      const parsedMessage: Message = JSON.parse(message);
      const transport = await createTransport(config);

      const { clientId } = parsedMessage;
      const template = await loadTemplate(connection, parsedMessage);
      const mailOptions = await getMailOptions(config, clientId, template);

      const { rejected = [] } = await transport.sendMail(mailOptions).catch(e => console.log(e.message));

      if (rejected.length > 0) {
        await console.error('email not sent');
      } else { await console.log('email sent successfully'); }

    } catch (error) {
      console.log(error.message);
    }
    ack();
  };

  await consumeMessage(config, worker, callback);
};

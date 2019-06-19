import { Connection } from 'typeorm';
import { DotenvParseOutput } from 'dotenv';

import Worker = require('tortoise');

// import { sendEmail } from '../email';
import { consumeMessage, createWorker, Message, getMailOptions, createTransport, pushToLogWorker } from '.';
import { loadTemplate } from '../templates';

export const startWorker = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const worker: Worker = await createWorker(config);

  console.log('Ready to recieve messages');
  console.log();

  const callback = async (message: any, ack: any) => {
    try {
      const parsedMessage: Message = JSON.parse(message);

      console.log('received message: ');
      console.log(parsedMessage);
      console.log();

      const transport = await createTransport(config);
      const template = await loadTemplate(connection, parsedMessage);
      const mailOptions = await getMailOptions(config, template, connection, parsedMessage);

      const { rejected = [] } = await transport.sendMail(mailOptions);

      if (rejected.length > 0) {
        parsedMessage.message = JSON.stringify({
          service: 'email',
          message: 'Email was not sent',
        });
        await pushToLogWorker(config, worker, parsedMessage);
        console.log(parsedMessage.message);
        console.log();
      } else {
        parsedMessage.message = JSON.stringify({
          service: 'email',
          message: 'Email sent successfully',
        });
        await pushToLogWorker(config, worker, parsedMessage);
        console.log(parsedMessage.message);
        console.log();
      }

    } catch (error) {
      console.log(error.message);
    }
    ack();
  };

  await consumeMessage(config, worker, callback);
};

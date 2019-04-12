import { Connection } from 'typeorm';
import { DotenvParseOutput } from 'dotenv';

import Worker = require('tortoise');

import { sendEmail } from '../email';
import { consumeMessage, createWorker, Message } from '.';

export const startWorker = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const worker: Worker = await createWorker(config);

  const callback = async (message: any, ack: any) => {
    await setTimeout(async () => {
      try {
        const parsedMessage: Message = JSON.parse(message);
        console.log('\n', parsedMessage, '\n');
        await sendEmail(config, connection, parsedMessage);
      } catch (error) {
        console.log(error.message);
      }
      ack();
    }, 3000);
  };

  await consumeMessage(config, worker, callback);
};

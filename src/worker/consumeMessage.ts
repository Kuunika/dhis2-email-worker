import Worker = require('tortoise');
import { DotenvParseOutput } from 'dotenv';

import { Message } from '.';

/**
 * Consume message
 *
 * @param { DotenvParseOutput } config - environment variables object..
 * @param { Worker} worker - worker instance.
 * @param { Function } callback - a function to consume messages.
 */
export const consumeMessage = async (
  config: DotenvParseOutput,
  worker: Worker,
  callback: (message: Message, ack: any) => void
): Promise<void> => {
  const options: object = { durable: config.DEW_QUEUE_DURABLE || true };
  await worker
    .queue(config.DEW_QUEUE_NAME || 'DHIS2_EMAIL_INTEGRATION_QUEUE', options)
    .prefetch(1)
    .subscribe(callback);
};

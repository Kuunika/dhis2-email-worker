import { DotenvParseOutput } from 'dotenv';
import { Message } from '../interface';
import Worker = require('tortoise');

export const pushToLogWorker = async (
  config: DotenvParseOutput,
  worker: Worker,
  message: Message
): Promise<void> => {
  const queueName = config.DEW_ADX_LOG_WORKER || 'ADX_LOG_WORKER';

  const options: { durable: boolean } = {
    durable: Boolean(config.DEW_QUEUE_DURABLE) || true,
  };

  await worker.queue(queueName, options).publish(message);
};

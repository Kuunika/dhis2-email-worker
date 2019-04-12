import Worker = require('tortoise');
import { DotenvParseOutput } from 'dotenv';

/**
 * Create worker instance.
 *
 * @param { DotenvParseOutput } config - environment variables object.
 * @return { Worker } worker instance.
 */
export const createWorker = async (
  config: DotenvParseOutput
): Promise<Worker> => {
  const options: object = {
    connectRetries: config.DEW_QUEUE_CONNECT_RETRIES || 2,
    connectRetryInterval: config.DEW_QUEUE_CONNECT_RETRY_INTERVAL || 100,
  };

  return await new Worker(config.DEW_QUEUE_HOST || 'amqp://localhost', options);
};

import Worker = require('tortoise');
const env = process.env;

interface Message {
  channelId: string;
  client: string;
  email: string;
  migrationFailed: boolean;
  migrationId: number;
  source: string;
}

/**
 * Create worker instance.
 *
 * @param { string } host - RabbitMQ host
 */
const createWorker = async (host: string): Promise<Worker> => {
  const options: object = {
    connectRetries: env.DFQW_QUEUE_CONNECT_RETRIES || 2,
    connectRetryInterval: env.DFQW_QUEUE_CONNECT_RETRY_INTERVAL || 100,
  };

  return await new Worker(host, options);
};

/**
 * Connect to queue
 *
 * @param { Worker } worker - Worker instance.
 * @param { sting } queueName - Queue name.
 * @param { function } processMessage - Function
 */
const consume = async (
  worker: Worker,
  queueName: string,
  callback: (message: Message, ack: any) => void
): Promise<void> => {
  const options: object = { durable: env.DFQW_QUEUE_DURABLE || true };

  await worker
    .queue(queueName, options)
    .prefetch(1)
    .subscribe(callback);
};

export { createWorker, consume, Message };

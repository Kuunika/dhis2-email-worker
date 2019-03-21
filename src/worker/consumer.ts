import { consume, createWorker, Message } from './helpers';
import Worker = require('tortoise');

const env = process.env;

export const consumer = async (): Promise<void> => {
  const host: string | undefined = env.DEW_QUEUE_HOST || 'amqp://localhost';
  const worker: Worker = await createWorker(host);

  const callback = async (message: any, ack: any) => {
    try {
      const parsedMessage: Message = JSON.parse(message);
      console.log(parsedMessage);
    } catch (error) {
      console.log(error.message);
    }
    ack();
  };

  const defaultQueueName = 'DHIS2_EMAIL_INTEGRATION_QUEUE';
  const queueName = process.env.DFQW_QUEUE_NAME || defaultQueueName;
  await consume(worker, queueName, callback);
};

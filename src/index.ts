import { join } from 'path';
import 'reflect-metadata';

import { connectToDatabase } from './datasource';
import { startWorker } from './worker';

import { loadConfig } from './config';

const path = join(__dirname, '..', '.env');

/**
 * Main function
 */
const main = async (): Promise<void> => {
  const config = await loadConfig(path);
  const connection = await connectToDatabase(config);
  await startWorker(config, connection);
};

main();

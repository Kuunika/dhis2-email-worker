import {
  DataElement,
  FailQueue,
  Client,
  MigrationDataElements,
  Migration
} from './../models';

import { ConnectionOptions, createConnection } from 'typeorm';

const env = process.env;
export const connectToDatabase = async () => {
  const options: ConnectionOptions = {
    database: env.DEW_DATABASE || 'dhis2-integration-mediator',
    entities: [
      Client,
      DataElement,
      FailQueue,
      MigrationDataElements,
      Migration,
    ],
    host: env.DEW_DATABASE_HOST || 'localhost',
    password: env.DEW_DATABASE_PASSWORD || '',
    port: Number(env.DEW_DATABASE_PORT) || 3306,
    type: 'mysql',
    username: env.DEW_DATABASE_USERNAME || 'root',
  };

  return createConnection(options);
};

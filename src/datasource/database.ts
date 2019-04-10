import { MigrationDataElements, Migration } from './../models';

import { DotenvParseOutput } from 'dotenv';

import { ConnectionOptions, createConnection, Connection } from 'typeorm';

export const connectToDatabase = async (
  config: DotenvParseOutput
): Promise<Connection> => {
  const options: ConnectionOptions = {
    database: config.DEW_DATABASE || 'dhis2-integration-mediator',
    entities: [MigrationDataElements, Migration],
    host: config.DEW_DATABASE_HOST || 'localhost',
    password: config.DEW_DATABASE_PASSWORD || '',
    port: Number(config.DEW_DATABASE_PORT) || 3306,
    type: 'mysql',
    username: config.DEW_DATABASE_USERNAME || 'root',
  };

  return createConnection(options);
};

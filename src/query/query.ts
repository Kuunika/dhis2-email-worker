import { Message } from '../worker';
import { Connection } from 'typeorm';
import { Migration, MigrationDataElements } from '../models';

const getData = async (
  connection: Connection,
  message: Message
): Promise<object> => {
  const { migrationId, source } = message;

  const migration: Migration = await connection
    .getRepository(Migration)
    .findOne({ id: migrationId });

  if (migration) {
    if (source !== 'failqueue') {
      return migration;
    } else {
      return { ...migration, ...(await getSum(connection, migrationId)) };
    }
  } else {
    return {};
  }
};

const getSum = async (
  connection: Connection,
  migrationId: number
): Promise<object> => {
  const where = { migrationId, isProcessed: true };

  const totalMigratedElements: number = await connection
    .getRepository(MigrationDataElements)
    .count(where);

  const totalFailedElements: number = await connection
    .getRepository(MigrationDataElements)
    .count({ migrationId, isProcessed: false });

  return { totalMigratedElements, totalFailedElements };
};

export { getData };

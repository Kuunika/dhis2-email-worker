import { Message } from '../worker';
import { Connection } from 'typeorm';
import { connectToDatabase } from '../datasource';
import { Migration, FailQueue, MigrationDataElements } from '../models';

const getData = async (message: Message): Promise<object> => {
  const { migrationId, source } = message;

  const connection: Connection = await connectToDatabase();

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
  const where = { migrationId, isMigrated: true };

  const migrationDataElements: MigrationDataElements[] = await connection
    .getRepository(MigrationDataElements)
    .find(where);

  const failQueues: FailQueue[] = await connection
    .getRepository(FailQueue)
    .find(where);

  const totalMigratedElements: number =
    failQueues.length + migrationDataElements.length;

  const totalFailedElements: number = await connection
    .getRepository(FailQueue)
    .count({ migrationId, isMigrated: false });

  return { totalMigratedElements, totalFailedElements };
};

export { getData };

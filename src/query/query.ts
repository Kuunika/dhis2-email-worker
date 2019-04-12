import { Message } from '../worker';
import { Connection, IsNull } from 'typeorm';
import { Migration, MigrationDataElements } from '../models';

export const getMigrationSummary = async (
  connection: Connection,
  message: Message
): Promise<object> => {
  const { migrationId, source } = message;

  const migration: Migration = await connection
    .getRepository(Migration)
    .findOne({ id: migrationId });

  if (migration) {
    return source === 'failqueue'
      ? await getMigrationWithAggregates(connection, migration)
      : migration;
  } else {
    return {};
  }
};

const getMigrationWithAggregates = async (
  connection: Connection,
  migration: Migration
): Promise<Migration> => {
  const { id } = migration;

  migration.totalMigratedElements = await connection
    .getRepository(MigrationDataElements)
    .count({ migrationId: id, isProcessed: true });

  migration.totalFailedElements = await connection
    .getRepository(MigrationDataElements)
    // tslint:disable-next-line:no-null-keyword
    .count({ migrationId: id, migratedAt: IsNull(), isProcessed: true });

  return migration;
};

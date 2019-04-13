import { Message } from '../worker';
import { Connection } from 'typeorm';
import { Migration } from '../models';

export const getMigrationSummary = async (
  connection: Connection,
  message: Message
): Promise<object> => {
  const { migrationId } = message;

  const migration: Migration = await connection
    .getRepository(Migration)
    .findOne({ id: migrationId });

  return (migration) ? migration : {};
};

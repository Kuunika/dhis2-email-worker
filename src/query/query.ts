import { Message } from '../worker';
import { Connection } from 'typeorm';
import { Migration, ValidationFailures } from '../models';

export const getMigrationSummary = async (
  connection: Connection,
  message: Message
): Promise<object> => {
  const { migrationId } = message;

  const migration: Migration = await connection
    .getRepository(Migration)
    .findOne({ id: migrationId });

  await connection
    .getRepository(Migration)
    .save({
      ...migration,
      reportDispatchedAt: new Date(Date.now()),
    });

  return (migration) ? migration : {};
};

export const getValidationFailures = async (
  connection: Connection,
  migrationId: number
): Promise<ValidationFailures[]> => {
  return connection
    .getRepository(ValidationFailures)
    .find({ migrationId });
}

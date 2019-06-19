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

import pug from 'pug';
import { join } from 'path';
import { Connection } from 'typeorm';

import { Message } from '../worker';
import { getMigrationSummary } from '../query';

let template: string;

export const loadTemplate = async (
  connection: Connection,
  message: Message
): Promise<any> => {
  const migrationSummary = await getMigrationSummary(connection, message);

  const pugOptions = {
    ...message,
    ...migrationSummary,
  };

  const { source, migrationFailed } = message;
  template = source === 'failqueue' && !migrationFailed ? 'migration' : source;
  const path = await join(__dirname, '..', `views/${template}.pug`);
  const html = await pug.renderFile(path, pugOptions);

  return html;
};

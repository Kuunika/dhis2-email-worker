import pug from 'pug';
import { join } from 'path';
import juice = require('juice');
import { Connection } from 'typeorm';
import htmlToText = require('html-to-text');

import { Message } from '../worker';
import { getMigrationSummary } from '../query';
import { Template } from './templateInterface';

let template: string;

export const loadTemplate = async (
  connection: Connection,
  message: Message
): Promise<Template> => {
  const migrationSummary = await getMigrationSummary(connection, message);

  const { source, migrationFailed } = message;
  template = source === 'failqueue' && !migrationFailed ? 'migration' : source;

  const pugOptions = {
    ...message,
    ...migrationSummary,
  };

  const path = await join(__dirname, '..', `views/${template}.pug`);
  const html = await pug.renderFile(path, pugOptions);
  const text = await htmlToText.fromString(await juice(html));

  return { html, text };
};

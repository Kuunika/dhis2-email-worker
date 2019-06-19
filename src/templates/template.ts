import pug from 'pug';
import { join } from 'path';
import juice = require('juice');
import { Connection } from 'typeorm';
import htmlToText = require('html-to-text');

import { Message } from '../worker';
import { getMigrationSummary } from '../query';

let template: string;

export const loadTemplate = async (
  connection: Connection,
  message: Message
): Promise<{
  html: string;
  text: string;
}> => {
  const migrationSummary = await getMigrationSummary(connection, message);

  template = getTemplateName(message);

  const pugOptions = {
    client: message.clientId,
    ...message,
    ...migrationSummary,
  };

  const path = await join(__dirname, '..', `views/${template}.pug`);
  const html = await pug.renderFile(path, pugOptions);
  const text = await htmlToText.fromString(await juice(html));

  return { html, text };
};

const getTemplateName = (message: Message): string => {
  const { source, migrationFailed } = message;
  return source === 'failqueue' && !migrationFailed ? 'migration' : source;
};

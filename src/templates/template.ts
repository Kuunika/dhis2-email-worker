import { Message } from '../worker';
import { getData } from '../query';
import { join } from 'path';
import pug from 'pug';
let file: string;

const loadTemplate = async (message: Message): Promise<any> => {
  const { source, migrationFailed } = message;

  file = source;
  if (source === 'failqueue' && !migrationFailed) {
    file = 'migration';
  }

  const data: object = await getData(message);

  const html = pug.renderFile(join(__dirname, '..', `views/${file}.pug`), {
    ...message,
    ...data,
    client: 'Openlmis',
    desc: 'Description',
  });

  return html;
};

export { loadTemplate };

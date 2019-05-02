import { join } from 'path';
import { Connection } from 'typeorm';
import { DotenvParseOutput } from 'dotenv';

import { loadConfig } from '../config';
import { connectToDatabase } from '../datasource';
import { migration } from './fixtures';
import { Migration } from '../models/Migration';
import { createTransport } from '../worker/modules';
import { Message } from '../worker/interface';
import { Template } from '../templates/templateInterface';
import { loadTemplate } from '../templates';
import { getMailOptions } from '../worker/modules/getMailOptions';

let path: string;
let config: DotenvParseOutput;
let connection: Connection;
let testMigration: Migration;
let transport;
let message: Message;
let template: Template;
let mailOptions;

describe('Email integration test', () => {

  beforeEach(async () => {
    path = join(__dirname, 'fixtures', '.env.test');
    config = await loadConfig(path);

    connection = await connectToDatabase(config);

    testMigration = new Migration();
    testMigration.clientId = migration.clientId;
    testMigration.createdAt = migration.createdAt;
    testMigration.totalFailedElements = migration.totalFailedElements;
    testMigration.totalMigratedElements = migration.totalMigratedElements;
    testMigration.totalDataElements = migration.totalDataElements;
    testMigration.structureValidatedAt = migration.structureValidatedAt;
    testMigration.uploadedAt = migration.uploadedAt;
    testMigration.createdAt = migration.createdAt;

    await connection.getRepository(Migration).query(`TRUNCATE TABLE Migration;`);
    await connection.getRepository(Migration).save(testMigration);

    message = {
      channelId: 'asbae',
      client: 'dhis2',
      migrationFailed: false,
      migrationId: testMigration.id,
      source: 'migration',
      clientId: 'dhis2',
      description: 'test migration',
    };

    template = await loadTemplate(connection, message);
    mailOptions = await getMailOptions(config, 'dhis2', template);
  });

  afterEach(async () => {
    await connection.close();
  });

  it('should send an email to mail trap', async () => {
    transport = await createTransport(config);
    const { rejected = [] } = await transport.sendMail(mailOptions).catch(e => console.log(e.message));
    expect(rejected.length).toBe(0);
  }, 7000);

});

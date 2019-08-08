import * as nodemailer from 'nodemailer';
import { DotenvParseOutput } from 'dotenv';

export const createTransport = async (config: DotenvParseOutput) => {
  return await nodemailer.createTransport({
    host: config.DEW_MAIL_HOST,
    port: config.DEW_MAIL_PORT,
    auth: {
      user: config.DEW_MAIL_USER,
      pass: config.DEW_MAIL_PASS,
    },
    pool: true,
    maxConnections: 1,
    maxMessages: 2
  });
};

// pool: true,
//   rateLimit: true,
//     maxConnections: 1,
//       maxMessages: 3,

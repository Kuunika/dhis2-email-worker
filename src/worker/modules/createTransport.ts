import nodemailer = require('nodemailer');
import { DotenvParseOutput } from 'dotenv';

export const createTransport = async (config: DotenvParseOutput) => {
  return await nodemailer.createTransport({
    host: config.DEW_MAIL_HOST,
    port: config.DEW_MAIL_PORT,
    auth: {
      user: config.DEW_MAIL_USER,
      pass: config.DEW_MAIL_PASS,
    },
  });
};

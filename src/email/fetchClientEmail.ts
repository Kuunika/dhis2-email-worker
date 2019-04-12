import _axios from 'axios';
import https from 'https';
import * as CryptoJS from 'crypto-js';

import { EmailClientNotFound } from '.';

export const fetchClientEmail = async (clientId: string) => {
  const axios = _axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const response = await axios({
    method: 'GET',
    url: `${process.env.DEW_OPENHIM_URL}authenticate/root@openhim.org`,
  }).catch((err: Error) => console.log(err.message));

  if (!response) {
    throw new EmailClientNotFound('Email client not found.');
  }

  const { data } = response;

  const { requestTS, requestSalt, hash2 } = hashClientPassword(data);

  const headers = {
    'auth-username': process.env.DEW_OPENHIM_USERNAME,
    'auth-ts': requestTS,
    'auth-salt': requestSalt,
    'auth-token': hash2.toString(CryptoJS.enc.Hex),
  };

  const clients = await axios({
    url: `${process.env.DEW_OPENHIM_URL}clients`,
    headers,
  }).catch((err: Error) => console.log(err.message));

  if (clients) {
    const client = clients.data.find(client => client.clientID === clientId);
    return (client && client.contactPersonEmail) ? client.contactPersonEmail : '';
  }

  return '';
};

const hashClientPassword = (data: any) => {
  const sha512 = CryptoJS.algo.SHA512.create();
  sha512.update(data.salt);
  sha512.update(process.env.DEW_OPENHIM_PASSWORD);

  const hash = sha512.finalize();
  const passwordHash = hash.toString(CryptoJS.enc.Hex);
  const requestSalt = CryptoJS.lib.WordArray.random(16).toString();
  const requestTS = new Date().toISOString();

  const sha512_2 = CryptoJS.algo.SHA512.create();
  sha512_2.update(passwordHash);
  sha512_2.update(requestSalt);
  sha512_2.update(requestTS);

  const hash2 = sha512_2.finalize();
  return { requestTS, requestSalt, hash2 };
};

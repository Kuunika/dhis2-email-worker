import { Connection } from "typeorm";
import { DotenvParseOutput } from "dotenv";

import { consume, createWorker, Message } from "./helpers";
import { sendEmail } from "../email";
import Worker = require("tortoise");

export const startWorker = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const worker: Worker = await createWorker(config.DEW_QUEUE_HOST);

  const callback = async (message: any, ack: any) => {
    try {
      const parsedMessage: Message = JSON.parse(message);
      console.log("\n", parsedMessage, "\n");
      await sendEmail(config, connection, parsedMessage);
    } catch (error) {
      console.log(error.message);
    }
    ack();
  };

  await consume(worker, config.DEW_QUEUE_NAME, callback);
};

const amqp = require("amqplib/callback_api");
const ora = require("ora");

const {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan
} = require("chalk");
const email = require("./email");

const handleQueueConnection = async (err, conn) => {
  const spinner = ora().start();

  if (err) {
    spinner.warn(red(`queue: ${JSON.stringify(err)}`));
  }

  spinner.succeed(green("queue: connection to the queue was successful"));

  const handleChannel = async (err, ch) => {
    if (err) {
      spinner.warn(red(`queue: ${JSON.stringify(err)}`));
    }

    spinner.succeed(green("queue: a channel was created successful"));

    const queueName =
      process.env.DEW_QUEUE_NAME || "DHIS2_EMAIL_INTEGRATION_QUEUE";
    ch.assertQueue(queueName, {
      durable: true
    });

    spinner.succeed(green(`queue: waiting for messages in ${queueName}.`));
    spinner.info(cyan(`queue: to exit press "CTRL+C"`));

    const options = {
      noAck: false
    };

    const readMessage = async msg => {
      spinner.succeed(cyan(`email: received message${msg.content.toString()}`));

      const data = JSON.parse(msg.content.toString());
      await email("mmalumbo@gmail.com", data, spinner);

      await setTimeout(function () {
        spinner.succeed(green("email: email processed"));
        ch.ack(msg);
      }, 1000);
    };

    ch.consume(queueName, readMessage, options);
  };

  await conn.createChannel(handleChannel);

  spinner.stop();
};

const run = async () => {
  const host = process.env.DEW_QUEUE_HOST || "amqp://localhost";
  await amqp.connect(
    host,
    handleQueueConnection
  );
};

module.exports = run;

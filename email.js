const nodemailer = require("nodemailer");
const {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan
} = require("chalk");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");

const {
  getClientModel,
  getMigrationModel,
  getDataSetModel,
  getMigrationDataElementsModel,
  getDataElementModel
} = require("./models");

module.exports = async (to, data, spinner) => {
  const sequelize = await require("./database")(spinner);

  const Migration = await getMigrationModel(sequelize);
  const Client = await getClientModel(sequelize);
  const DataSet = await getDataSetModel(sequelize);
  const MigrationDataElements = await getMigrationDataElementsModel(sequelize);
  const DataElement = await getDataElementModel(sequelize);

  const {
    migrationId = null, flag = false
  } = data;

  const migration = await Migration.findByPk(migrationId);
  if (migration) {
    await sendEmail(migration.dataValues, data, spinner);
  } else {
    console.log("no migration was found");
  }
};

const sendEmail = async (migration, queueData, spinner) => {
  const html = pug.renderFile(`${__dirname}/views/email.pug`, {
    ...queueData,
    ...migration,
    client: "Malu",
    desc: "yes"
  });

  const inlinedHtml = juice(html);
  const text = htmlToText.fromString(inlinedHtml);

  const mailOptions = {
    from: `Kuunika <noreply@kuunika.org>`,
    to: queueData.email,
    subject: `Data migration for ${new Date()}`,
    html,
    text
  };

  const transport = nodemailer.createTransport({
    host: process.env.DEW_MAIL_HOST,
    port: process.env.DEW_MAIL_PORT,
    auth: {
      user: process.env.DEW_MAIL_USER,
      pass: process.env.DEW_MAIL_PASS
    }
  });

  const {
    rejected = []
  } = await transport.sendMail(mailOptions);
  if (rejected.length > 0) {
    spinner.warn("email: email rejected");
  } else {
    spinner.succeed(`email: email sent successfully`);
  }
};

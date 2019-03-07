const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')

const {
  getMigrationModel,
  getMigrationDataElementsModel,
  getFailQueueModel
} = require('./models')

module.exports = async (data, spinner, logger) => {
  const sequelize = await require('./database')(spinner)

  const Migration = await getMigrationModel(sequelize)

  const { migrationId = null, source } = data

  const migration = await Migration.findByPk(migrationId)
  if (migration) {
    const res =
      source !== 'failqueue'
        ? migration.dataValues
        : {
          ...migration.dataValues,
          ...(await getSum(sequelize, migrationId, logger))
        }
    await sendEmail(res, data, spinner, logger)
  } else {
    logger.info('No migration was found')
  }
}

const getSum = async (sequelize, migrationId, logger) => {
  const aggregateData = {}
  const MigrationDataElements = await getMigrationDataElementsModel(sequelize)
  const FailQueue = await getFailQueueModel(sequelize)

  let where = { migrationId, isMigrated: true }

  aggregateData.totalMigratedElements =
    (await FailQueue.count({ where }).catch(error =>
      logger.error(error.message)
    )) +
    (await MigrationDataElements.count({ where }).catch(error =>
      logger.error(error.message)
    ))

  where.isMigrated = false
  aggregateData.totalFailedElements = await FailQueue.count({ where }).catch(
    error => logger.info(error.message)
  )

  return aggregateData
}

const sendEmail = async (migration, queueData, spinner, logger) => {
  const { source, flag } = queueData

  let file = source

  if (source === 'failqueue' && !flag) file = 'migration'

  const html = pug.renderFile(`${__dirname}/views/${file}.pug`, {
    ...queueData,
    ...migration,
    client: 'Openlmis',
    desc: 'Description'
  })

  const inlinedHtml = juice(html)
  const text = htmlToText.fromString(inlinedHtml)

  const mailOptions = {
    from: `Kuunika <noreply@kuunika.org>`,
    to: queueData.email,
    subject: `Data migration for ${new Date()}`,
    html,
    text
  }

  const transport = nodemailer.createTransport({
    host: process.env.DEW_MAIL_HOST,
    port: process.env.DEW_MAIL_PORT,
    auth: {
      user: process.env.DEW_MAIL_USER,
      pass: process.env.DEW_MAIL_PASS
    }
  })

  const { rejected = [] } = await transport.sendMail(mailOptions)
  if (rejected.length > 0) {
    logger.info('email: email rejected')
  } else {
    logger.info(`email: email sent successfully`)
  }
}

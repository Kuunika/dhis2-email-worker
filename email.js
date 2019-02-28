const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')

const {
  getClientModel,
  getMigrationModel,
  getDataSetModel,
  getMigrationDataElementsModel,
  getDataElementModel,
  getFailQueueModel
} = require('./models')

module.exports = async (to, data, spinner) => {
  const sequelize = await require('./database')(spinner)

  const Migration = await getMigrationModel(sequelize)

  const { migrationId = null, source } = data

  const migration = await Migration.findByPk(migrationId)
  if (migration) {
    const res =
      source !== 'failqueue'
        ? migration.dataValues
        : { ...migration.dataValues, ...(await getSum(sequelize, migrationId)) }
    await sendEmail(res, data, spinner)
  } else {
    console.log('no migration was found')
  }
}

const getSum = async (sequelize, migrationId) => {
  const aggregateData = {}
  const MigrationDataElements = await getMigrationDataElementsModel(sequelize)
  const FailQueue = await getFailQueueModel(sequelize)

  let where = { migrationId, isMigrated: true }

  aggregateData.totalMigratedElements =
    (await FailQueue.count({ where }).catch(error)) +
    (await MigrationDataElements.count({ where }).catch(error))

  where.isMigrated = false
  aggregateData.totalFailedElements = await FailQueue.count({ where }).catch(
    error
  )

  return aggregateData
}

const sendEmail = async (migration, queueData, spinner) => {
  const { source, flag } = queueData

  let file = source

  if (source === 'failqueue' && !flag) file = 'migration'
  console.log(source, flag, file)

  const html = pug.renderFile(`${__dirname}/views/${file}.pug`, {
    ...queueData,
    ...migration,
    client: queueData.client || 'OpenLMIS',
    desc: 'yes'
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
    spinner.warn('email: email rejected')
  } else {
    spinner.succeed(`email: email sent successfully`)
  }
}

const error = err => console.log(err.message)

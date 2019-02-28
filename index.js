const dotenv = require('dotenv')
const queue = require('./queue')

const { error } = dotenv.config()

if (error) {
  console.log(error)
  process.exit(1)
}

queue()

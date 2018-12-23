const ENV = process.env.NODE_ENV || 'prod'

const DEBUG = (ENV === 'dev')

module.exports = {
  ENV, DEBUG,
}

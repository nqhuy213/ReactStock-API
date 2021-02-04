const helmet = require('helmet')


exports.helmetSetup = (app) => {
  app.use(helmet())
}
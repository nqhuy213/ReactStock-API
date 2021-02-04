const swaggerUI = require('swagger-ui-express')

exports.swaggerSetup = (app) => {
  app.use('/', swaggerUI.serve)
}
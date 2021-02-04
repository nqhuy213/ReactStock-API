const knex = require('knex') ({
  client:'mysql',
  connection:{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  }
})


exports.knexSetup = (app) => {
  knex.schema.hasTable('users').then((exist) => {
    if(!exist){
      return knex.schema.createTable('users', (table) => {
        table.string('email', 100).primary()
        table.string('password', 100)
      })
    }
  })
  app.use((req, res, next) => {
    req.db = knex
    next()
  })
}

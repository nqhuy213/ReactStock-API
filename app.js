require('dotenv').config()

//ROUTES
const stockRoute = require('./routes/stockRoute')
const userRoute = require('./routes/userRoute')
const indexRoute = require('./routes/indexRoute')
//Others
const express= require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {morganSetup} = require('./middleware/morgan')
const {swaggerSetup} = require('./docs/swaggerSetup')
const {helmetSetup} = require('./middleware/helmet')
const {knexSetup} = require('./database/db')
const https = require('https')
const fs = require('fs')

/* App */
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

/* Setup helmet */
helmetSetup(app)
/* Setup morgan */
morganSetup(app)
/* Setup SwaggerUI */
swaggerSetup(app)
/* Setup knex */
knexSetup(app)

/* Setup Routes */
app.use('/', indexRoute)
app.use('/stocks', stockRoute)
app.use('/user', userRoute)

/** Undefined Routes */
app.use(function(req, res, next) {
  res.status(404);
  res.json({error: true, message:"Not Found"});
  next();
 });

// Start the app
app.listen(process.env.PORT,() => {
  console.log(
     'App is running at http://localhost:%d',
     process.env.PORT
  );
});

// const server = https.createServer(credentials, app).listen(process.env.PORT,() => {
//   console.log(
//      'App is running at https://localhost:%d',
//      process.env.PORT
//   );
// });

module.exports = app;
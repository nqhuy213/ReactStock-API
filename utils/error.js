const errors = {
  stockSymbolFormat: {
    code: 400,
    message: 'Stock symbol incorrect format - must be 1-5 capital letters'
  },
  tokenExpired: {
    code: 403,
    message: 'Token has expired'
  },
  tokenNotFound: {
    code: 403,
    message: 'Authorization header not found'
  },
  jwtMaldormed: {
    code: 403,
    message: 'jwt malformed'
  },
  dbError: {
    code: 404,
    message: 'Error in MySQL database'
  },
  industryNotFound: {
    code: 404,
    message: 'Industry sector not found'
  },
  industryQuery: {
    code: 400,
    message: "Invalid query parameter: only 'industry' is permitted"
  },
  dateNotAllowed: {
    code: 400,
    message: 'Date parameters only available on authenticated route /stocks/authed'
  },
  noStockEntry: {
    code: 404,
    message: 'No entry for symbol in stocks database'
  },
  fromToQuery: {
    code: 400,
    message: "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"
  },
  noParams: {
    code: 404,
    message: 'Not found'
  },
  fromInvalid: {
    code: 400,
    message: 'From date cannot be parsed by Date.parse()'
  },
  toInvalid: {
    code: 400,
    message: 'To date cannot be parsed by Date.parse()'
  },
  noQuoteEntry: {
    code: 404,
    message: 'No entries available for query symbol for supplied date range'
  },
  registerIncomplete:{
    code: 400,
    message:"Request body incomplete - email and password needed"
  },
  userExisted:{
    code: 409,
    message: 'User already exists!'
  },
  loginIncomplete:{
    code: 400,
    message: "Login info incomplete"
  },
  emailNotFound:{
    code: 401,
    message: "User email not found"
  },
  incorrectPassword:{
    code: 401,
    message: "Incorrect password"
  }
}

module.exports = errors
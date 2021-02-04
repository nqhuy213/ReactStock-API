const morgan = require('morgan')
const loggingFormat = ':method :url :status :res[content-length] - :response-time ms'

exports.morganSetup = (app) => {
  morgan.token('req', (req, res) => JSON.stringify(req.headers))
  morgan.token('res', (req, res) => {
    const headers = {}
    res.getHeaderNames().map(h => headers[h] = res.getHeaders(h))
    return JSON.stringify(headers)
  })
  app.use(morgan('dev'))
} 
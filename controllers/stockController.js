const {validateToken} = require('../utils/token')
const error = require('../utils/error')
/**
 * @endpoint: /stocks/symbols
 * Get all the stocks available (optional filtering with industry sector)
 */
exports.getAllSymbols = async (req, res, next) => {
  
  let query = req.query
  console.log(query.industry)
  /* No parameters */
  if(Object.keys(query).length === 0){
    req.db.from('stocks').select('name', 'symbol', 'industry').distinct()
    .then((rows) => {
      res.status(200).json(rows)
    })
    .catch((err) => {
      res.status(error.dbError.code).json({error: true, message: error.dbError.message})
    })
 
  }
  else{
    if((Object.keys(query).length > 1) || Array.isArray(query.industry) || query.industry === undefined || query.industry.trim() === '' ){
      res.status(error.industryQuery.code).json({error:true, message: error.industryQuery.message})
    }else{
      req.db.from('stocks').select('name','symbol','industry').where('industry', 'rlike', query.industry).distinct()
        .then((rows) => {
          if(rows.length === 0){
            res.status(error.industryNotFound.code).json({error: true, message: error.industryNotFound.message})
          }else{
            res.status(200).json(rows)
          }
        })
        .catch((err) => {
          res.status(error.dbError.code).json({error: true, message: error.dbError.message})
        })
    }
  }
}

/**
 * Validate symbol format
 */
exports.validateSymbolFormat = (req,res,next) => {
  let params = req.params
  if(Object.keys(params).length === 0){
    res.status(error.noParams.code).json({error: true, message: error.noParams.message})
  }else{
    if(params.symbol !== params.symbol.toUpperCase()){
      res.status(error.stockSymbolFormat.code).json({error: true, message: error.stockSymbolFormat.message})
    }else{
      next()
    }
  }
}

/**
 * Get the lattest price of a stock
 * @endpoint - /stocks/{symbol}
 */
exports.getOneStock = (req, res, next) => {
  let query = req.query
  if(Object.keys(query).length !== 0){
    res.status(error.dateNotAllowed.code).json({error:true, message: error.dateNotAllowed.message})
  }else{
    const symbol = req.params.symbol
    req.db.from('stocks').select('*').where({symbol: symbol}).orderBy('timestamp', 'desc').limit(1)
      .then((rows) => {
        if(rows.length === 0){
          res.status(error.noStockEntry.code).json({error: true, message: error.noStockEntry.message})
        }else{
          res.status(200).json(rows[0])
        }
      })
      .catch((err) => {
        res.status(error.dbError.code).json({error: true, message: error.dbError.message})
      })
  }
  
}

/**
 * Check token in header
 * @endpoint - /stocks/auth/{symbol}
 */
exports.checkToken = (req,res, next) => {
  const authorization = req.headers.authorization
  const validate = validateToken(authorization)
  if(validate.error){
    res.status(validate.code).json({error: true, message: validate.message})
  }else{
    next()
  }
}


exports.validateDateQuery = (req,res, next) => {
  const query = req.query
  const queryKeys = Object.keys(query)
  const allowKeys = ['from', 'to']
  if(queryKeys.length === 0){
    next()
  }else if(queryKeys.length > 2 || [...new Set([...queryKeys, ...allowKeys])].length > 2){
    res.status(error.fromToQuery.code).json({error: true, message: error.fromToQuery.message})
  }else{
    /* Check date format */
    const {from, to} = req.query
    if(from === undefined){
      if(isNaN(Date.parse(to))){
        res.status(error.toInvalid.code).json({error:true, message: error.toInvalid.message})
      }else{
        next()
      }
    }else if(to === undefined){
      if(isNaN(Date.parse(from))){
        res.status(error.fromInvalid.code).json({error:true, message: error.fromInvalid.message})
      }else{
        next()
      }
    }else{
      if(isNaN(Date.parse(from))){
        res.status(error.fromInvalid.code).json({error:true, message: error.fromInvalid.message})
      }
      else if(isNaN(Date.parse(to))){
        res.status(error.toInvalid.code).json({error:true, message: error.toInvalid.message})
      }else{
        next()
      }
    }
  }
}

exports.getHistoryQuotes = (req,res, next) => {
  const {from, to} = req.query
  const symbol = req.params.symbol
  req.db.from('stocks').select('*').where({symbol: symbol}).orderBy('timestamp', 'desc')
   .then((rows) => {
     if(rows.length === 0){
      res.status(error.noStockEntry.code).json({error: true, message: error.noStockEntry.message})
     }else{
      var result = []
      if(to === undefined && from === undefined){
        res.status(200).json(rows[0])
      }else {
        var fromTime = from === undefined ? 0 : Date.parse(from)
        var toTime = to === undefined ? new Date().getTime() : Date.parse(to)
        result = rows.filter((stock) => {
          const stockTime = new Date(stock.timestamp).getTime()
          return stockTime >= fromTime && stockTime <= toTime
        })
        if(result.length === 0){
          res.status(error.noQuoteEntry.code).json({error: true, message: error.noQuoteEntry.message})
        }else{
          res.status(200).json(result)
        }
      }
     }
   })
   .catch((err) => {
      res.status(error.dbError.code).json({error: true, message: error.dbError.message})
   })
}
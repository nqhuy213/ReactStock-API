const express = require('express')
const stockCtrl = require('../controllers/stockController')
const router = express.Router()

/**
 * @endpoint - /stocks/symbols
 */
router.get('/symbols', stockCtrl.getAllSymbols)

/**
 * @endpoint - /stocks/{symbol}
 */
router.get('/:symbol', stockCtrl.validateSymbolFormat, stockCtrl.getOneStock)

/**
 * @endpoint - /stocks/auth/{symbol}
 */
router.get('/authed/:symbol', stockCtrl.checkToken, stockCtrl.validateSymbolFormat, stockCtrl.validateDateQuery, stockCtrl.getHistoryQuotes)
module.exports = router


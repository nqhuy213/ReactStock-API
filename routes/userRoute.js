const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

/**
 * Register user
 * @endpoint - /user/register
 */
router.post('/register', userController.register)

/**
 * Log in to existing account
 * @endpoint - /user/login
 */
router.post('/login', userController.login)

module.exports = router
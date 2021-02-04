const swaggerUI = require('swagger-ui-express')
const yaml = require('yamljs')
const path = require('path')
const swaggerDoc = yaml.load(path.resolve( 'docs', 'swagger.yaml'))
const express = require('express')
const router = express.Router()

/** Swagger Doc route */
router.get('/',swaggerUI.setup(swaggerDoc))

module.exports = router
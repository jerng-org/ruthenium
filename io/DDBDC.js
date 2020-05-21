'use strict'

const AWS               = require ( 'aws-sdk' ) 
AWS.config.apiVersions  = { dynamodb: '2012-08-10' }

const DDB               = new AWS.DynamoDB ()
const DDBDC             = new AWS.DynamoDB.DocumentClient () 

const mark              = require ( '../modules/mark' )
module.exports          = DDBDC
mark ( `DDBDC.js LOADED` )
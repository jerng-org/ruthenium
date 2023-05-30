'use strict'

/*  2022-05-22 this file was developed to resolve circular dependencies in
 *  'r-u-s.js'. The naming of this file as 'r-u-s-minus-1.js' 
 *  is in order to set precedent in case there should arise any need for 
 *  'r-u-s-minus-2.js' etc.
 *
 **/

const _conf = require(`/var/task/configuration.js`)
const _customLogger = require(`/var/task/modules/custom-logger.js`)

if (_conf.customLogging)
    _customLogger.startCustomLogString('/var/task/modules/r-u-s-minus-1.js')

module.exports = {

    conf: _conf,

    customLogger: _customLogger,

    frameworkDescriptionLogger: require(`/var/task/modules/framework-description-logger.js`),

    mark: require('/var/task/modules/mark.js'),
}

'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const adminImportCsvToDeskCellsTable = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )


    rus.mark ( `~/tasks/admin-import-csv-to-desk-cells-table.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = adminImportCsvToDeskCellsTable
rus.mark ( `~/tasks/admin-import-csv-to-desk-cells-table.js LOADED` )
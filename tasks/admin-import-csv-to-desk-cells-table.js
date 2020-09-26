'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

const adminImportCsvToDeskCellsTable = async(data) => {

    rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js EXECUTION start`)
    // YOUR CODE HERE

    // set data in ( data.RU.io.thisIsMyName )




    data.RU.signals.sendResponse = {
        body: `
<blockquote>
    WIP: 
</blockquote>
<h1>Administration: Load Data</h1>

${ await rus.html.form ( {
    action: await rus.appUrl([
        ['route', `admin-import-csv-to-desk-cells-table`],
        ['form-method', `PATCH`]
    ]),
    class:`ru-card`,
    innerHtml:  
        await rus.html.input({
            name:`desk-schemas[name]`,
            id:`desk-schemas[name]`,
            labelInnerHtml:`Desk schema name <sub>Case Sensitive</sub>`,
            placeholder:`--enter a schema name--`,
            type: `text`,
            required:true,
            
        }) + 
        await rus.html.textarea({
            name:`desk-cells-as-csv`,
            id:`desk-cells-as-csv`,
            labelInnerHtml:`Desk cells <sub>CSV <sup>as defined <a href="https://tools.ietf.org/html/rfc4180#section-2">here</a></sup></sub>`,
            placeholder:`--enter a PROPER comma-separated value-- (scripted [pattern] regex validation is not yet done)`,
            required:true,
            
            // https://stackoverflow.com/questions/21325188/regex-to-validate-textfield-with-csv-format-using-javascript/21325265
            // https://tools.ietf.org/html/rfc4180#section-2
        })  +
        await rus.html.input({type:`submit`})
} ) }
    `
    }

    rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js EXECUTION end`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = adminImportCsvToDeskCellsTable
rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js LOADED`)

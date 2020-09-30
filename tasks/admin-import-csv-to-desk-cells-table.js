'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

const adminImportCsvToDeskCellsTable = async(data) => {

    rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js EXECUTION start`)

    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan({
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        //ReturnConsumedCapacity: 'INDEXES'
    }).promise()

    const csvSubmissionFormResponseBody =  async _ => { 
    
        const deskSchemasModel = require('/var/task/io/models/desk-schemas.js')
        const namePattern = deskSchemasModel.subs.name.self.rules.regex_test
        
        return `
<h1>Administration: Load CSV Data:</h1>
<h2>Step 1: CSV Submission</h2>

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
            pattern: namePattern,
            required:true,
            
        }) + 
        /*  Disfavoured alternative (because it doesn't create a desk if the specified desk is not found):
        await rus.html.select({
            name:`desk-schemas[name]`,
            id:`desk-schemas[name]`,
            labelInnerHtml:`Pick a Desk Schema, by name`,
            required:true,
            options: data.RU.io.deskSchemasScan.Items.map(_schema => {
                return {
                    value: _schema.name,
                    innerHtml: _schema.name
                }
            })
            
        })  +*/
        await rus.html.textarea({
            name:`desk-cells-as-csv`,
            id:`desk-cells-as-csv`,
            labelInnerHtml:`
Desk cells 
    <sub>
        CSV 
        <sup>
            as defined 
            <a href="https://tools.ietf.org/html/rfc4180#section-2">here</a>
        </sup>
    </sub>
`,
            placeholder:`--enter a PROPER comma-separated value-- (scripted [pattern] regex validation is not yet done)`,
            required:true,
//            'data-pattern':`(?<=\r|\n|^)(?!\r|\n|$)(?:(?:"(?<Value>(?:[^"]|"")*)"|(?<Value>(?!")[^,\r\n]+)|"(?<OpenValue>(?:[^"]|"")*)(?=\r|\n|$)|(?<Value>))(?:,|(?=\r|\n|$)))+?(?:(?<=,)(?<Value>))?(?:\r\n|\r|\n|$)`,
            'data-pattern':`(?<=\\r|\\n|^)(?!\\r|\\n|$)(?:(?:"(?<Value>(?:[^"]|"")*)"|(?<Value>(?!")[^,\\r\\n]+)|"(?<OpenValue>(?:[^"]|"")*)(?=\\r|\\n|$)|(?<Value>))(?:,|(?=\\r|\\n|$)))+?(?:(?<=,)(?<Value>))?(?:\\r\\n|\\r|\\n|$)`,
            onkeyup:`
console.log('--start onkeyup--')
const textarea = document.getElementById('desk-cells-as-csv');
const pattern = textarea.dataset.pattern;
const re = new RegExp ( pattern ) ;
const execReturned = re.exec ( textarea.value );
const outputElement = document.getElementById('desk-cells-as-csv-validity');
outputElement.innerText = JSON.stringify(execReturned,null,4);
console.log('--end onkeyup--', textarea, pattern, re, execReturned)
` 
            
            // https://stackoverflow.com/a/39939559
            // https://tools.ietf.org/html/rfc4180#section-2
        })  +
        `<br>CSV Validation :
         <br><pre id="desk-cells-as-csv-validity"> nothing yet to show </pre><br>`
        +
    await rus.html.input({type:`submit`})
} ) }
    `
    }
    
    const putSubmissionFormResponseBody = async _ => `
<h1>Administration: Load CSV Data:</h1>
<h2>Step 2: PUT Submission</h2>
    `
    
    data.RU.signals.sendResponse = {
        body: `
<blockquote>
    WIP: 
</blockquote>` +
            (
                data.RU.request.rawFormString ?
                await putSubmissionFormResponseBody() :
                await csvSubmissionFormResponseBody()
            )
    }
    


    rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js EXECUTION end`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = adminImportCsvToDeskCellsTable
rus.mark(`~/tasks/admin-import-csv-to-desk-cells-table.js LOADED`)

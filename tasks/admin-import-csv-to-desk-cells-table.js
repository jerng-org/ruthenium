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
    <script>

/* RFC 4180 Section 2 - delineated

    0.  Stricter than the RFC
    
            If any RECORD is aborted, the entire parse is aborted.        
    
    1.  From RFC's-3
    
            Header presence is indicated by meta-data, so parser should ignore 
            this, HOWEVER, in our implementation we break from the RFC, and 
            ASSUME THE PRESENCE OF A HEADER.
            
            Therefore, for any data entered A HEADER IS MANDATORY.

    2.  From RFC's-2:
    
        Remove ONE (1) trailing CRLF, if present.
        
    3.  From RFC's-3
    
        We COUNT the number of HEADER fields.
        
        If any RECORD has a different number of fields, the parser exits and 
        cleans up. This further enforces the "same number of fields per record"
        requirement from the RFC's-4.

    4a.  Unquoted fields:
    
            From RFC's-4
    
                Spaces are part of the field.
                
            Any of the following characters result in abortion of the
            record:
            
                - double-quote                  (from RFC's-4, 6)
                - comma                         (from RFC's-6)
                - line-breaks (CRLF) => (\\n)   (from RFC's-6)
    
    4b. Quoted fields:
    
            From RFC's-7
            
                If a double-(double-quote) is found, this is read as part of the
                field, and parsing of the field continues.
    
        

*/    
        console.warn('<< wrong place to put a script tag (WIP) >>')
        
        parseCsv = _text => {
            
            const _store = {

                parseAborted: false,
                fieldQuoteType: 0, // (where 0 => unknown, 1 => unquoted, 2 => quoted )
                headerFields: null,

                currentRecordFields: [],
                currentFieldChars: [],
                parsedRecords: []
            }
            const setFieldQuoteType = _type => {
                _store.fieldQuoteType = _type
            }
            
            const setHeaders = _ => {
                _store.headerFields = _store.currentRecordFields
            }
            
            const appendField = _char => {
                _store.currentFieldChars.push ( _char )
            }
            
            const birthField = _ => {
                _store.currentRecordFields.push ( _store.currentFieldChars.join() )
                _store.currentFieldChars = []  // !!! RESET !!!
            }
            
            const birthRecord = _ => {
                _store.parsedRecords.push ( _store.currentRecordFields )
                _store.currentRecordFields = [] // !!! RESET !!!
            }
            
            const abortField = _ => {
                _store.currentFieldChars = [] // !!! RESET !!!
            }
            
            const abortRecord = _ => {
                _store.currentRecordFields = [] // !!! RESET !!!
            }
            
            const abortParse = _msg => {
                abortField()
                abortRecord()
                _store.parseAborted = true
                _store.summary = _msg
            }
            
            const handleLineBreakOutsideDoubleQuote = _ => {
                if ( ! _store.headerFields) 
                {
                    setHeaders()
                    birthRecord()
                }
                else
                
                if ( _store.currentRecordFields.length < _store.headerFields.length )
                {
                    abortParse ('currentRecordFields.length < headerFields.length, and CRLF was encountered') 
                }
                
            }
            
            console.log('parseCsv(): before loop')
            
            for ( let index = 0; index < _text.length; index++) {
                
                console.log('parseCsv(): char: ' + _text[index])
                
                if ( _store.parseAborted )
                { 
                    console.log('parseCsv(): parsedAborted==truthy')
                    break 
                }
                else 
                {
                    console.log('parseCsv(): fieldQuoteType: ' + _store.fieldQuoteType)
                    switch (_store.fieldQuoteType)
                    {
                        case (0): // !!! NOT IN A FIELD !!!

                            switch (_text[index]) {

                                case ('"'):

                                    setFieldQuoteType(2)
                                    break

                                case (','):

                                    birthField()
                                    break

                                case ('\\n'):

                                    birthField()
                                    handleLineBreakOutsideDoubleQuote()
                                    break

                                default:
                                    setFieldQuoteType(1)
                                    appendField(_text[index])
                            }

                        case (1): // !!! IN AN UNQUOTED FIELD !!!

                            switch (_text[index]) {

                                case ('"'):

                                    abortParse('double-quote encountered in unquoted field')
                                    break

                                case (','):

                                    birthField()
                                    break

                                case ('\\n'):

                                    birthField()
                                    handleLineBreakOutsideDoubleQuote()
                                    break

                                default:
                                    appendField(_text[index])
                            }
                        case (2): //  !!! IN A QUOTED FIELD !!!

                            switch (_text[index]) {


                                case ('"'):

                                if (_text[index + 1] == '"') 
                                {
                                    appendField(_text[index])
                                    index++ // << skip forward >>
                                }
                                else 
                                {
                                    birthField()
                                }
                                break

                                default:
                                    appendField(_text[index])
                            }

                    }
                }
                    
            }
            return _store.parsedRecords
        }
        
    </script>
`,
            placeholder:`--enter a PROPER comma-separated value-- (scripted [pattern] regex validation is not yet done)`,
            required:true,
            onkeyup:`
console.log('--start onkeyup--')
const textarea = document.getElementById('desk-cells-as-csv');
const textareaValue = textarea.value;
const outputElement = document.getElementById('desk-cells-as-csv-validity');
const csvAsArray = parseCsv(textareaValue);
outputElement.innerText = JSON.stringify(csvAsArray,null,4);
console.log('--end onkeyup--')
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

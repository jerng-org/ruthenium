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
    
    5.  Begin by setting:
    
            -   parseAborted = false
            
            -   fieldQuoteType = 0
                    (where 0 => unknown, 1 => unquoted, 2 => quoted )
            
            -   headerFields = undefined
            -   currentRecordFields = [] 
            -   currentFieldChars = []
            -   parsedRecords = []
            
            setFieldQuoteType = _type => {
                fieldQuoteType = _type
            }
            
            setHeaders = _ => {
                headerFields = currentRecordFields
            }
            
            appendField = _char => {
                currentFieldChars.push ( _char )
            }
            
            birthField = _ => {
                currentRecordFields.push ( currentFieldChars.join() )
                currentFieldChars = []  !!! RESET !!!
            }
            
            birthRecord = _ => {
                parsedRecords.push ( currentRecordFields )
                currentRecordFields = []    !!! RESET !!!
            }
            
            abortField = _ => {
                currentFieldChars = []  !!! RESET !!!
            }
            
            abortRecord = _ => {
                currentRecordFields = []  !!! RESET !!!
            }
            
            abortParse = msg => {
                abortField()
                abortRecord()
                parseAborted = true
                return msg
            }
            
            handleLineBreakOutsideDoubleQuote = _ => {
                if 
                    headerFields==falsy
                
                    then
                        setHeaders()
                        birthRecord()
                else
                if
                    currentRecordFields.length < headerFields.length
                   
                    then 
                        abortParse ('currentRecordFields.length < headerFields.length, and CRLF was encountered') 
            }
            
    6.  Loop through characters:
    
        if parseAborted==falsy, then consider NEXT_CHAR, else break loop;
    
            case ( fieldQuoteTypeKnown==0)      !!! NOT IN A FIELD !!!

                case ( NEXT_CHAR == " ):
                
                    - setFieldQuoteType ( 2 )
                    - break
                
                case ( NEXT_CHAR == , ):
                    
                    - birthField()
                    - break
                    
                case ( NEXT_CHAR == \\n ):
                    
                    - birthField()
                    - handleLineBreakOutsideDoubleQuote()
                    - break
                    
                default:
                
                    - setFieldQuoteType ( 1 )
                    - appendField ( NEXT_CHAR )
                    
            case ( fieldQuoteTypeKnown==1)    !!! UNQUOTED FIELD !!!

                case ( NEXT_CHAR == " ):
                
                    - abortParse('double-quote encountered in unquoted field')
                    - break
                
                case ( NEXT_CHAR == , ):
                    
                    - birthField()
                    - break
                    
                case ( NEXT_CHAR == \\n ):
                    
                    - birthField()
                    - handleLineBreakOutsideDoubleQuote()
                    - break
                    
                default:
                    - appendField ( NEXT_CHAR )
                
            case ( fieldQuoteTypeKnown==2)    !!! QUOTED FIELD !!!

                case ( NEXT_CHAR == " ):
                
                    if 
                        NEXT_NEXT_CHAR == "
                    then
                        appendField ( NEXT_CHAR )
                        << skip to NEXT_NEXT_NEXT_CHAR >>
                        break
                
                default:
                    - currentFieldChars.push ( NEXT_CHAR )
                
        

*/    
        console.warn('<< wrong place to put a script tag (WIP) >>')
        
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

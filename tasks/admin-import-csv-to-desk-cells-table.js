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
    onsubmit:`
    
//  WIP

    const formData = new FormData()
    const deskSchemasName = document.getElementById('desk-schemas[name]').value
    const parseResults = document.getElementById('desk-cells-as-csv')._parseResults
    
    {
        formData.set('desk-schemas[name]',deskSchemasName)

        parseResults.parsedRecords.forEach (
            ( cellValue, columnIndex, array) => {
                
                // Primary Key
                formData.set ( 
                    'desk-cells[PUT]###' + columnIndex + '###[DHC]', 
                    deskSchemasName + '#' + parseResults.headerFields[columnIndex] 
                )
                formData.set ( 
                    'desk-cells[PUT]###' + columnIndex + '###[R]', 
                    'customisedUUID'
                )
                
                // Other Attributes
                formData.set ( 
                    'desk-cells[PUT]###' + columnIndex + '###[D]', 
                    deskSchemasName
                )
                formData.set ( 
                    'desk-cells[PUT]###' + columnIndex + '###[S]', 
                    cellValue 
                )
            }
            // , thisArg
        )
        
    }
    
    console.log ( 'Next: append hidden elements based on successful parsedRecords textarea' )

    console.log ( JSON.stringify ( Array.from ( formData.entries() ), null,  4 ) )

return false;
    `,
    innerHtml:  
        await rus.html.input({
            name:`desk-schemas[name]`,
            id:`desk-schemas[name]`,
            labelInnerHtml:`Desk schema name <sub>Case Sensitive</sub>`,
            placeholder:`--enter a schema name--`,
            type: `text`,
            pattern: namePattern,
            required:true,
            //disabled:true
            
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
            name:`desk-cells-as-csv-textarea-value`,
            id:`desk-cells-as-csv`,
            labelInnerHtml:`
Desk cells 
    <sub>
        CSV 
        <sup>
            as defined 
            <a href="https://tools.ietf.org/html/rfc4180#section-2">here</a>,
<blockquote>
with stricter requirements:
<br>(1) the first row WILL be treated as HEADERS,
<br>(2) unclosed quoted fields will result in a field abortion,
<br>(3) any failures will abort the overall parse
<br>( but good headers and records parsed so far, will be shown )
<br>
<br>Optional loosening:
<br>    <input  type="checkbox" 
                id="allow-padded-quoted-fields"
                onchange="reviewFormReadiness()"
        >
            allow quoted fields to be padded with whitespaces
        </input>
        
</blockquote>
        </sup>
    </sub>
    <script>

        console.warn('<< wrong place to put a script tag (WIP) >>')
        
        const debug = false
                    
        parseCsv = ( _text, _conf ) => {

            const _store = {

                parseAborted: false,
                fieldQuoteType: 0, 
                    
                    //  (where  0 => unknown, 
                    //          1 => unquoted, 
                    //          2 => quoted,
                    //          3 => limboed:   following a closed quoted field,
                    //                          but prior to encountering a
                    //                          formal field delimiter (comma,
                    //                          CRLF, or EOF)
                
                headerFields: null,

                currentField: '',
                currentRecordFields: [],
                parsedRecords: []
            }
            const setFieldQuoteType = _type => {
                _store.fieldQuoteType = _type
            }
            
            const setHeaders = _ => {
                _store.headerFields = _store.currentRecordFields
            }
            
            const appendField = _char => {
                debug && console.log('parseCsv(): appendField()')
                _store.currentField = _store.currentField + _char
            }
            
            const birthField = _ => {
                _store.currentRecordFields.push ( _store.currentField )
                _store.currentField = ''  // !!! RESET !!!
                _store.fieldQuoteType = 0  // !!! RESET !!!
            }
            
            const birthRecord = _ => {
                _store.parsedRecords.push ( _store.currentRecordFields )
                _store.currentRecordFields = [] // !!! RESET !!!
            }
            
            const abortField = _ => {
                _store.currentField = '' // !!! RESET !!!
            }
            
            const abortRecord = _ => {
                _store.currentRecordFields = [] // !!! RESET !!!
            }
            
            const abortParse = _msg => {
                abortField()
                abortRecord()
                _store.parseAborted = true
                _store.summary = 'parse aborted: ' + _msg
            }
            
            const recordLengthPass = _ => {
                const pass = _store.currentRecordFields.length == _store.headerFields.length
                if ( ! pass ) {
                    debug && console.log('parseCsv(): recordLengthPass: currentRecordFields: '
                        + JSON.stringify(_store.currentRecordFields))
                    abortParse ('a record field-count was different from the header field-count') 
                }
                return pass 
            }
            
            const handleRecordEndOfTerm = _ => {
                if ( ! _store.headerFields) 
                {
                    setHeaders()
                    abortRecord()
                }
                else
                
                if ( recordLengthPass() )
                {
                    birthRecord()
                }
                
            }
            
            debug && console.log('parseCsv(): before loop')
            
            if ( _text[ _text.length -1 ] == '\\n' ) {
                _text = _text.substring(0, _text.length - 1);
            }
            for ( let index = 0; index <= _text.length; index++) {
                
                debug && console.log('parseCsv(): char: ' + _text[index])
                
                debug && console.log('parseCsv(): fieldQuoteType: ' + _store.fieldQuoteType)
                    
                if ( _store.parseAborted )
                { 
                    debug && console.log('parseCsv(): parsedAborted==truthy')
                    break 
                }
                else 
                
                if ( undefined == _text[index] ) 
                {
                
                    /*  INTEGRATE all of this with the switch in the ELSE
                     *  then remove this surrounding IF-ELSE
                     *
                     */
                
                    switch(_store.fieldQuoteType) {
                    
                        case (2):
                            abortParse('unclosed quoted field encountered at end of text')
                            break
                    
                        case (3):
                            handleRecordEndOfTerm()
                            break
                    
                        default:
                            
                            // end of text
                            birthField()
                            handleRecordEndOfTerm()
                    }
                }
                else 
                {
                    switch (_store.fieldQuoteType)
                    {
                        case (0): // !!! NOT IN A FIELD !!!

                            switch (_text[index]) {

                                case ('"'):

                                    setFieldQuoteType(2)
                                    break

                                case (','):

                                    // EO-field
                                    birthField()
                                    break

                                case ('\\n'):

                                    // EO-field, EO-record
                                    birthField()
                                    handleRecordEndOfTerm()
                                    break

                                default:
                                    setFieldQuoteType(1)
                                    appendField(_text[index])
                            }
                            break

                        case (1): // !!! IN AN UNQUOTED FIELD !!!

                            switch (_text[index]) {

                                case ('"'):

                                    if (_conf.allowPaddedQuotedFields &&
                                        Array.from(_store.currentField).every(c => c == ' ')) 
                                    {
                                        //  Since all preceding characters in this
                                        //  field are white space, assert that 
                                        //  those are non-data characters leading
                                        //  a quoted field;

                                        // switch types, and thus rules
                                        setFieldQuoteType(2)

                                        // reset field
                                        abortField()
                                    }
                                    else {
                                        abortParse('double-quote encountered in unquoted field')
                                    }
                                    break

                                case (','):

                                    // EO-field
                                    birthField()
                                    break

                                case ('\\n'):

                                    // EO-field, EO-record
                                    birthField()
                                    handleRecordEndOfTerm()
                                    break

                                default:
                                    appendField(_text[index])
                            }
                            break
                            
                        case (2): //  !!! IN A QUOTED FIELD !!!

                            switch (_text[index]) { // " ... 'it' ... below:"

                                case ('"'):

                                    switch (_text[index + 1]) {
                                    
                                        case ('"'):
                                            
                                            // 'it''s an ESCAPED double-quote
                                            appendField(_text[index])
                                            index++ // << skip forward >>
                                            break
                                        
                                        case (','):
                                       
                                            // 'it''s the CLOSING double-quote 
                                            // EO-field
                                            birthField()
                                            index++ // << skip forward >>
                                            break
                                        
                                        case (' '):
                                        
                                            // 'it''s the CLOSING double-quote 
                                            // EO-field
                                            if (_conf.allowPaddedQuotedFields) {
                                                
                                                birthField()
                                                
                                                // overwrite
                                                setFieldQuoteType(3)
                                                index++ // << skip forward >>
                                            
                                                break
                                            } 
                                            
                                            // otherwise will cascade to default:
                                            
                                        case ('\\n'):
                                       
                                            // 'it''s the CLOSING double-quote 
                                            // EO-field, EO-record
                                            birthField()
                                            handleRecordEndOfTerm()
                                            index++ // << skip forward >>
                                            break
                                       
                                        case ( undefined ): 
                                        
                                            // 'it''s the CLOSING double-quote 
                                            // EO-field, EO-record, EO-text
                                            birthField()
                                            handleRecordEndOfTerm()
                                            index++ // << skip forward >>
                                            break
                                        
                                        default:
                                            // it's the CLOSING double-quote 
                                            abortParse('a double-quoted field was followed by an illegal character: ' + _text[index+1] )
                                    }
                                    break

                                default:
                                    appendField(_text[index])
                            }
                            break
                            
                        case (3):   //  !!! FOLLOWING A QUOTED FIELD !!!
                                    //  !!! NOT YET FORMALLY DELIMITED !!!

                            switch (_text[index]) {

                                case (' '):

                                    //  simply ignore further whitespace
                                    break

                                case (','):

                                    // back to normal, carry on
                                    setFieldQuoteType(0)
                                    break

                                case ('\\n'):

                                    // back to normal, carry on
                                    setFieldQuoteType(0)
                                    handleRecordEndOfTerm()
                                    break
                                    
                                case (undefined):

                                    // back to normal, carry on
                                    setFieldQuoteType(0)
                                    handleRecordEndOfTerm()
                                    break
                                    
                                default:
                                    abortParse('a double-quoted field was closed, then followed by an illegal character: ' + _text[index])
                            }
                            break
                    }
                }
                    
                debug && console.log('parseCsv(): _store: ' + JSON.stringify(_store,null,4))
                
            } // for
            
            if (!_store.parseAborted) {
                _store.summary = 'parse succeeded'
            }
            
            debug && console.log('parseCsv(): summary: ' + _store.summary)
            
            return _store
        }
        
        let textarea, 
            outputElement
        
        document.addEventListener('DOMContentLoaded', (event) => {
        
            textarea 
                = document.getElementById('desk-cells-as-csv');
            
            outputElement 
                = document.getElementById('desk-cells-as-csv-validity');
                
            submitInputElement
                = document.querySelector('input[type=submit]')
        })            
        
        reviewFormReadiness = _ => {
            
            debug && console.log('--start validate and display--')
            
            const textareaValue 
                = textarea.value;
            
            const allowPaddedQuotedFields 
                = document.getElementById('allow-padded-quoted-fields').checked
            
            // VALIDATION
            const parseResults
                = parseCsv(
                    textareaValue,
                    { allowPaddedQuotedFields: allowPaddedQuotedFields });
            
            // UI DISPLAY
            outputElement.innerText 
                = 'Summary : ' + parseResults.summary + '\\n' +
                'Headers : ' + JSON.stringify(parseResults.headerFields, null, 4) + '\\n' +
                'Records : ' + JSON.stringify(parseResults.parsedRecords, null, 4);
            
            // SET FORM READINESS
            submitInputElement.disabled
                =   parseResults.parseAborted
                    || ( ! parseResults.parsedRecords.length )
            
            // PASS DATA TO form[onsubmit] VIA ...
            textarea._parseResults = parseResults
            
                    
            debug && console.log('--end validate and display--')

        }
                
    </script>
`,
            placeholder:`--enter a PROPER comma-separated value--`,
            required:true,
            onkeyup:`reviewFormReadiness()` 
            
            // https://stackoverflow.com/a/39939559
            // https://tools.ietf.org/html/rfc4180#section-2
        })  
        +
        await rus.html.input({
                type: `submit`,
                disabled: true
            }) +
        `
        <br>
        <div class="ru-card">
            <h3>CSV Validation :</h3>
            <pre id="desk-cells-as-csv-validity"> nothing yet to show </pre>
        </div>
        <br>

<h4>TEST CSV INPUT DATA :</h4>
<pre>
"h1",h2,h3,h4
a,b,c,d
e,f,g,""
"""","


""

",,
h,i,j,k
"x,,,x","y,

y",,""""
  "a", "b", "c" ,"d"
</pre>

<h4>RULES - based on RFC 4180 Section 2 :</h4>
<pre>

    0.  (Stricter than the RFC)
    
        If any RECORD is aborted, the entire parse is aborted.        
    
        (But good headers and records parsed so far, will be shown.)
    
    1.  From RFC's-2.3.
    
        Header presence is indicated by meta-data, so parser should ignore 
        this, HOWEVER, 
        
        (Stricter than the RFC)
        
            in our implementation we break from the RFC, and ASSUME THE 
            PRESENCE OF A HEADER.
        
            Therefore, for any data entered A HEADER IS MANDATORY.

    2.  From RFC's-2.2.
    
        Remove ONE (1) trailing CRLF, if present.
        
    3.  From RFC's-2.3.
    
        We COUNT the number of HEADER fields.
        
        If any RECORD has a different number of fields, the parser exits and 
        cleans up. 
        
        This further enforces the "same number of fields per record"
        requirement from the RFC's-4.

    4a.  Unquoted fields:
    
            From RFC's-2.4.
    
                Spaces are part of the field.
                
            Any of the following characters result in abortion of the
            record:
            
                - double-quote                  (from RFC's-4, 6)
                - comma                         (from RFC's-6)
                - line-breaks (CRLF) => (\\n)   (from RFC's-6)
    
    4b. Quoted fields:
    
            From RFC's-2.7.
            
                If a double-(double-quote) is found, this is read as part of the
                field, and parsing of the field continues.
   
</pre>

         
         
         `
} ) // form

    
}
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

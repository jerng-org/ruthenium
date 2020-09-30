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
    
        console.warn('<< wrong place to put a script tag (WIP) >>')
        
        function csvToArray(text) {
            let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
            for (l of text) {
                if ('"' === l) {
                    if (s && l === p) row[i] += l;
                    s = !s;
                } else if (',' === l && s) l = row[++i] = '';
                else if ('\\n' === l && s) {
                    if ('\\r' === p) row[i] = row[i].slice(0, -1);
                    row = ret[++r] = [l = '']; i = 0;
                } else row[i] += l;
                p = l;
            }
            return ret;
        };
        
        function parseCsv(data, fieldSep, newLine) {
            fieldSep = fieldSep || ',';
            newLine = newLine || '\\n';
            var nSep = '\\x1D';
            var qSep = '\\x1E';
            var cSep = '\\x1F';
            var nSepRe = new RegExp(nSep, 'g');
            var qSepRe = new RegExp(qSep, 'g');
            var cSepRe = new RegExp(cSep, 'g');
            var fieldRe = new RegExp('(?<=(^|[' + fieldSep + '\\\\n]))&quot;(|[\\\\s\\\\S]+?(?<![^&quot;]&quot;))&quot;(?=($|[' + fieldSep + '\\\\n]))', 'g');
            var grid = [];
            data.replace(/\\r/g, '').replace(/\\n+$/, '').replace(fieldRe, function(match, p1, p2) {
                return p2.replace(/\\n/g, nSep).replace(/&quot;&quot;/g, qSep).replace(/,/g, cSep);
            }).split(/\\n/).forEach(function(line) {
                var row = line.split(fieldSep).map(function(cell) {
                    return cell.replace(nSepRe, newLine).replace(qSepRe, '&quot;').replace(cSepRe, ',');
                });
                grid.push(row);
            });
            return grid;
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
const csvAsArray = parse(textareaValue);
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

const trOfTableSchema       = require (`../markup/trOfTableSchemas.js`) 

const tableOfTableSchemas   = ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            <tr>
                <th colspan="2">
                    <h6>
                        System is currently aware of ${ deskSchemasScan.Count } Table Schemas
                        <a class="button float-right" href="#">Create Table</a>
                    </h6>
    
                </th>
            </tr>
            <tr>
                <th><h3>Table Name</h3></th>
                <th><h3>Column Names</h3></th>
            </tr>
        </thead>
        <tbody style="vertical-align:top;">
            ${  
                deskSchemasScan.Items.reduce ( 
                ( accumulator, currentItem, index ) => {
                    return  accumulator +
                            trOfTableSchema ( currentItem )
                }, '' )
            }
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">
                    <a class="button float-right" href="#">Create Table</a>
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}

module.exports  = tableOfTableSchemas
const mark      = require ( '../modules/mark' )            
mark ( `table-of-table-schemas.js LOADED` )
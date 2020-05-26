const trOfDeskSchema       = require (`../markup/trOfDeskSchemas.js`) 

const tableOfDeskSchemas   = async ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            <tr>
                <th colspan="2">
                    <h6>
                        System is currently aware of ${ deskSchemasScan.Count } Desk Schemas
                        <a class="button float-right" href="#">Create Desk</a>
                    </h6>
    
                </th>
            </tr>
            <tr>
                <th><h3>Desk Name</h3></th>
                <th><h3>Column Names</h3></th>
            </tr>
        </thead>
        <tbody style="vertical-align:top;">
            ${  /*
                deskSchemasScan.Items.reduce ( 
               async ( accumulator, currentItem, index ) => {
                    return  (   await accumulator +
                                await trOfDeskSchema ( currentItem )
                
                            )
               }, 'tableOfxx' )*/
               ''
            }
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">
                    <a class="button float-right" href="?ruthenium=restful&type=forms&thing=create-desk&reader=human">Create Desk</a>
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}

module.exports  = tableOfDeskSchemas
const mark      = require ( '../modules/mark' )            
mark ( `tableOfDeskSchemas.js LOADED` )
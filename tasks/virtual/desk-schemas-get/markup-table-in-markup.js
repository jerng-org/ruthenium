const trInTable = require(`/var/task/tasks/virtual/desk-schemas-get/markup-tr-in-table.js`)


const rus = require('/var/task/modules/r-u-s.js')


const tableInMarkup = async(deskSchemasScan) => {

    const markup = `
    <table>
        <thead>
            
            <tr>
                <th colspan="3">
                
                    <p>
                        <div class="ru-card" style="background-color:#eee;">                        
                            <p>(change from table to card layout later)</p> 
                            <div style="color:#f00;">
                                <p>Current priority:</p>
                                <ul>
                                    <li>does routing look okay? - Good enough.</li>
                                    <li>does CRUD for desk-schemas work? - WIP</li>
                                    <li>does CRUD for desks work? - next WIP</li>
                                    <li>what's missing?</li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </p>
                    
                    
                    <p>System is currently aware of ${ deskSchemasScan.Count } Desk Schemas</p> 
                    
                    <a class="button float-left" href="${  
                        
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'create-desk-schema' ],
                            [ 'reader', 'human']
                        ])
                        
                    }">CREATE <i class="material-icons">fiber_new</i> Desk Schema</a>
                        
                </th>
            </tr>
            
            <tr>
                <th>Schema: Desk's Name</th>
                <th>Schema: Desk's Column Names</th>
                <th>Operations on each Desk Schema</th>
            </tr>
            
        </thead>
        <tbody style="vertical-align:top;">
            ${  
                await deskSchemasScan.Items.reduce ( 
                    async ( accumulator, currentItem, index ) => {
                        return  await accumulator + 
                                await trInTable ( currentItem )
                    }, 
                    ''  
               )
            }
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    Unallocated space.
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}
module.exports = tableInMarkup

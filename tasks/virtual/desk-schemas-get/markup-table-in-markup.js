const trInTable
    = require (`/var/task/tasks/virtual/desk-schemas-get/markup-tr-in-table.js`) 

const tableInMarkup = async ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            <tr>
                <th colspan="2">
                
                    <p>System is currently aware of ${ deskSchemasScan.Count } Desk Schemas</p>
                    <h6>
                        <div style="color:#f00; font-weight:700;">
                            <p>Current priority:</p>
                            <ul>
                                <li>
                                    <p>does routing look okay?</p>
                                    <p>
                                        <pre>
                                            We're currently working with something that looks like:
                                            
                                                - ? route=virtual
                                                - & type=(desk-schemas, or desks)
                                                - & thing=(UNDEFINED-for-desk-schemas, or DESK-NAME-for-desks)
                                                - & reader=(human, or machine)
                                            
                                            We could migrate to:
                                            
                                                -   "storage=virtual & type=Deskname     & thing=Rowid"
                                                -   "storage=actual  & type=desk-schemas & thing=Deskname"
                                                -   "storage=actual  & type=desk-cells   & thing=Deskname#Columnname,Rowid"
    
                                                (we've stopped caring if "type" and "Columnname" are singular or plural)        
                                                
                                                User-story:     
                                                
                                                1.  Define traits for desks, in desk-schemas 
                                                2.  All desks which share a desk-schema trait all work the same way
                                                
                                            But we really shouldn't bother until v2.
                                        </pre>
                                    </p>
                                </li>
                                <li>does CRUD for desk-schemas work?</li>
                                <li>does CRUD for desks work?</li>
                                <li>what's missing?</li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </h6>
                    <a class="button float-right" href="#">Create Desk</a>
    
                </th>
            </tr>
            <tr>
                <th><h3>Desk Name</h3></th>
                <th><h3>Column Names</h3></th>
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
                <td colspan="2">
                    <a class="button float-right" href="?route=virtual&type=forms&thing=create-desk-schema&reader=human">Create Desk</a>
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}
module.exports  = tableInMarkup
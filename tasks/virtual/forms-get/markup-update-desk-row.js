'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHtml = async ( DATA, deskCellsByRowID ) => (await Promise.all(Object.keys(deskCellsByRowID).map(

    // FOR EACH ROW ...

async rowID => `
<fieldset>

    ${  
        await DATA.RU.io.deskSchemasGet.Item.columns.reduce( 
            async ( accumulator, currentColumn, index, array ) => {
                
                // FOR EACH COLUMN ...
                
                return await accumulator +
                    await rus.html.input ( {
                        //id:     `desk-row-id`,
                        name:   `desk-cells[PUT]###${index}###[R]`,
                        type:   `hidden`,
                        value:  rowID
                    } ) +
                    await rus.html.input ( {
                        id:             currentColumn.name,
                        label:          currentColumn.name,
                        name:           `desk-cells[PUT]###${index}###[${ currentColumn.type }]`,
                        placeholder:    `-- enter a ${ rus.conf.labels.deskCellTypes[ currentColumn.type ] } --`,
                        value:          deskCellsByRowID[rowID][currentColumn.name]
                    } ) +
                    await rus.html.input ( {
                        type:   'hidden',
                        name:   `desk-cells[PUT]###${index}###[DHC]`,
                        value:  DATA.RU.io.deskSchemasGet.Item.name + '#' + currentColumn.name
                    } ) +
                    await rus.html.input ( {
                        type:   'hidden',
                        name:   `desk-cells[PUT]###${index}###[D]`,
                        value:  DATA.RU.io.deskSchemasGet.Item.name
                    } )
            },  // reducerFn
            
            ``  // initial value
            
        ) 
    } 

    <button type="submit"
            title="submit form: create object"
            >
            <i class='material-icons'>send</i> SUBMIT FORM</button>
                        
                        
</fieldset>
`
))).join(``)

const updateDeskRow = async(data) => {

    const deskCellsByRowID = rus.limbo.ddbDeskCellsByRowID(
        data.RU.io.deskSchemasGet.Item,
        data.RU.io.deskCellsQuery.Items)

    return `
    
        <h2><code>${ data.RU.io.deskSchemasGet.Item.name }</code> : object update </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [
                    [ 'route','virtual' ], 
                    [ 'type','desks' ], 
                    [ 'thing', data.RU.io.deskSchemasGet.Item.name ], 
                    [ 'form-method','PATCH' ] 
                ] ),
                innerHtml: await innerHtml(data, deskCellsByRowID),
                class: 'ru-card'
            } ) 
        }
    `

}
module.exports = updateDeskRow
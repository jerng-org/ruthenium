'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHTML = async DATA => `
<fieldset>

    ${  
        await DATA.RU.io.deskSchemasGet.Item.columns.reduce( 
            async ( accumulator, currentValue, index, array ) => {
                return await accumulator + 
                    await rus.html.input ( {
                        id:             currentValue.name,
                        label:          currentValue.name,
                        name:           `desk-cells###${index}###[${ currentValue.type }]`,
                        placeholder:    `-- enter a ${ rus.conf.labels.deskCellTypes[ currentValue.type ] } --`
                        
                    } ) +
                    await rus.html.input ( {
                        type:   'hidden',
                        name:   `desk-cells###${index}###[DHC]`,
                        value:  DATA.RU.io.deskSchemasGet.Item.name + '#' + currentValue.name
                    } ) +
                    await rus.html.input ( {
                        type:   'hidden',
                        name:   `desk-cells###${index}###[D]`,
                        value:  DATA.RU.io.deskSchemasGet.Item.name
                    } )
            },
            `` /* initial value */
        )
    } 

    <button type="submit"
            title="submit form: create object"
            >
            <i class='material-icons'>send</i> SUBMIT FORM</button>
                        
                        
</fieldset>
`

const createDeskRow = async ( data ) => {
    
    return `
    
        <h2><code>${ data.RU.io.deskSchemasGet.Item.name }</code> : object creation </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [
                    [ 'route','virtual' ], 
                    [ 'type','desks' ], 
                    [ 'thing', data.RU.io.deskSchemasGet.Item.name ], 
                    [ 'form-method','PATCH' ] 
                ] ),
                innerHTML: await innerHTML(data),
                class: 'ru-card'
            } ) 
        }
    `
}
module.exports = createDeskRow
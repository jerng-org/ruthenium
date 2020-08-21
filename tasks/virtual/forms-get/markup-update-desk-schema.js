'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHTML = async () => ``

const updateDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>creation</code> </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [ 
                    [ 'route','virtual' ], 
                    [ 'type','desk-schemas' ] 
                ] ),
                innerHTML: await innerHTML()
            } ) 
        }
    `
    
}
module.exports = updateDeskSchema
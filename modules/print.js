'use strict'

const mark = require('/var/task/modules/mark.js')

const node = { util : require('util') }

const print = {


    dataDebug: async rutheniumDataObject => {

        return `
DEBUG HIGHLIGHTS:
                
[ data.RU.errors ] renders ${
    await print.inspectInfinity ( rutheniumDataObject.RU.errors ) }                 

[ Object.keys ( data ) ] renders ${ 
    typeof rutheniumDataObject == 'object'
    && rutheniumDataObject != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject }`
}                 

[ Object.keys ( data.RU ) ] renders ${ 
    typeof rutheniumDataObject.RU == 'object' 
    && rutheniumDataObject.RU != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU }`
}                 

[ Object.keys ( data.RU.request ) ] renders ${
    typeof rutheniumDataObject.RU.request == 'object' 
    && rutheniumDataObject.RU.request != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.request ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.request }`
}

[ Object.keys ( data.RU.signals ) ] renders ${
    typeof rutheniumDataObject.RU.signals == 'object' 
    && rutheniumDataObject.RU.signals != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.signals ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.signals }`
}

[ Object.keys ( data.RU.io ) ] renders ${
    typeof rutheniumDataObject.RU.io == 'object' 
    && rutheniumDataObject.RU.io != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.io ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.io }`
}

[ Object.keys ( data.RU.response ) ] renders ${ // READONLY for DEBUG
    typeof rutheniumDataObject.RU.response == 'object' 
    && rutheniumDataObject.RU.response != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.response ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.response }`
}

DEBUG EVERYTHING:

[ data.RU ] renders ${
    await print.inspectInfinity ( rutheniumDataObject.RU ) }                 

[ data.LAMBDA ] renders ${
    await print.inspectInfinity ( rutheniumDataObject.LAMBDA ) }                 
`
        // end string
    },

    inspectInfinity: async object => node.util.inspect(object, { depth: Infinity }),

    stringify4: async object => (`(rus.print.stringify4( object ) returned):
` + JSON.stringify(object, null, 4)).replace(/\\n/g, '\n'),

    xml300: async xmlString =>
        (xmlString.slice(0, 300) + '... [POSSIBLY TRUNCATED]')
        .replace(/</g, '[')


}

module.exports = print
mark(`~/modules/print.js LOADED`)

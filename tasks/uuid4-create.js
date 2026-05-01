import rus from "../modules/r-u-s.js";

'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()
const uuid4Create = async(data) => {

    data.RU.signals.noLayout = true

    const quantity = data.RU.request.queryStringParameters.quantity ?
        data.RU.request.queryStringParameters.quantity :
        1

    data.RU.signals.sendResponse = { body: JSON.stringify( 
        (await Promise.allSettled( Array.from ( Array( Number(quantity) )).map( async _ => await rus.uuid4() ) ) ).map( a => a.value ) 
    ) 
        
    } 

    rus.mark(`EXECUTED`)
}
// manipulate (data.RU), for example
// no need to return (data)
export default uuid4Create;
rus.mark('LOADED')
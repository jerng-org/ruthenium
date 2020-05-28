'use strict'
const rutheniumReducer = async (    DATA_IN_PROMISE, 
                                    CURRENT_MIDDLEWARE, 
                                    INDEX,
                                    MIDDLEWARE_QUEUE ) => { 

        const DATA                  = await DATA_IN_PROMISE
        
        try { 
            const intermediateData  = await CURRENT_MIDDLEWARE ( DATA )
            
            /* THROWN? This line does not run, if CURRENT_MIDDLEWARE erred */

            // Validation: as middlewares may return nonsense
            if (        typeof intermediateData == 'object'
                    &&  intermediateData.LAMBDA
                    &&  intermediateData.RU                    ) 
            {
                return  intermediateData
                        // ordinary;
            }
            else 
            if (        INDEX + 1 == MIDDLEWARE_QUEUE.length )
            { 
                
                return  intermediateData 
                        // don't complain about the last middleware in queue;
            }
            else        // complain loudly
            {           
///////////////////////////////////////////////////////////////////////////////

console.warn ( intermediateData )
const thingType = typeof intermediateData

throw Error (   `ruthenium.js : 
                
    a middleware, (${ ( CURRENT_MIDDLEWARE.name
                        ?   CURRENT_MIDDLEWARE.name
                        :   'DID_YOU_NAME_YOUR_MIDDLEWARES ?').toUpperCase() }), 
    
    ... returned an unconventional ( intermediateData ): (
${ 
    JSON.stringify ( {
        intermediateData_TYPE:  thingType,
        TO_STRING:              (       thingType == 'object'
                                    &&  intermediateData.toString
                                )   
                                ?   intermediateData.toString()
                                :   'toString not defined on THE_THING',
        intermediateData:       intermediateData,
        
    }, null, 4 ) 
}
        
    );
    we expected Object.keys ( intermediateData ) to include 'LAMBDA' and 'RU';
    
    Here's DATA before it was operated on by the faulty middleware:
    
    ${ JSON.stringify ( DATA, null, 4 ) }
`)

/*  More sensitive, related, information:

    (1)        
        util.inspect ( CURRENT_MIDDLEWARE, { 
                depth:      Infinity, 
                showHidden: true
        } )
        
    (2)
        CURRENT_MIDDLEWARE.toString().slice( 0, 100 )
*/

///////////////////////////////////////////////////////////////////////////////
            
            }
            
        } 
        catch (e) 
        {
            console.error ( e )
            console.log ( DATA.RU.errors )
            DATA.RU.errors.push ( {
                thrown:     e,
                'typeof':   typeof e,
                stack:      e.stack
            } )

            return DATA
        }
    }
module.exports = rutheniumReducer
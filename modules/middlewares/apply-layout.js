'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const defaultLayoutTaskName = 'layout'

const applyLayout = async ( data ) => {

    //  This layer of if-elses should be isomorphic with (compose-response.js);
    
    //  !!! IMPORTANT !!!
    //
    //  (data.RU.signals.noLayout) is an explicit abortion, similar in function
    //  with (compose-response.js)'s use of the explicit 
    //  (data.RU.signals.sendResponse);
    
    if ( data.RU.response )
    {
        if (        data.RU.signals.redirectRoute 
                ||  data.RU.signals.sendBlob
                ||  data.RU.signals.noLayout        )    
        { 
            return data      
        }
    
        else
        if ( data.RU.signals.layoutMarkupName )
        {
            // UNIMPLEMENTED
        }
        
        else
        if ( data.RU.signals.layoutTaskName )
        {
            // If it has been set by the Task, or at the router middleware, then ignore the default value.
            data.RU.signals.layoutTaskName =    data.RU.signals.layoutTaskName 
                                                ? data.RU.signals.layoutTaskName
                                                : defaultLayoutTaskName
            
            data.RU.signals.inferredLayoutMarkupName
                = data.RU.signals.layoutTaskName + '-markup'
                
            // UNIMPLEMENTED

        }
        
    }
    else
    {
        throw   Error (`(middlewares/apply-layout.js) found that 
                (data.RU.response) is falsy. Not sure how to proceed.
                This is usually not a problem as it should be initiated at 
                (ruthenium.js); and it should be caught by (compose-response.js)
                before this middleware, anyway.`)
    }
    
    
    return data
}

module.exports = applyLayout
rus.mark (`apply-layout.js LOADED`)


/*  Of course, to nullify the effects of this middleware, or to have "no layout"
 *  at any point in the pipeline, simply (delete data.RU.signals.layoutTaskName);
 *
 *  Most of this logic should be ripped out and moved to its own middleware file
 *  which runs after (compose-response.js)
 *
 *  0. Notes on LAYOUTs, LAYOUT MARKUPs, and their interaction with other tasks/markups 
 * 
 *  1.
 *  DEFAULT :   OPTIMISATION : "completely" de-coupled (task, layout)
 *  
 *  Layouts and task+markup should be treated as separate siloes. In such a case,
 *  tasks should avoid getting data from (data.RU.io.layoutXYZ). In this case 
 *  layouts can then be processed AFTER other tasks, as this avoids unnecessary
 *  processing if the task wants to respond with a non-markup (therefore non-
 *  layout requiring) response. So layouts maybe would be processed in 
 *  (compose-response.js) which runs after (router.js).
 *
 *  To render the layout without contents, you should probably send an explicit
 *  (&nbsp;).
 *
 *  2. TODO
 *  OPTIONAL:   OPTIMISATION : tightly-coupled (task, layout)
 *  
 *  Layouts should get processed BEFORE other tasks, as layouts are more 
 *  general in scope. This enables (data.RU.io.layoutXYZ) to be accessed
 *  somewhat predictably (?!) by tasks which use this layout, thereby reducing
 *  io. So layouts maybe would be processed in (router.js) before task
 *
 *  End-goal would be to have at least these two options.
 *
 *  3.
 *  PROCESS MAP
 *
 *  3.1. (~/modules/middlewares/layout-set-default.js)
 *
 *      SETS (data.RU.signals.layoutTaskName)
 *
 *  3.2. (~/modules/middlewares/router.js)
 *
 *      AFTER (data.RU.signals.taskName) has been used to obtain a task and
 *      AFTER that task has run,
 *
 *      GETS (data.RU.signals.layoutTaskName),
 *      RUNS the corresponding LAYOUT TASK, if it can be found, which MAY ...
 *
 *          SET (data.RU.io.layoutTaskName)
 *
 *  3.3. (~/modules/middlewares/compose-response.js)
 *
 *      DEFINES a function (wrapStringWithLayout), which :
 *
 *          -   GETS (data.RU.signals.layoutTaskName) [refer to 3.1.]
 *          -   INFERS and SETS (data.RU.signals.inferredLayoutMarkupName)
 *          -   RUNS the corresponding LAYOUT MARKUP, if it can be found, which MAY ...
 *
 *              -   GET (data.RU.io.layoutTaskName) [refer to 3.2.], and
 *              -   GET (data.RU.io.layoutTaskName) [refer to 3.2.], and
 *              -   RETURN
 *
 *
 *
 *
 *          -   RETURN a result to (data.RU.response.body)
 *
 *      GETS (data.RU.signals.layoutTaskName),
 *
 */

        /*
        if (        data.RU.signals.layoutTaskName
                &&  ( data.RU.signals.layoutTaskName in tasks ) )
        {
            // Important things happen here, preparing (data.RU.io) for layout-task-markup.
            await tasks [ data.RU.signals.taskName ]( data )   
        
        }
        
        else
        {
            throw Error ( `Could not find (${ data.RU.signals.layoutTaskName 
                          }) in the tasks directory. Or (layoutTaskName) was
                          falsy.` )
        }
        */


/*  Refer to "0. Notes on LAYOUTs, LAYOUT MARKUPs, and their interaction with 
 *  other tasks/markups" in (layout-set-default.js)
 */

/*  Example of Usage :  data.RU.response.body 
 *                          = wrapStringWithLayout ( data.RU.response.body )
 *
 */
 /*
const wrapStringWithLayout = async ( _data, _string ) => {

    if ( _data.RU.signals.layoutTaskName )
    {
        _data.RU.signals.inferredLayoutMarkupName
            = _data.RU.signals.layoutTaskName + '-markup'
            
        if ( _data.RU.signals.inferredLayoutMarkupName in markups )
        {
            await markups[_data.RU.signals.inferredLayoutMarkupName](_data)
        }
        else
        {
            throw Error (   `(compose-response.js),(wrapStringWithLayout) could not 
                            find (${ 
                            _data.RU.signals.inferredLayoutMarkupName 
                            }.js) in the markups directory. That name was specified at
                            (data.RU.response.inferredLayoutMarkupName).
                            
                            The following may be informative:
                            
                            ${ await rus.additionalRequestInformation ( _data )}`)
        }
    }
    else
    {   
        throw Error (   `(compose-response.js),(wrapStringWithLayout) was called; 
                        (data.RU.signals.layoutTaskName) was falsy - this is
                        normally set to a default value in (layout-set-default.js),
                        but the value may have been unset/erased between there 
                        and this line; if you wish for (wrapStringWithLayout)
                        to return the given string as-is, then consider creating
                        a layout which adds nothing to the given string, and 
                        then explicitly set that layout's name in 
                        (data.RU.signals.layoutTaskName). Otherwise, simply do
                        not run this function;`)
    }

}
*/

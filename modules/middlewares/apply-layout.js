'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const defaultLayoutTaskName = 'layout'

//  THIS SECTION REQUIRES REFACTORING TOWARDS ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION REQUIRES ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION IS REDUNDANT WITH (compose-response.js)
const markups = {}
const markupFileNames = rus.node.fs.readdirSync('/var/task/tasks', {
    withFileTypes: true
})
markupFileNames.forEach((current, index, array) => {

        rus.frameworkDescriptionLogger.callStarts()

        if (current.isFile()) {

            // console.warn(`searching in:`, current.name.slice (0, -3), `for`, '/var/task/tasks/' + current.name )

            markups[current.name.slice(0, -3)] = require('/var/task/tasks/' + current.name)
        }

        rus.frameworkDescriptionLogger.callEnds()

    } // , thisArg  
)

//  THIS SECTION REQUIRES REFACTORING TOWARDS ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION IS REDUNDANT WITH (router.js)
const tasks = {}
const taskFileNames = rus.node.fs.readdirSync('/var/task/tasks')
taskFileNames.forEach((current, index, array) => {

    rus.frameworkDescriptionLogger.callStarts()

    if (current.toLowerCase().slice(-3) == '.js') {
        tasks[current.slice(0, -3)] = require('/var/task/tasks/' + current)
    }

    rus.frameworkDescriptionLogger.callEnds()

} /* , thisArg */ )


/*  SUMMARY:    (apply-layout.js) will take (data.RU.response.body) and replace it
 *              with a LAYOUT MARKUP which includes whatever was previously in
 *              (data.RU.response.body);
 *
 *              (apply-layout.js) is controlled by (data.RU.signals.VARIOUS);
 * 
 *  0. Notes on LAYOUTs, LAYOUT MARKUPs, and their interaction with other tasks/markups 
 * 
 *  1.
 *  DEFAULT :   OPTIMISATION : "completely" de-coupled (task, layout)
 *  
 *  Layouts and task+markup should be treated as separate siloes. In such a case,
 *  non-layout tasks should avoid getting data from (data.RU.io.layoutXYZ). In this case 
 *  layouts can then be processed AFTER other tasks, as this avoids unnecessary
 *  processing if the task wants to respond with a non-markup (therefore non-
 *  layout requiring) response. So layouts maybe would be processed in 
 *  (apply-layout.js) which runs after (compose-response.js).
 *
 *  Generally, the LAYOUT-MARKUP will refer to (data.RU.response.body) and
 *  incorporate it into some surrounding markup before returning the entire 
 *  string.
 *
 *  To render the layout without contents, you should probably set an explicit
 *  (&nbsp;) at (data.RU.response.body)
 *
 *  2. TODO
 *  OPTIONAL:   OPTIMISATION : tightly-coupled (task, layout)
 *  
 *  Layouts should get processed BEFORE other tasks, as layouts are more 
 *  general in scope. This enables (data.RU.io.layoutXYZ) to be accessed
 *  somewhat predictably (?!) by tasks which use this layout, thereby reducing
 *  io. So layouts maybe would be processed in (router.js) before task
 *
 *  Working-goal would be to have at least these two options.
 *
 */

const applyLayout = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()

    //  This layer of if-elses should be isomorphic with (compose-response.js);

    //  !!! IMPORTANT !!!
    //
    //  (data.RU.signals.noLayout) is an explicit abortion, similar in function
    //  with (compose-response.js)'s use of the explicit 
    //  (data.RU.signals.sendResponse);

    if (data.RU.response) {
        if (data.RU.signals.redirectRoute ||
            data.RU.signals.sendBlob ||
            data.RU.signals.noLayout) {
            rus.frameworkDescriptionLogger.callEnds()
            return data // EXIT POINT 1
        }

        else
        if (data.RU.signals.layoutMarkupName) {
            if (data.RU.signals.layoutMarkupName in markups) {
                //  Because (data.RU.signals.layoutTaskName) is NOT demanded,
                //  presumably (data.RU.io.layoutTaskName) will be unset.
                //
                //  However, (data.RU.response.body) should have been set in
                //  (compose-response.js) by this point, so a layout-markup
                //  CAN refer to it;
                data.RU.respose.body =
                    await markups[data.RU.signals.layoutMarkupName](data)

                rus.frameworkDescriptionLogger.callEnds()
                return data // EXIT POINT 2
            }
            else { // EXIT POINT 2F
                rus.frameworkDescriptionLogger.callEnds()
                throw Error(`(middlewares/apply-layout.js) could not find (${ 
                        data.RU.signals.layoutMarkupName 
                        }.js) in the (~/tasks) directory. That name was specified at
                        (data.RU.signals.layoutMarkupName).
                        
                        The following may be informative:
                        
                        ${ await rus.additionalRequestInformation ( data ) }`)
            }
        }
        else {
            // If it has been set by the Task, or at the router middleware, then ignore the default value.
            data.RU.signals.layoutTaskName = data.RU.signals.layoutTaskName ?
                data.RU.signals.layoutTaskName :
                defaultLayoutTaskName

            if (data.RU.signals.layoutTaskName) {
                if (data.RU.signals.layoutTaskName in tasks) {
                    //  Important things happen here, preparing (data.RU.io) for task-markup.
                    await tasks[data.RU.signals.layoutTaskName](data)
                }
                else { // EXIT POINT 3F1    
                    rus.frameworkDescriptionLogger.callEnds()
                    throw Error(`Could not find (${ 
                            data.RU.signals.layoutTaskName 
                            } ) in the tasks directory.`)
                }

                data.RU.signals.inferredLayoutMarkupName = data.RU.signals.layoutTaskName + '-markup'

                if (data.RU.signals.inferredLayoutMarkupName in markups) {
                    //  Because (data.RU.signals.layoutTaskName) IS demanded,
                    //  presumably (data.RU.io.layoutTaskName) will be set.
                    //
                    //  (data.RU.response.body) should have been set in
                    //  (compose-response.js) by this point, so a layout-markup
                    //  CAN refer to it;
                    data.RU.response.body =
                        await markups[data.RU.signals.inferredLayoutMarkupName](data)

                    rus.frameworkDescriptionLogger.callEnds()
                    return data // EXIT POINT 3
                }
                else { // EXIT POINT 3F2
                    rus.frameworkDescriptionLogger.callEnds()
                    throw Error(`(middlewares/apply-layout.js) could not find (${ 
                            data.RU.signals.inferredLayoutMarkupName 
                            }.js) in the (~/tasks) directory. That name was specified at
                            (data.RU.signals.inferredLayoutMarkupName).
                            
                            The following may be informative:
                            
                            ${ await rus.additionalRequestInformation ( data ) }`)
                }
            }
        }
        // else-block ends
    }
    // if data.RU.response

    else { // EXIT POINT 4
        rus.frameworkDescriptionLogger.callEnds()
        throw Error(`(middlewares/apply-layout.js) found that 
                (data.RU.response) is falsy. Not sure how to proceed.
                This is usually not a problem as it should be initiated at 
                (ruthenium.js); and it should be caught by (compose-response.js)
                before this middleware, anyway.`)
    }
    // if data.RU.response, else-block ends

}

module.exports = applyLayout
rus.mark(`~/modules/middlewares/apply-layout.js LOADED`)

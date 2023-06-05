'use strict'

const rus = require('/var/task/modules/r-u-s.js')

//  THIS SECTION REQUIRES REFACTORING TOWARDS ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION IS REDUNDANT WITH (apply-layout.js)
const tasks = {}
const taskFileNames = rus.node.fs.readdirSync('/var/task/tasks')
taskFileNames.forEach((current, index, array) => {
    if (current.toLowerCase().slice(-3) == '.js') {
        tasks[current.slice(0, -3)] = require('/var/task/tasks/' + current)
    }
} /* , thisArg */ )

const router = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()

    /*  By this point in the pipeline, (data.RU) should provide:    
     *       (.headers)
     *       (.headers.cookies)
     *       (.queryStringParameters)
     *       (.formStringParameters)
     *
     *   And, (data.LAMBDA) also provides:
     *       (.event)
     *       (.context)
     *
     *   So, any of these may be used by (DetermineTaskName)
     */

    // DIY here
    const customDetermineTaskName = undefined

    // Default here
    const defaultDetermineTaskName = () => {

        rus.frameworkDescriptionLogger.callStarts()

        if (data.RU.request.queryStringParameters.route &&
            data.RU.request.queryStringParameters.route[0]) {
            switch (data.RU.request.queryStringParameters.route[0]) {

                /***************************************************************
                 *  TODO :  improve the documentation in this area, to explain
                 *          where the << cases >> are supposed to be written,
                 *          before they are read here.
                 ***************************************************************
                 */

                case ('initial'):
                    data.RU.signals.taskName = 'initial'
                    break

                case ('virtual'):
                    data.RU.signals.taskName = 'virtual'

                    /* Single Item: METHOD, &type=M, &thing=N, &value/s=V
                     * Batch:       METHOD, &batch=[ 
                     *                          [ { method: type: thing: etc. } ]
                     *                      ]
                     * Transaction: METHOD, &batch=[], transaction=1  
                     *
                     *  TODO : Check : This proposal is not yet implemented?
                     */

                    break

                case ('text'):
                    data.RU.signals.taskName = 'send-text'
                    break

                case ('file'):
                    data.RU.signals.taskName = 'send-blob'
                    break

                case (undefined):
                    break

                default:
                    data.RU.signals.taskName = data.RU.request.queryStringParameters.route[0]
                    // request ?query parameter was set, but is not one of the above cases;
            }
        }

        /*  IF (queryStringParameters.route[0] was truthy)
         *  THEN
         *  EITHER  (queryStringParameters.route[0] was not defined)
         *  OR      (... it was defined as a falsy value, then conferred to .signals.taskName )
         *
         */

        if (!data.RU.signals.taskName) {
            // request ?query parameter was not set;
            data.RU.signals.redirectRoute = 'initial'

                +
                `&reader=` +
                (data.RU.request.queryStringParameters.reader ?
                    data.RU.request.queryStringParameters.reader[0] :
                    'human') +
                (data.RU.request.queryStringParameters.message ?
                    `&message=(via router.js)${data.RU.request.queryStringParameters.message[0]}` :
                    '')
        }
        rus.frameworkDescriptionLogger.callEnds()
    }

    /*******************************************************************************
     *  The Rails school of architecture might call this the "dispatcher";
     *
     *  EXECUTION BEGINS
     *
     *  Determine the task.
     */

    customDetermineTaskName
        ?
        customDetermineTaskName() :
        defaultDetermineTaskName()

    /* redirects: short-circuit
     */
    if (data.RU.signals.redirectRoute) {

        rus.frameworkDescriptionLogger.callEnds()

        return data
    }

    /* no redirects: 
     *
     *      Run the task, if its module is found.
     *
     *      TODO: perhaps we want another reducer here for multiple tasks?
     */

    else
    if (data.RU.signals.taskName in tasks) {

        await tasks[data.RU.signals.taskName](data)
        // Important things happen here, preparing (data.RU.io) for task-markup.

    }
    else {
        console.error(`(router.js) Could not find (${ data.RU.signals.taskName  }) in the tasks directory.`)
        await tasks['status-404'](data)
    }

    rus.frameworkDescriptionLogger.callEnds()

    /* EXECUTION ENDS
     ******************************************************************************/

    return data
}
module.exports = router

rus.mark('LOADED')
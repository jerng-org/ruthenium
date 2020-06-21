'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

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

const layoutSetDefault = async ( data ) => {
/*
    data.RU.signals.layoutTaskName = 'layout'
    */
    return data
}

module.exports = layoutSetDefault
rus.mark (`layout-set-default.js LOADED`)
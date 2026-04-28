import rus from "/var/task/modules/r-u-s.js";

'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()
const templateTask = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )


    rus.mark ( `~/tasks/_template-task.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)
export default templateTask;
rus.mark('LOADED')
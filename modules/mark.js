'use strict'

const conf = require(`/var/task/configuration.js`)
const customLogger = require(`/var/task/modules/custom-logger.js`)

const _log = conf.performance ? console.log : _ => _

// The following code is written for the `nodejs` (12.x) runtime on AWS Lambda.
// FWIW: `nodejs.process` also has: .resourceUsage() and .httime.bigint()

//  `INVOCATION` below refers to invocation of the LAMBDA FUNCTION

///////////////////////////////////////////////////////////////////////////////

/*  EXAMPLE OF USE: 
 *
   'use strict'
    const P = require ( './mark.js')
    
    exports.handler = async (event, context) =>  {
        
        L.mark ( `handler BEGAN`, true )
            // FIRST CALL MUST SET THIRD PARAMETER TO TRUE
            
        const AWS = require ( 'aws-sdk' )
        
        L.mark ( `AWS-SDK LOADED` )
            // SUBSEQUENT CALLS MUST SET THIRD PARAMETER TO FALSY

        // do something else
        
        L.mark ( `Did something else.`)
        
        return "a response"
    }

*
*/

//
//
//
//


let newExecutionContext = true
let nthInvocation
let preInvocationTime
let preInvocationCPUsum

//
//
//
//
//  Measuring wallclock run time.
//      There exists a similar Web API
const { performance } = require('perf_hooks')
let lastTime
let invocationStartTime

//
//
//
//
//  Measuring RAM usage.
//      `node.process.memoryUsage` keys: rss, heapTotal, heapUsed, external
//      AWS Lambda: Billed memory seems to include 35-40MB over ['rss'].
const memoryUsageKey = 'rss'
let lastMem = process.memoryUsage()[memoryUsageKey]
// There exists a similar Web API

//
//
//
//
//  Measuring CPU time consumed (a subset of wallclock time).
//      Using `process.cpuUsage`
//      There exists NO similar Web API
let lastCPUsum
let invocationStartCPUsum

//
//
//
//  Core functionality:

const mark = async (taskLabel, firstInHandler) => {

    if (newExecutionContext) {
        if (firstInHandler) {
            const preInvocationCPU = process.cpuUsage()
            preInvocationCPUsum = preInvocationCPU.user +
                preInvocationCPU.system
            preInvocationTime = performance.now()

            _log(`⚠ mark.js : these figures are loose and fast; ⚠`)
            _log(`⚠ Lambda does not charge for preinvocation runtime; nodejs overhead seems to be 30MB; ⚠`)
            _log(
                String('').padEnd(70, `-`)
            )
            _log(

                String(`"${memoryUsageKey}"`)
                .padStart(10, ` `) +

                String(`prior:` + Math.round(preInvocationCPUsum / 1000))
                .padStart(14, ` `) +

                String(`prior:` + Math.round(preInvocationTime))
                .padStart(12, ` `) +

                String(`throttle⚠️ ㇏㇏`)
                .padStart(16, ` `)
            )
            _log(
                String('').padEnd(70, `-`)
            )

        }
        else {
            throw new Error(`mark.js; mark(_,_,firstInHandler); firstInHandler needs to 
                    be set to true, if this is the first time you are calling 
                    (mark); you can view an example in the comments of mark.js`)
        }
    }

    if (firstInHandler) {
        nthInvocation = 0

        invocationStartTime = performance.now()
        const invocationStartCPU = process.cpuUsage()
        invocationStartCPUsum = invocationStartCPU.user +
            invocationStartCPU.system
        _log(`⚠ mark.js : these figures are loose and fast; ⚠`)
        _log(`⚠ Lambda does not charge for preinvocation runtime; nodejs overhead seems to be 30MB; ⚠`)
        _log(
            String('').padEnd(70, `-`)
        )
        _log(
            String(`RAM:`)
            .padStart(10, ` `) +
            String(`CPU🕓:`)
            .padStart(14, ` `) +
            String(`WALL🕓:`)
            .padStart(12, ` `) +
            String(`[CPU/WALL]🕓:`)
            .padStart(16, ` `)
        )
        _log(
            String(`(Δ,Σ) MB`)
            .padStart(10, ` `) +
            String(`(Δ,Σ) ms`)
            .padStart(14, ` `) +
            String(`(Δ,Σ) ms`)
            .padStart(12, ` `) +
            String(`(Δ,Σ) %`)
            .padStart(16, ` `)
        )
        _log(
            String('').padEnd(70, `-`)
        )
    }
    nthInvocation++

    lastTime = firstInHandler ?
        0 :
        lastTime
    let tempTime
    let dTime

    lastCPUsum = firstInHandler ?
        0 :
        lastCPUsum
    let tempCPU
    let tempCPUsum
    let dCPUsum

    let tempMem

    _log(

        //
        //
        //
        //  (Block 1)

        //  d : stage-to-stage difference in memory (whichever metric you keyed);
        //  t : to-stage total memory consumed for (whichever metric you keyed );

        // delta of RAM usage;

        Math.round( // decimal point formatting;

            ((tempMem = process.memoryUsage()[memoryUsageKey]) -
                lastMem)

            /
            Math.pow(1024, 2) // B to MB conversion;

        )
        .toString().padStart(5, ` `) +

        // total RAM usage;

        Math.round( // decimal point formatting;

            (lastMem = tempMem) /
            Math.pow(1024, 2) // B to MB conversion;:
        ).toString().padStart(5, ` `) +

        //
        //
        //
        //  (Block 2)

        //  dCPU : stage-to-stage difference in CPU time consumed; 
        //  tCPU : to-stage total CPU time consumed;

        // delta of CPU time consumed;

        Math.round(
            (dCPUsum = (tempCPU = process.cpuUsage(),
                    tempCPUsum =
                    tempCPU.user +
                    tempCPU.system -
                    invocationStartCPUsum
                ) -
                lastCPUsum
            ) /
            1000 // microsecond to millisecond conversion;
        ).toString().padStart(7, ` `) +

        // total CPU time consumed;

        Math.round(
            (lastCPUsum = tempCPUsum) /
            1000 // microsecond to millisecond conversion;
        ).toString().padStart(7, ` `) +

        //
        //
        //
        //  (Block 3)

        //  dRUN : stage-to-stage difference in wallclock time in milliseconds;
        //  tRUN : to-stage total wallclock time in milliseconds;

        // delta of runtime;
        Math.round(dTime =
            (tempTime = performance.now() -
                invocationStartTime
            ) - lastTime

        ).toString().padStart(6, ` `) +

        // total runtime;
        Math.round(
            lastTime = tempTime
        ).toString().padStart(6, ` `) +

        //
        //
        //
        //  (Block 4a)

        //  ( delta of CPU time consumed / delta of runtime ); 
        //  stage-to-stage CPU allocation; volatile; subject to long-term average;

        (Math.round(dCPUsum / dTime * 10) /
            10000
        ).toString().padStart(8, ` `) +

        //
        //
        //
        //  (Block 4b)

        //  ( total CPU time consumed / total runtime );
        //  to-stage average CPU allocation; the long-term average;
        //  AWS Lambda's fractional CPU allocation, based on max memory limit;
        //
        //  for example, a function allocated       128     ( MB of RAM ),
        //      is correspondingly allocated        0.125   ( vCPUs ),
        //                                      ==  80      ( us of CPU time, per 
        //                                                    ms of runtime );

        (Math.round(lastCPUsum / lastTime * 10) /
            10000
        ).toString().padStart(8, ` `) +

        //
        //
        //
        //

        ` ` + taskLabel +
        (nthInvocation % 3 ? "" : "\n")
    )

    newExecutionContext = false

}

module.exports = conf.performance ? mark : _ => _

mark(`~/modules/mark.js LOADED`, true)

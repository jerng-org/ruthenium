'use strict'

/*  WHAT THIS CODE DEMONSTRATES: during the initialization phase of an AWS
    Lambda function's invocation ... you can commit the Deployment Package
    to GitHub. 

Lambda layer        :   https://github.com/lambci/git-lambda-layer

Git repository      :   https://github.com/jerng-org/ruthenium.git

    This repository must BELONG to a (GitHub Organization), in order to obtain
    granular role-based access control.

Git branch          :   jerng-machines-writeable

    Set a (Branch Protection Rule) which restricts who can push to 
    (jerng-machines-writeable), enabling only the user (jerng-machines).

    Meanwhile, set a (Branch Protection Rule) which restricts who can push 
    to (master), enabling (at least one userx).
    
Git user            :   jerng-machines

Environmental variable with password 

                    :   $GITHUB_JERNG_MACHINES_USER_PASSWORD

*/

const rusMinus1 = require('/var/task/modules/r-u-s-minus-one.js')
const mark = require('/var/task/modules/mark.js')
const childProcess = require('child_process')


const lambdaGitCommit = commitMessage => {
    try {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        let notes = {}

        childProcess.execSync(
            'rm -rf /tmp/*', { encoding: 'utf8', stdio: 'inherit' })

        childProcess.execSync(
            `git clone -n --depth 1 -b ${ process.env.GITHUB_BRANCH } https://github.com/jerng-org/ruthenium.git`, { encoding: 'utf8', stdio: 'inherit', cwd: '/tmp' })

        mark(`~/io/lambda-git-commit.js Repository cloned ... `)
        ///////////////////////////////////////////////////////////////////////////////

        /*
        notes.rmClonedRepoFiles = childProcess.execSync(
            'rm -rf /tmp/ruthenium/*', 
            { encoding: 'utf8', stdio: 'inherit' })
        
        notes.lsClonedRepo = childProcess.execSync(
            'ls /tmp/ruthenium', 
            { encoding: 'utf8' }).split('\n')
        
        notes.lsaClonedRepo = childProcess.execSync(
            'ls -a /tmp/ruthenium', 
            { encoding: 'utf8' }).split('\n')
            
        notes.lsVarTask = childProcess.execSync(
            'ls /var/task', 
            { encoding: 'utf8' }).split('\n')
        */
        notes.cprVarTask = childProcess.execSync(
            'cp -r /var/task/* /tmp/ruthenium/', { encoding: 'utf8' }).split('\n')
        /*        
        notes.lsClonedRepoAfterCopy = childProcess.execSync(
            'ls', 
            { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

        notes.checkBranch = childProcess.execSync(
            'git branch', 
            { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

        notes.testEnv = childProcess.execSync(
            'echo $GITHUB_JERNG_MACHINES_USER_PASSWORD', 
            { encoding: 'utf8' }).split('\n')
        */

        notes.gitAdd = childProcess.execSync(
            'git add .', { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

        notes.gitCommmit = childProcess.execSync(
            `git -c user.name=jerng-machines commit -m "${ commitMessage }" `, { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

        notes.gitPush = childProcess.execSync(
            'git push https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PERSONAL_ACCESS_TOKEN@github.com/jerng-org/ruthenium.git', { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

        mark(`~/io/lambda-git-commit.js Execution complete `)
        ///////////////////////////////////////////////////////////////////////////////

        rusMinus1.frameworkDescriptionLogger.callEnds()

    }
    catch (e) { console.error(`gitCommit.js`, e.stack) }
}

module.exports = lambdaGitCommit
mark(`~/io/lambda-git-commit.js LOADED`)

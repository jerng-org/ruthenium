'use strict'

/*  WHAT THIS CODE DEMONSTRATES: during the initialization phase of an AWS
    Lambda function's invocation ... you can commit the Deployment Package
    to GitHub. 

Lambda layer        :   https://github.com/lambci/git-lambda-layer

Git repository      :   https://github.com/jerng-org/ruthenium.git

    This repository must BELONG to a (GitHub Organization)

Git branch          :   jerng-machines-writeable

    Set a (Branch Protection Rule) which restricts who can push to 
    (jerng-machines-writeable), enabling only the user (jerng-machines).

    Meanwhile, set a (Branch Protection Rule) which restricts who can push 
    to (master), enabling (at least one user)).
    
Git user            :   jerng-machines

Environmental variable with password 

                    :   $GITHUB_JERNG_MACHINES_USER_PASSWORD

*/

const mark          = require ( '../modules/mark' )            
const childProcess  = require('child_process')

const gitTestTask = async ( data ) => {

    childProcess.execSync(  
        'rm -rf /tmp/*', 
        { encoding: 'utf8', stdio: 'inherit' })

    childProcess.execSync(
        'git clone -b jerng-machines-writeable https://github.com/jerng-org/ruthenium.git', 
        { encoding: 'utf8', stdio: 'inherit', cwd: '/tmp' })

mark ( `gitTestTask.js Cloned into repository ...` )

    data.RU.io.rmClonedRepoFiles = childProcess.execSync(
        'rm -rf /tmp/ruthenium/*', 
        { encoding: 'utf8', stdio: 'inherit' })
/*
    data.RU.io.lsClonedRepo = childProcess.execSync(
        'ls /tmp/ruthenium', 
        { encoding: 'utf8' }).split('\n')
    
    data.RU.io.lsaClonedRepo = childProcess.execSync(
        'ls -a /tmp/ruthenium', 
        { encoding: 'utf8' }).split('\n')
        
    data.RU.io.lsVarTask = childProcess.execSync(
        'ls /var/task', 
        { encoding: 'utf8' }).split('\n')
*/        
    data.RU.io.cprVarTask = childProcess.execSync(
        'cp -r /var/task/* /tmp/ruthenium/', 
        { encoding: 'utf8' }).split('\n')
/*        
    data.RU.io.lsClonedRepoAfterCopy = childProcess.execSync(
        'ls', 
        { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

    data.RU.io.checkBranch = childProcess.execSync(
        'git branch', 
        { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

    data.RU.io.testEnv = childProcess.execSync(
        'echo $GITHUB_JERNG_MACHINES_USER_PASSWORD', 
        { encoding: 'utf8' }).split('\n')
*/

    data.RU.io.gitAdd = childProcess.execSync(
        'git add .', 
        { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')
        
    data.RU.io.gitCommmit = childProcess.execSync(
        'git -c user.name=jerng-machines commit -m "A MESSAGE" ', 
        { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

    data.RU.io.gitPush = childProcess.execSync(
        'git push https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PASSWORD@github.com/jerng-org/ruthenium.git', 
        { encoding: 'utf8', cwd: '/tmp/ruthenium' }).split('\n')

    // no need to return data
    
mark ( `gitTestTask.js Execution complete` )
}

module.exports = gitTestTask
mark ( `gitTestTask.js LOADED` )
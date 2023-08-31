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

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')

const conf = rusMinus1.conf
const mark = rusMinus1.mark
const childProcess = require('child_process')
const shellExports = `
    export PATH=$PATH:/opt/git/bin 
    export LD_LIBRARY_PATH=/opt/git/lib 
    `
/*  2023-08-30 : based on lambda layer
        "arn:aws:lambda:us-east-1:674588274689:layer:git-arm-lambda:11"

    1) the environmental variables, roughly :
    
        1.1) export PATH=$PATH:/opt/git/bin; 
            
            The following will fail with 
            " Unable to find remote helper for 'https' " :
    
                $ /path/to/bin/git clone etc.
    
            But the following will work :
    
                $ export PATH=$PATH:/path/to/bin
    
                $ git clone etc.
    
            It's probably because (git) is trying to call itself but can't find
            itself ... that's a horrible default behaviour ... but we know (git)
            has legacy issues.
            
        1.2) export LD_LIBRARY_PATH=/opt/git/lib; 
    
            This ensures (git) can find its (.so : shared object files)

    2) the files, roughly : 
     
        "Copy from yum's installation" and "compile yourself", refer to any
        live system based on the (disk image / ARN ) used by AWS Lambda when
        executing Lambdas on the ARM architecture. You can get find these 
        image ARNs in AWS' documentation, or simply try to run a similar Linux
        on EC2 with the same Graviton chips that AWS Lambda is using - look it
        up.
     
        lambda-layer.zip
         |
         +-git
           |
           +-bin
           | |
           | +-git ( you may want to compile this yourself, ~22MB, with --prefix=/opt/git :
           |
           |     ref : https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
           |
           |         sudo yum install -y \
           |         gcc \
           |         autoconf automake curl-devel \
           |         expat-devel gettext-devel \
           |         openssl-devel \
           |         perl-devel zlib-devel
           |         
           |             # git gets installed incidentally 
           |         
           |         wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.40.1.tar.gz
           |         
           |         tar -zxf git-2.40.1.tar.gz
           |         
           |         cd git-2.40.1
           |         
           |         ./configure --prefix=/opt/git --with-curl --with-openssl
           |         
           |         make all
           |         
           |         sudo make install
           |   )
           | 
           +-libexec
           | |
           | +-git-core
           |   |
           |   +-git-remote-https       ( ~2.2MB,   you can just copy this from yum's installation )
           |   +-git-submodule          ( ~10kB,    ibid. ) 
           |   +-git-submodule--helper  ( ~3.7MB,   ibid. )
           |   +-git-sh-setup           ( ~9kB,     ibid. )
           |   +-git-sh-i18n            ( ~2kB,     ibid. )
           |   +-git-sh-i18n--encsubst  ( ~2.2MB,   ibid. )
           |   
           +-lib
           | |
           | +-( you can copy these, perhaps as below, regarding FILENAME=git, git-remote-https :
           | 
           |     $   ldd FILENAME | \
           |         awk 'NF == 4 {print $3}; NF == 2 {print $1}' | \
           |         sed 's/^/cp /' | sed 's/$/ TARGETDIR/' | bash
           |   )
           |
           +-share
             |
             +-git-core
               |
               +-templates
                 |
                 +-( just copy these in from yum's installation, they are small )
     
 */
const lambdaGitCommit = commitMessage => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    rusMinus1.frameworkDescriptionLogger.more(`childProcess.execSync : currently
there is an implementation of conf.nodejs.childProcessStdio. However, the
documentation is not well understood at
https://nodejs.org/docs/latest-v18.x/api/child_process.html#optionsstdio . On
one hand it says, "pipe"|["pipe","pipe","pipe"] is the default, but on the other
hand it says, null|undefined|"inherit"|["inherit","inherit","inherit"] is the
default. Currently observed behaviour appears to match neither.`)

    rusMinus1.frameworkDescriptionLogger.fixme(`childProcess.execSync : usage here
has not been checked to ensure sanitisation; we should derisk from arbitrary
shell command execution`)

    try {

        mark('ATTEMPTING (git clone) ...')

        // TODO : upgrade this to foreach --recursive 
        console.log(
            childProcess.execSync(
                `
                ${ shellExports }
                
                # clear the way in /tmp
                rm -rf /tmp/* &&
                
                # clone and checkout superproject to /tmp/ruthenium
                git clone --depth 1 --recurse-submodules --shallow-submodules -b ${ process.env.GITHUB_BRANCH } https://github.com/jerng-org/ruthenium.git &&
                
                # scaffold a new worktree at /tmp/commit-this, which will later receive files to be committed
                mkdir /tmp/commit-this &&
                cp -r /tmp/ruthenium/.[^.]* /tmp/commit-this &&
                
                cd /tmp/ruthenium &&
                
                git submodule foreach '
                    mkdir -p /tmp/commit-this/$sm_path &&
                    cp -r .[^.]* /tmp/commit-this/$sm_path
                    '
                
## DEBUG results
# cd /tmp/commit-this &&
# ls -la 1>&2 &&
# git submodule foreach 'echo $PWD && ls -la 1>&2' 1>&2
                
                `, {
                    encoding: 'utf8',
                    stdio: conf.nodejs.childProcessStdio,
                    cwd: '/tmp'
                }
            )
        )

/*
        console.log(
            childProcess.execSync(
                `echo "BEFORE COPY" 1>&2 && ls -ah /tmp/ruthenium 1>&2`, { 
                    encoding: 'utf8',
                    stdio: conf.nodejs.childProcessStdio,
                }
            )
        )
*/        
        console.log(
            childProcess.execSync(
                `cp -rT /var/task /tmp/commit-this`, { // -T is --no-target-directory
                    encoding: 'utf8',
                    stdio: conf.nodejs.childProcessStdio,
                }
            )
        )
/*
        console.log(
            childProcess.execSync(
                `echo "AFTER COPY" 1>&2 && ls -ah /tmp/ruthenium 1>&2`, { 
                    encoding: 'utf8',
                    stdio: conf.nodejs.childProcessStdio,
                }
            )
        )
*/


        const _escapedCommitMessage = commitMessage
            .replace(/"/g, "\\\"")
            .replace(/\\/g, "\\\\")

        console.log(
            childProcess.execSync(
                `
                ${ shellExports }
                
                # Git the SUBMODULES : 
                echo "DEBUG : (git submodule foreach : add, checkout -b, commit)" 1>&2 &&
                git submodule foreach --recursive '
                
                    echo "DEBUG : $PWD" 1>&2 &&
                    git add . 1>&2 &&
                    git checkout -b ${ process.env.GITHUB_BRANCH } 1>&2 &&
                    git -c user.name=jerng-machines commit --allow-empty -m "${ _escapedCommitMessage }" 1>&2 &&
                       
                    echo "DEBUG : (git config --get remote.origin.url) in ($PWD)" 1>&2 &&
                    git config --get remote.origin.url 1>&2  &&
                       
                    echo "DEBUG : ( ... | sed ) in ($PWD)" 1>&2 &&
                    git config --get remote.origin.url | sed -e "s#https://\\(.*\\)#https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PERSONAL_ACCESS_TOKEN@\\1#g" 1>&2 &&
                       
                    git log 1>&2 &&
                    
                    echo "DEBUG : Actually Try : ( ... | git push -u ) in $PWD" 1>&2 &&
                    GIT_REMOTE=$(git config --get remote.origin.url | sed -e "s#https://\\(.*\\)#https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PERSONAL_ACCESS_TOKEN@\\1#g") &&
                    echo "... where GIT_REMOTE is $GIT_REMOTE" 1>&2 &&
                    git push -u $GIT_REMOTE 1>&2
                    ' 1>&2 &&
                
                # Git the SUPERPROJECT : 
                echo "DEBUG : (git SUPERPROJECT : add, checkout -b, commit)" 1>&2 &&
                git add . 1>&2 &&
                
                git -c user.name=jerng-machines commit --allow-empty -m "${ _escapedCommitMessage }" 1>&2 &&
                git push https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PERSONAL_ACCESS_TOKEN@github.com/jerng-org/ruthenium.git 1>&2
                `, {
                    encoding: 'utf8',
                    cwd: '/tmp/commit-this',
                    stdio: conf.nodejs.childProcessStdio,
                }
            )
        )

        mark(`... (git push) ATTEMPTED`)

    }
    catch (e) { console.error(`lambda-git-commit.js`, e.stack) }
    rusMinus1.frameworkDescriptionLogger.callEnds()
}

module.exports = lambdaGitCommit

mark(`LOADED`)

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
const mark = rusMinus1.mark 
const childProcess = require('child_process')
const shellExports = `
            export PATH=$PATH:/opt/git/bin; \
            export LD_LIBRARY_PATH=/opt/git/lib; \
`   /*  based on lambda layer "arn:aws:lambda:us-east-1:674588274689:layer:git-arm-lambda:8"
    
        roughly : 
        
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
              |   +-git-remote-https ( ~2.2MB, you can just copy this from yum's installation )
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
    try {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        let notes = {}

        childProcess.execSync(
            `${ shellExports }
            rm -rf /tmp/*; \
            ls -la /opt/git/libexec/git-core
            git clone -n --depth 1 -b ${ process.env.GITHUB_BRANCH } https://github.com/jerng-org/ruthenium.git; \
            `, {
                encoding: 'utf8',
                stdio: 'inherit',
                cwd:'/tmp'
            }
        )

        mark(`~/io/lambda-git-commit.js Repository cloned ... `)

        notes.cprVarTask =
            childProcess.execSync(
                `cp -r /var/task/* /tmp/ruthenium/;`, { encoding: 'utf8' }
            ).split('\n')

        notes.gitAdd =
            childProcess.execSync(
                `${ shellExports }
                git add .; \
                `, { encoding: 'utf8', cwd: '/tmp/ruthenium' }
            ).split('\n')

        notes.gitCommmit =
            childProcess.execSync(
                `${ shellExports }
                git -c user.name=jerng-machines commit -m "${ commitMessage }" ; \
                `, { encoding: 'utf8', cwd: '/tmp/ruthenium' }
            ).split('\n')

        notes.gitPush =
            childProcess.execSync(
                `${ shellExports }
                git push https://jerng-machines:$GITHUB_JERNG_MACHINES_USER_PERSONAL_ACCESS_TOKEN@github.com/jerng-org/ruthenium.git;\
                `, { encoding: 'utf8', cwd: '/tmp/ruthenium' }
            ).split('\n')

        console.log(' where do (notes) go from here?')

        mark(`~/io/lambda-git-commit.js Execution complete`)

        rusMinus1.frameworkDescriptionLogger.callEnds()

    }
    catch (e) { console.error(`lambda-git-commit.js`, e.stack) }
}

module.exports = lambdaGitCommit
mark(`~/io/lambda-git-commit.js LOADED`)

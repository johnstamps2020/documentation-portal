package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'stagingDataHub1030dh1030'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("stagingDataHub1030dh1030")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true

    expectSteps {
        script {
            name = "Upload generated content to the S3 bucket"
            id = "UPLOAD_GENERATED_CONTENT"
            scriptContent = """
                #!/bin/bash
                set -xe
                export ROOT_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%"
                export WORKING_SUBDIR=%WORKING_DIR%
                
                if [[ -z ${'$'}{WORKING_SUBDIR} ]]; then
                    echo "working subdir not set"
                else
                    export ROOT_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%/${'$'}WORKING_SUBDIR"
                    echo "Working dir set to ${'$'}ROOT_DIR"
                fi
                
                if [[ -d "${'$'}ROOT_DIR/out" ]]; then
                    export OUTPUT_PATH="out"
                elif [[ -d "${'$'}ROOT_DIR/dist" ]]; then
                    export OUTPUT_PATH="dist"
                elif [[ -d "${'$'}ROOT_DIR/build" ]]; then
                    export OUTPUT_PATH="build"
                fi
                
                echo "output path set to ${'$'}OUTPUT_PATH"
                
                aws s3 sync ${'$'}ROOT_DIR/${'$'}OUTPUT_PATH s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete
            """.trimIndent()
        }
        script {
            name = "Copy resources from git to the doc output dir"
            id = "COPY_RESOURCES0"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export RESOURCE_DIR="resource0"
                
                git clone --single-branch --branch master ssh://git@stash.guidewire.com/docsources/datamanagement-dh-ic-extras.git ${'$'}RESOURCE_DIR
                export S3_BUCKET_NAME=tenant-doctools-%env.DEPLOY_ENV%-builds
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                fi
                
                echo "Copying files to the doc output dir"
                mkdir -p %env.WORKING_DIR%/%env.OUTPUT_PATH%/extras
                cp -R ./${'$'}RESOURCE_DIR/Aspen-10.3/DataHub/* %env.WORKING_DIR%/%env.OUTPUT_PATH%/extras/
            """.trimIndent()
        }
    }
    steps {
        insert(0) {
            script {
                name = "Copy resources from git to the doc output dir"
                id = "COPY_RESOURCES0"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export RESOURCE_DIR="resource0"
                    
                    git clone --single-branch --branch master ssh://git@stash.guidewire.com/docsources/datamanagement-dh-ic-extras.git ${'$'}RESOURCE_DIR
                    export S3_BUCKET_NAME=tenant-doctools-%env.DEPLOY_ENV%-builds
                    if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                        echo "Setting credentials to access prod"
                        export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                        export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                        export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    fi
                    
                    echo "Copying files to the doc output dir"
                    mkdir -p %env.WORKING_DIR%/%env.OUTPUT_PATH%/extras
                    cp -R ./${'$'}RESOURCE_DIR/Aspen-10.3/DataHub/* %env.WORKING_DIR%/%env.OUTPUT_PATH%/extras/
                """.trimIndent()
            }
        }
        items.removeAt(2)
    }
}

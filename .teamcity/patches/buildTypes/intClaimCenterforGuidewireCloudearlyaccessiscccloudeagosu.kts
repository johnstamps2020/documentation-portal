package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'intClaimCenterforGuidewireCloudearlyaccessiscccloudeagosu'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("intClaimCenterforGuidewireCloudearlyaccessiscccloudeagosu")) {
    params {
        expect {
            password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
        }
        update {
            password("env.AUTH_TOKEN", "credentialsJSON:67d9216c-4183-4ebf-a9b3-374ea5e547ec", display = ParameterDisplay.HIDDEN)
        }
    }

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
                
                if [[ "%env.DEPLOY_ENV%" == "staging" ]]; then
                    echo "Creating a ZIP package"
                    cd "${'$'}ROOT_DIR/${'$'}OUTPUT_PATH" || exit
                    zip -r "${'$'}ROOT_DIR/docs.zip" * &&
                        mv "${'$'}ROOT_DIR/docs.zip" "${'$'}ROOT_DIR/${'$'}OUTPUT_PATH/"
                fi
                
                aws s3 sync ${'$'}ROOT_DIR/${'$'}OUTPUT_PATH s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete
            """.trimIndent()
        }
    }
    steps {
        check(stepsOrder == arrayListOf("BUILD_OUTPUT", "UPLOAD_GENERATED_CONTENT", "BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC")) {
            "Unexpected build steps order: $stepsOrder"
        }
        stepsOrder = arrayListOf("BUILD_OUTPUT", "UPLOAD_GENERATED_CONTENT", "CRAWL_DOC")
    }
}

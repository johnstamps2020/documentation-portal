package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'intJutroDesignSystemnextjutronext'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("intJutroDesignSystemnextjutronext")) {
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
    }
    steps {
        check(stepsOrder == arrayListOf("BUILD_DOC_SITE_OUTPUT", "UPLOAD_GENERATED_CONTENT", "CRAWL_DOC")) {
            "Unexpected build steps order: $stepsOrder"
        }
        stepsOrder = arrayListOf("BUILD_OUTPUT", "UPLOAD_GENERATED_CONTENT", "CRAWL_DOC")
    }
}

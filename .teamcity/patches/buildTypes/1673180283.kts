package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '1673180283'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("1673180283")) {
    expectSteps {
    }
    steps {
        insert(0) {
            script {
                name = "Build the yarn project"
                id = "BUILD_OUTPUT"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    # new Jutro proxy repo
                    npm-cli-login -u %env.ARTIFACTORY_USERNAME% -p '${'$'}{ARTIFACTORY_PASSWORD}' -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
                    npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/
                    
                    # Doctools repo
                    npm-cli-login -u %env.ARTIFACTORY_USERNAME% -p '${'$'}{ARTIFACTORY_PASSWORD}' -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://artifactory.guidewire.com/api/npm/doctools-npm-dev/
                    
                    if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                        export TARGET_URL="%env.TARGET_URL_PROD%"
                    fi
                    
                    export BASE_URL=/%env.PUBLISH_PATH%/
                    cd %env.SOURCES_ROOT%/%env.WORKING_DIR%
                    yarn
                    yarn ${'$'}{YARN_BUILD_COMMAND}
                """.trimIndent()
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerPull = true
                dockerImage = "artifactory.guidewire.com/devex-docker-dev/node:%NODE_IMAGE_VERSION%"
                dockerRunParameters = "--user 1000:1000"
            }
        }
    }
}

package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '16ad5b5c37428c30b6e4fd894a57f356'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("16ad5b5c37428c30b6e4fd894a57f356")) {
    expectSteps {
        script {
            name = "Upload content to the S3 bucket"
            id = "UPLOAD_CONTENT_TO_THE_S3_BUCKET"
            scriptContent = """
                #!/bin/bash
                                set -xe
                                
                                export AWS_ACCESS_KEY_ID="%env.ATMOS_DEV_AWS_ACCESS_KEY_ID%"
                export AWS_SECRET_ACCESS_KEY="%env.ATMOS_DEV_AWS_SECRET_ACCESS_KEY%"
                export AWS_DEFAULT_REGION="%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
                export AWS_REGION="%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
                                
                                aws s3 sync "%teamcity.build.checkoutDir%/out" s3://tenant-doctools-staging-builds/cloud/pc/202209/app --delete
            """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:2.6.0"
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
        script {
            name = "Run the doc crawler"
            id = "RUN_THE_DOC_CRAWLER"
            scriptContent = """
                #!/bin/bash
                                set -xe
                                
                                export AWS_ACCESS_KEY_ID="%env.ATMOS_DEV_AWS_ACCESS_KEY_ID%"
                export AWS_SECRET_ACCESS_KEY="%env.ATMOS_DEV_AWS_SECRET_ACCESS_KEY%"
                export AWS_DEFAULT_REGION="%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
                export AWS_REGION="%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
                                export OKTA_ISSUER="https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7"
                                export OKTA_SCOPES="NODE_Hawaii_Docs_Web.read NODE_Hawaii_Docs_Web.admin"
                                
                                export DOC_ID="ispc202209app"
                                export DOC_S3_URL="https://docportal-content.staging.ccs.guidewire.net"
                                export ELASTICSEARCH_URLS="https://docsearch-doctools.staging.ccs.guidewire.net"
                                export APP_BASE_URL="https://docs.staging.ccs.guidewire.net"
                                export DOCS_INDEX_NAME="gw-docs"
                                export BROKEN_LINKS_INDEX_NAME="broken-links"
                                export SHORT_TOPICS_INDEX_NAME="short-topics"
                                export REPORT_BROKEN_LINKS="yes"
                                export REPORT_SHORT_TOPICS="yes"
                                
                                doc_crawler
            """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-crawler:latest"
        }
        script {
            name = "Build the html5 output"
            id = "BUILD_THE_HTML5_OUTPUT"
            scriptContent = """
                #!/bin/bash
                                set -xe
                                
                                export EXIT_CODE=0
                                SECONDS=0
                                
                                echo "Downloading the ditaval file from common-gw submodule"
                                    
                export COMMON_GW_DITAVALS_DIR="%teamcity.build.checkoutDir%/common_gw_ditavals"
                mkdir -p ${'$'}COMMON_GW_DITAVALS_DIR && cd ${'$'}COMMON_GW_DITAVALS_DIR 
                curl -O https://stash.guidewire.com/rest/api/1.0/projects/DOCSOURCES/repos/common-gw/raw/ditavals/IS-PC-Cloud-Release.ditaval \
                    -H "Accept: application/json" \
                    -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%"
                
                                echo "Building output"
                                dita -i "%teamcity.build.checkoutDir%/PC-AppGuide.ditamap" -o "%teamcity.build.checkoutDir%/out" --processing-mode "strict" --filter "%teamcity.build.checkoutDir%/common_gw_ditavals/IS-PC-Cloud-Release.ditaval" --gw-base-url "cloud/pc/202209/app" --gw-doc-id "ispc202209app" --gw-doc-title "Application Guide" --generate.build.data "yes" --git.url "ssh://git@stash.guidewire.com/docsources/insurancesuite.git" --git.branch "release/2022.09.0" -f "html5-Guidewire" --args.rellinks "nofamily" --build.pdfs "yes" --create-index-redirect "yes" || EXIT_CODE=${'$'}?
                                
                                duration=${'$'}SECONDS
                                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
                                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
        }
    }
    steps {
        insert(0) {
            script {
                name = "Build the html5 output"
                id = "BUILD_THE_HTML5_OUTPUT"
                scriptContent = """
                    #!/bin/bash
                                    set -xe
                                    
                                    export EXIT_CODE=0
                                    SECONDS=0
                                    
                                    echo "Downloading the ditaval file from common-gw submodule"
                                        
                    export COMMON_GW_DITAVALS_DIR="%teamcity.build.checkoutDir%/common_gw_ditavals"
                    mkdir -p ${'$'}COMMON_GW_DITAVALS_DIR && cd ${'$'}COMMON_GW_DITAVALS_DIR 
                    curl -O https://stash.guidewire.com/rest/api/1.0/projects/DOCSOURCES/repos/common-gw/raw/ditavals/IS-PC-Cloud-Release.ditaval \
                        -H "Accept: application/json" \
                        -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%"
                    
                                    echo "Building output"
                                    dita -i "%teamcity.build.checkoutDir%/PC-AppGuide.ditamap" -o "%teamcity.build.checkoutDir%/out" --processing-mode "strict" --filter "%teamcity.build.checkoutDir%/common_gw_ditavals/IS-PC-Cloud-Release.ditaval" --gw-base-url "cloud/pc/202209/app" --gw-doc-id "ispc202209app" --gw-doc-title "Application Guide" --generate.build.data "yes" --git.url "ssh://git@stash.guidewire.com/docsources/insurancesuite.git" --git.branch "release/2022.09.0" -f "html5-Guidewire" --args.rellinks "nofamily" --build.pdfs "yes" --create-index-redirect "yes" || EXIT_CODE=${'$'}?
                                    
                                    duration=${'$'}SECONDS
                                    echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
                                    exit ${'$'}EXIT_CODE
                """.trimIndent()
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
            }
        }
        items.removeAt(3)
    }
}
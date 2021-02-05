package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'prodselfmanagedbchggrercaBillingCenter'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("prodselfmanagedbchggrercaBillingCenter")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true

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
            name = "Copy from S3 on staging to S3 on Prod"
            id = "COPY_FROM_STAGING_TO_PROD"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Copying from staging to Teamcity"
                aws s3 sync s3://tenant-doctools-staging-builds/%env.PUBLISH_PATH% %env.PUBLISH_PATH%/ --delete
                
                echo "Setting credentials to access prod"
                export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                
                echo "Uploading from Teamcity to prod"
                aws s3 sync %env.PUBLISH_PATH%/ s3://tenant-doctools-prod-builds/%env.PUBLISH_PATH% --delete
            """.trimIndent()
        }
    }
    steps {
        check(stepsOrder == arrayListOf("COPY_FROM_STAGING_TO_PROD", "BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC")) {
            "Unexpected build steps order: $stepsOrder"
        }
        stepsOrder = arrayListOf("COPY_FROM_STAGING_TO_PROD", "CRAWL_DOC")
    }
}

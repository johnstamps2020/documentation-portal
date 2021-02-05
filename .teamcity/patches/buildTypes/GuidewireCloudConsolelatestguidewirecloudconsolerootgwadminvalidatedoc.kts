package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'GuidewireCloudConsolelatestguidewirecloudconsolerootgwadminvalidatedoc'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("GuidewireCloudConsolelatestguidewirecloudconsolerootgwadminvalidatedoc")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true

    expectSteps {
        script {
            name = "Get document details"
            id = "GET_DOCUMENT_DETAILS"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                jq -n '{"indexForSearch":false,"displayOnLandingPages":false,"metadata":{"product":["Guidewire Cloud Console"],"release":["Banff","Cortina"],"version":["latest"],"platform":["Cloud"]},"public":false,"environments":["int"],"id":"guidewirecloudconsolerootgwadmin","title":"Cloud Console Root Doc GW Admin","url":"cloud/gcc-guide/gw-admin/latest"}' | jq '. += {"gitBuildBranch": "%teamcity.build.vcs.branch.DocumentationTools_DocumentationPortal_guidewirecloudconsolelatestsrc%", "gitSourceId": "guidewirecloudconsolelatestsrc"}' > %env.DOC_INFO%
                cat %env.DOC_INFO%
            """.trimIndent()
        }
    }
    steps {
        check(stepsOrder == arrayListOf("GET_DOCUMENT_DETAILS", "BUILD_GUIDEWIRE_WEBHELP", "BUILD_NORMALIZED_DITA", "RUN_SCHEMATRON_VALIDATIONS", "RUN_DOC_VALIDATOR")) {
            "Unexpected build steps order: $stepsOrder"
        }
        stepsOrder = arrayListOf("CREATE_DIRECTORIES", "GET_DOCUMENT_DETAILS", "BUILD_GUIDEWIRE_WEBHELP", "BUILD_NORMALIZED_DITA", "RUN_SCHEMATRON_VALIDATIONS", "RUN_DOC_VALIDATOR")
    }
}

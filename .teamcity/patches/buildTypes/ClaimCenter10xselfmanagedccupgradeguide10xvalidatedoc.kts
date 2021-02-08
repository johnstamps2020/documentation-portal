package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'ClaimCenter10xselfmanagedccupgradeguide10xvalidatedoc'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("ClaimCenter10xselfmanagedccupgradeguide10xvalidatedoc")) {
    expectSteps {
        script {
            name = "Get document details"
            id = "GET_DOCUMENT_DETAILS"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                jq -n '{"indexForSearch":true,"displayOnLandingPages":false,"metadata":{"product":["ClaimCenter"],"version":["10.x"],"platform":["Self-managed"]},"public":false,"environments":["int"],"id":"selfmanagedccupgradeguide10x","title":"ClaimCenter Upgrade Guide","url":"self-managed/cc/upgrade/10x"}' | jq '. += {"gitBuildBranch": "%teamcity.build.vcs.branch.DocumentationTools_DocumentationPortal_isupgradeguidesrc%", "gitSourceId": "isupgradeguidesrc"}' > %env.DOC_INFO%
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

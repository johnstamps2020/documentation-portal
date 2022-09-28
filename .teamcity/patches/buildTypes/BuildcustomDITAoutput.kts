package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'BuildcustomDITAoutput'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("BuildcustomDITAoutput")) {
    cleanup {
        add {
            keepRule {
                id = "KEEP_RULE_3"
                keepAtLeast = builds(100)
                dataToKeep = everything()
                preserveArtifactsDependencies = true
            }
        }
    }
}

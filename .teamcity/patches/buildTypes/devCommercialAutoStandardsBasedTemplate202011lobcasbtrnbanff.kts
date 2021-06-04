package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'devCommercialAutoStandardsBasedTemplate202011lobcasbtrnbanff'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("devCommercialAutoStandardsBasedTemplate202011lobcasbtrnbanff")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

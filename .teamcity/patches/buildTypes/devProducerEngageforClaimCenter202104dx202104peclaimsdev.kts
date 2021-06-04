package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'devProducerEngageforClaimCenter202104dx202104peclaimsdev'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("devProducerEngageforClaimCenter202104dx202104peclaimsdev")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

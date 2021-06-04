package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'stagingServiceRepEngage202008dxsre202008'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("stagingServiceRepEngage202008dxsre202008")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

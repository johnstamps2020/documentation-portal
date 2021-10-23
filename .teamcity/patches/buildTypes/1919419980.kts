package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '1919419980'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("1919419980")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

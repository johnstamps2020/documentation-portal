package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '1327928267'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("1327928267")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

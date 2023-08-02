package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '2245e829f17198b8996cbfaa5aa01364'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("2245e829f17198b8996cbfaa5aa01364")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

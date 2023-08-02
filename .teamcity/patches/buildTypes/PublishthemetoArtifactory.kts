package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'PublishthemetoArtifactory'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("PublishthemetoArtifactory")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

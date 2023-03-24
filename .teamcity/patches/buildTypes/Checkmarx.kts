package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'Checkmarx'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("Checkmarx")) {
    params {
        expect {
            text("checkmarx.source.directory", "%teamcity.build.checkoutDir%/server")
        }
        update {
            text("checkmarx.source.directory", "server")
        }
    }
}

package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = '26bb0d234633d89b6604d4b7d9842891'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("26bb0d234633d89b6604d4b7d9842891")) {
    vcs {
        expectEntry(RelativeId("DocumentationPortalgitrepo"))
        root(RelativeId("DocumentationPortalgitrepo"), "+:db")
    }
}

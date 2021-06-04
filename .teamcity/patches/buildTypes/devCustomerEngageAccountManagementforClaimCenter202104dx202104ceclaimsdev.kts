package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'devCustomerEngageAccountManagementforClaimCenter202104dx202104ceclaimsdev'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("devCustomerEngageAccountManagementforClaimCenter202104dx202104ceclaimsdev")) {
    check(paused == false) {
        "Unexpected paused: '$paused'"
    }
    paused = true
}

package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'prodisbc202011newandchangedBillingCenterforGuidewireCloud'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("prodisbc202011newandchangedBillingCenterforGuidewireCloud")) {
    params {
        expect {
            password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
        }
        update {
            password("env.AUTH_TOKEN", "credentialsJSON:67d9216c-4183-4ebf-a9b3-374ea5e547ec", display = ParameterDisplay.HIDDEN)
        }
    }
}

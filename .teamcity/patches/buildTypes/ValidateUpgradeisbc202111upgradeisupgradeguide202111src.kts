package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'ValidateUpgradeisbc202111upgradeisupgradeguide202111src'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("ValidateUpgradeisbc202111upgradeisupgradeguide202111src")) {
    vcs {
        remove(RelativeId("isupgradeguide202111src"))
        add(RelativeId("isupgradeguide202111srcValidationbuilds_DocumentationToolsDocumentationPortalIsupgradeguide202111src"))
    }

    features {
        val feature1 = find<PullRequests> {
            pullRequests {
                id = "BUILD_EXT_1"
                provider = bitbucketServer {
                    serverUrl = "https://stash.guidewire.com"
                    authType = password {
                        username = "%env.SERVICE_ACCOUNT_USERNAME%"
                        password = "%env.BITBUCKET_ACCESS_TOKEN%"
                    }
                    filterTargetBranch = "+:refs/heads/release/2021.11"
                }
            }
        }
        feature1.apply {
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = password {
                    username = "%env.SERVICE_ACCOUNT_USERNAME%"
                    password = "credentialsJSON:28000373-d3ae-4957-878b-a52ae604781a"
                }
                filterSourceBranch = ""
                filterTargetBranch = "+:refs/heads/release/2021.11"
            }
        }
    }
}

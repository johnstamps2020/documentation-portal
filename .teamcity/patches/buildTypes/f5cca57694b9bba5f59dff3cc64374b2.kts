package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'f5cca57694b9bba5f59dff3cc64374b2'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("f5cca57694b9bba5f59dff3cc64374b2")) {
    features {
        val feature1 = find<CommitStatusPublisher> {
            commitStatusPublisher {
                publisher = bitbucketServer {
                    url = "https://stash.guidewire.com"
                    authType = password {
                        userName = "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
                        password = "%env.BITBUCKET_ACCESS_TOKEN%"
                    }
                }
            }
        }
        feature1.apply {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                authType = password {
                    userName = "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
                    password = "credentialsJSON:28000373-d3ae-4957-878b-a52ae604781a"
                }
            }
        }
        val feature2 = find<PullRequests> {
            pullRequests {
                provider = bitbucketServer {
                    serverUrl = "https://stash.guidewire.com"
                    authType = token {
                        token = "%env.BITBUCKET_ACCESS_TOKEN%"
                    }
                    filterTargetBranch = "+:refs/heads/main"
                }
            }
        }
        feature2.apply {
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = token {
                    token = "credentialsJSON:28000373-d3ae-4957-878b-a52ae604781a"
                }
                filterSourceBranch = ""
                filterTargetBranch = "+:refs/heads/main"
            }
        }
    }
}

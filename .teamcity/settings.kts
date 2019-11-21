import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.vcs.GitVcsRoot
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.ScriptBuildStep

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2019.1"

project {
    vcsRoot(vcsroot)
    vcsRoot(vcsrootmasteronly)
    buildType(Test)
    buildType(Checkmarx)
    buildType(DeployDev)
    buildType(DeployInt)
    buildType(DeployStaging)
    buildType(DeployProd)
    buildType(Release)
    template(BuildDockerImage)
    template(Deploy)
    buildTypesOrder = arrayListOf(Test, Checkmarx, DeployDev, DeployInt, DeployStaging, DeployProd, Release)

    features {
        feature {
            type = "JetBrains.SharedResources"
            param("quota", "1")
            param("name", "PROJECT_VERSION")
            param("type", "quoted")
        }
    }
}

object Test : BuildType({
    name = "Test"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Test"
            scriptContent = """
                set -e
                npm install
                npm test
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/node"
            dockerPull = true
        }
    }

    triggers {
        vcs {
            branchFilter = "+:*"
            triggerRules = "-:user=doctools:**"
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
        commitStatusPublisher {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%env.ARTIFACTORY_USERNAME%"
                password = "%env.ARTIFACTORY_PASSWORD%"
            }
        }
    }
})

object Checkmarx : BuildType({
    name = "Checkmarx"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        step {
            type = "checkmarx"
            param("cxOsaEnabled", "false")
            param("cxPresetId", "100000")
            param("cxTeamId", "b78ac917-39fb-4a99-af12-55bf19131b16")
            param("cxProjectName", "doctools")
        }
    }

    triggers {
        vcs {
            branchFilter = "+:*"
        }
    }
})

object DeployDev : BuildType({
    templates(BuildDockerImage, Deploy)
    name = "Deploy to Dev"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    params {
        param("deploy-env", "dev")
        param("deploy-version", "latest")
        text("namespace", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
    }

    triggers {
        finishBuildTrigger {
            buildTypeExtId = "${Test.id}"
            successfulOnly = true
        }
    }

    dependencies {
        snapshot(Test) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(Checkmarx) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object DeployInt : BuildType({
    templates(Deploy)
    name = "Deploy to Int"

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    params {
        param("deploy-env", "int")
        text("deploy-version", "", label = "Deploy Version", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("namespace", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
    }
})

object DeployStaging : BuildType({
    templates(Deploy)
    name = "Deploy to Staging"

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    params {
        param("deploy-env", "staging")
        text("deploy-version", "", label = "Deploy Version", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("namespace", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
    }
})

object DeployProd : BuildType({
    templates(Deploy)
    name = "Deploy to Prod"

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    params {
        param("deploy-env", "us-east-2")
        text("deploy-version", "", label = "Deploy Version", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("namespace", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
    }

    steps {
        script {
            name = "Push Docker Image to ECR"
            id = "PUSH_TO_ECR"
            scriptContent = """
                set -xe
                export TAG_VERSION="v%deploy-version%"
                docker login -u ${'$'}{ARTIFACTORY_USERNAME} -p ${'$'}{ARTIFACTORY_PASSWORD} artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{TAG_VERSION}
                docker tag artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{TAG_VERSION} 710503867599.dkr.ecr.us-east-2.amazonaws.com/tenant-doctools-nodeoktacontainer:${'$'}{TAG_VERSION}
                docker logout artifactory.guidewire.com
                export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                eval $(aws ecr get-login --no-include-email | sed 's|https://||')
                docker push 710503867599.dkr.ecr.us-east-2.amazonaws.com/tenant-doctools-nodeoktacontainer:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            dockerPull = true
        }
        stepsOrder = arrayListOf("PUSH_TO_ECR", "DEPLOY_TO_K8S", "ACCEPTANCE_TESTS")
    }
})

object Release : BuildType({
    name = "Release New Version"
    description = "Publish a release to Artifactory Docker Registry"

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    params {
        select("semver-scope", "patch", label = "Version Scope", display = ParameterDisplay.PROMPT,
                options = listOf("Patch" to "patch", "Minor" to "minor", "Major" to "major"))
    }

    steps {
        script {
            name = "Bump And Tag Version"
            scriptContent = """
                set -xe
                git config --global user.email "doctools@guidewire.com"
                git config --global user.name "sys-doc"
                git fetch --tags
                npm version %semver-scope%
                git push origin master
                git push --tags

                export TAG_VERSION=${'$'}(git describe --tag)
                docker login -u ${'$'}{ARTIFACTORY_USERNAME} -p ${'$'}{ARTIFACTORY_PASSWORD} artifactory.guidewire.com
                docker build -t nodeoktacontainer .
                docker tag nodeoktacontainer:latest artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{TAG_VERSION}
                docker push artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            dockerPull = true
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
        sshAgent {
            teamcitySshKey = "sys-doc.rsa"
        }
        feature {
            type = "JetBrains.SharedResources"
            param("locks-param", "PROJECT_VERSION readLock")
        }

    }
})

object BuildDockerImage : Template({
    name = "Build Docker Image"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Build and Push Docker Image"
            scriptContent = """
                #!/bin/bash 
                set -xe
                echo OKTA_DOMAIN="%env.OKTA_DOMAIN%" >> .env
                echo OKTA_CLIENT_ID="%env.OKTA_CLIENT_ID%" >> .env
                echo OKTA_CLIENT_SECRET="%env.OKTA_CLIENT_SECRET%" >> .env
                echo APP_BASE_URL="http://nodeoktacontainer-%namespace%.%deploy-env%.ccs.guidewire.net" >> .env
                echo SESSION_KEY="%env.SESSION_KEY%" >> .env
                if [[ "%teamcity.build.branch%" == "master" ]] || [[ "%teamcity.build.branch%" == "refs/heads/master" ]]; then
                    export BRANCH_NAME=latest
                else 
                    export BRANCH_NAME=${'$'}(echo "%teamcity.build.branch%" | tr -d /)
                fi
                docker login -u ${'$'}{ARTIFACTORY_USERNAME} -p ${'$'}{ARTIFACTORY_PASSWORD} artifactory.guidewire.com
                docker build -t nodeoktacontainer .
                docker tag nodeoktacontainer artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{BRANCH_NAME}
                docker push artifactory.guidewire.com/doctools-docker-dev/nodeoktacontainer:${'$'}{BRANCH_NAME}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            dockerPull = true
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }
})

object Deploy : Template({
    name = "Deploy"

    steps {
        script {
            name = "Deploy to Kubernetes"
            id = "DEPLOY_TO_K8S"
            scriptContent = """
                #!/bin/bash 
                set -xe
                export DEPLOY_ENV="%deploy-env%"
                if [[ "%deploy-env%" == "dev" ]]; then
                    export TAG_VERSION="%deploy-version%"
                    if [[ "%teamcity.build.branch%" == "master" ]] || [[ "%teamcity.build.branch%" == "refs/heads/master" ]]; then
                        export TAG_VERSION="latest"
                    else 
                        export TAG_VERSION=${'$'}(echo "%teamcity.build.branch%" | tr -d /)
                    fi
                else
                    export TAG_VERSION="%deploy-version%"
                fi                
                export NAMESPACE="%namespace%"
                if [[ "%deploy-env%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                fi
                sh ci/deployKubernetes.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            dockerPull = true
        }
        script {
            name = "Acceptance Tests"
            id = "ACCEPTANCE_TESTS"
            scriptContent = """
                echo "Acceptance tests should go here. Update this step to add your own acceptance tests."
            """.trimIndent()
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }
})

object vcsroot : GitVcsRoot({
    name = "vcsroot"
    url = "ssh://git@stash.guidewire.com/doctools/node-okta-container.git"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

object vcsrootmasteronly : GitVcsRoot({
    name = "vcsrootmasteronly"
    url = "ssh://git@stash.guidewire.com/doctools/node-okta-container.git"
    branchSpec = "+:refs/heads/master"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

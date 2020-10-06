import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCompose
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

version = "2019.2"

project {

    vcsRoot(vcsrootmasteronly)
    vcsRoot(vcsroot)
    vcsRoot(DocValidator)

    template(Deploy)
    template(BuildDockerImage)
    template(BuildOutputFromDita)
    template(CrawlDocumentAndUpdateSearchIndex)
    template(RunContentValidations)

    params {
        param("env.NAMESPACE", "doctools")
    }

    subProject(Services)
    subProject(Server)
    subProject(Content)
    subProject(Docs)
    subProject(Sources)
}

object vcsrootmasteronly : GitVcsRoot({
    name = "vcsrootmasteronly"
    url = "ssh://git@stash.guidewire.com/doctools/documentation-portal.git"
    branchSpec = "+:refs/heads/master"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

object vcsroot : GitVcsRoot({
    name = "vcsroot"
    url = "ssh://git@stash.guidewire.com/doctools/documentation-portal.git"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

object DocValidator : GitVcsRoot({
    name = "Documentation validator"
    url = "ssh://git@stash.guidewire.com/doctools/doc-validator.git"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

object Checkmarx : BuildType({
    name = "Checkmarx"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        step {
            type = "checkmarx"
            param("cxUseDefaultSastConfig", "false")
            param("cxOsaEnabled", "false")
            param("cxPresetId", "100000")
            param("cxTeamId", "b78ac917-39fb-4a99-af12-55bf19131b16")
            param("cxFilterPatterns", """
                !**/_cvs/**/*, !**/.svn/**/*,   !**/.hg/**/*,   !**/.git/**/*,  !**/.bzr/**/*, !**/bin/**/*,
                !**/obj/**/*,  !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr,     !**/*.iws,
                !**/*.bak,     !**/*.tmp,       !**/*.aac,      !**/*.aif,      !**/*.iff,     !**/*.m3u,   !**/*.mid, !**/*.mp3,
                !**/*.mpa,     !**/*.ra,        !**/*.wav,      !**/*.wma,      !**/*.3g2,     !**/*.3gp,   !**/*.asf, !**/*.asx,
                !**/*.avi,     !**/*.flv,       !**/*.mov,      !**/*.mp4,      !**/*.mpg,     !**/*.rm,    !**/*.swf, !**/*.vob,
                !**/*.wmv,     !**/*.bmp,       !**/*.gif,      !**/*.jpg,      !**/*.png,     !**/*.psd,   !**/*.tif, !**/*.swf,
                !**/*.jar,     !**/*.zip,       !**/*.rar,      !**/*.exe,      !**/*.dll,     !**/*.pdb,   !**/*.7z,  !**/*.gz,
                !**/*.tar.gz,  !**/*.tar,       !**/*.gz,       !**/*.ahtm,     !**/*.ahtml,   !**/*.fhtml, !**/*.hdm,
                !**/*.hdml,    !**/*.hsql,      !**/*.ht,       !**/*.hta,      !**/*.htc,     !**/*.htd,   !**/*.war, !**/*.ear,
                !**/*.htmls,   !**/*.ihtml,     !**/*.mht,      !**/*.mhtm,     !**/*.mhtml,   !**/*.ssi,   !**/*.stm,
                !**/*.stml,    !**/*.ttml,      !**/*.txn,      !**/*.xhtm,     !**/*.xhtml,   !**/*.class, !**/node_modules/**/*, !**/*.iml,
                !**/tests/**/*,     !**/.teamcity/**/*,     !**/__tests__/**/*,     !**/images/**/*,        !**/fonts/**/*
            """.trimIndent())
            param("cxProjectName", "doctools")
        }
    }

    triggers {
        vcs {
        }
    }
})

object DeployDev : BuildType({
    templates(BuildDockerImage, Deploy)
    name = "Deploy to Dev"

    maxRunningBuilds = 1

    params {
        text("env.NAMESPACE", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
        param("env.DEPLOY_ENV", "dev")
        param("env.TAG_VERSION", "latest")
        param("env.PARTNERS_LOGIN_URL", "https://dev-guidewire.cs123.force.com/partners/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://dev-guidewire.cs123.force.com/customers/idp/endpoint/HttpRedirect")
    }

    vcs {
        cleanCheckout = true
    }

    triggers {
        finishBuildTrigger {
            id = "TRIGGER_1"
            buildType = "${Test.id}"
            successfulOnly = true
        }
    }

    dependencies {
        snapshot(Checkmarx) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(Test) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(TestConfig) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object DeployInt : BuildType({
    templates(BuildDockerImage, Deploy)
    name = "Deploy to Int"

    maxRunningBuilds = 1

    params {
        text("env.NAMESPACE", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
        param("env.DEPLOY_ENV", "int")
        param("env.TAG_VERSION", "latest-int")
        param("env.PARTNERS_LOGIN_URL", "https://dev-guidewire.cs123.force.com/partners/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://dev-guidewire.cs123.force.com/customers/idp/endpoint/HttpRedirect")
        param("env.CONFIG_FILENAME", "gw-docs-int.json")
    }

    vcs {
        cleanCheckout = true
    }

    dependencies {
        snapshot(Checkmarx) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(Test) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(TestConfig) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object DeployProd : BuildType({
    templates(Deploy)
    name = "Deploy to Prod"

    params {
        param("env.DEPLOY_ENV", "us-east-2")
        text("env.NAMESPACE", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("env.TAG_VERSION", "", label = "Deploy Version", display = ParameterDisplay.PROMPT,
                regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""", validationMessage = "Invalid SemVer Format")
        param("env.AWS_ACCESS_KEY_ID", "%env.ATMOS_PROD_AWS_ACCESS_KEY_ID%")
        param("env.AWS_SECRET_ACCESS_KEY", "%env.ATMOS_PROD_AWS_SECRET_ACCESS_KEY%")
        param("env.AWS_DEFAULT_REGION", "%env.ATMOS_PROD_AWS_DEFAULT_REGION%")
        param("env.PARTNERS_LOGIN_URL", "https://partner.guidewire.com/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://community.guidewire.com/idp/endpoint/HttpRedirect")

    }

    vcs {
        root(vcsrootmasteronly)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Push Docker Image to ECR"
            id = "PUSH_TO_ECR"
            scriptContent = """
                set -xe
                docker pull artifactory.guidewire.com/doctools-docker-dev/docportal:v%env.TAG_VERSION%
                docker tag artifactory.guidewire.com/doctools-docker-dev/docportal:v%env.TAG_VERSION% 710503867599.dkr.ecr.us-east-2.amazonaws.com/tenant-doctools-docportal:v%env.TAG_VERSION%
                eval ${'$'}(aws ecr get-login --no-include-email | sed 's|https://||')
                docker push 710503867599.dkr.ecr.us-east-2.amazonaws.com/tenant-doctools-docportal:v%env.TAG_VERSION%
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
        stepsOrder = arrayListOf("PUSH_TO_ECR", "DEPLOY_TO_K8S", "CHECK_PODS_STATUS", "ACCEPTANCE_TESTS")
    }
})

object DeployStaging : BuildType({
    templates(Deploy)
    name = "Deploy to Staging"

    params {
        text("env.NAMESPACE", "doctools", label = "Namespace", display = ParameterDisplay.PROMPT, allowEmpty = false)
        param("env.DEPLOY_ENV", "staging")
        text("env.TAG_VERSION", "", label = "Deploy Version", display = ParameterDisplay.PROMPT,
                regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""", validationMessage = "Invalid SemVer Format")
        param("env.PARTNERS_LOGIN_URL", "https://uat-guidewire.cs59.force.com/partners/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://uat-guidewire.cs59.force.com/customers/idp/endpoint/HttpRedirect")
    }

    vcs {
        root(vcsrootmasteronly)

        cleanCheckout = true
    }
})

object Release : BuildType({
    name = "Release New Version"
    description = "Publish a release to Artifactory Docker Registry"

    maxRunningBuilds = 1

    params {
        select("semver-scope", "patch", label = "Version Scope", display = ParameterDisplay.PROMPT,
                options = listOf("Patch" to "patch", "Minor" to "minor", "Major" to "major"))
    }

    vcs {
        root(vcsrootmasteronly)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Bump And Tag Version"
            scriptContent = """
                set -xe
                git config --global user.email "doctools@guidewire.com"
                git config --global user.name "sys-doc"
                git fetch --tags

                cd server/
                export TAG_VERSION=${'$'}(npm version %semver-scope%)
                git add .
                git commit -m "push changes to ${'$'}{TAG_VERSION}"
                git tag -a ${'$'}{TAG_VERSION} -m "create new %semver-scope% version ${'$'}{TAG_VERSION}"
                git push
                git push --tags
                
                docker build -t docportal .
                docker tag docportal:latest artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
                docker push artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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
    }
})

object Test : BuildType({
    name = "Test"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Test"
            scriptContent = """
                set -e
                export APP_BASE_URL=http://localhost:8081
                export ELASTIC_SEARCH_URL=https://docsearch-doctools.dev.ccs.guidewire.net
                cd server/
                npm install
                npm test
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/node"
            dockerPull = true
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:.teamcity/settings.kts
                +:server/**
                -:user=doctools:**
            """.trimIndent()
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
                userName = "%serviceAccountUsername%"
                password = "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
            }
        }
    }
})

object DeploySearchService : BuildType({
    name = "Deploy a search service"
    description = "Creates or updates an S3 ingress for a selected environment"

    params {
        select("env.DEPLOY_ENV", "", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "us-east-2"))
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Deploy to Kubernetes"
            id = "DEPLOY_TO_K8S"
            scriptContent = """
                #!/bin/bash 
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    export KUBE_FILE=apps/search_indexer/kube/deployment-prod.yml
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                    export KUBE_FILE=apps/search_indexer/kube/deployment.yml
                fi
                sh ci/deployKubernetes.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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

object DeployS3Ingress : BuildType({
    name = "Deploy an S3 ingress"
    description = "Creates or updates an S3 ingress for a selected environment"

    params {
        select("env.DEPLOY_ENV", "", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "us-east-2"))
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Deploy to Kubernetes"
            id = "DEPLOY_TO_K8S"
            scriptContent = """
                #!/bin/bash 
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    export KUBE_FILE=s3/kube/ingress-prod.yml
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                    export KUBE_FILE=s3/kube/ingress.yml
                fi
                sh ci/deployKubernetes.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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

object UpdateSearchIndex : BuildType({
    templates(CrawlDocumentAndUpdateSearchIndex)
    name = "Update search index"

    params {
        select("DEPLOY_ENV", "", label = "Deployment environment", description = "The environment on which you want reindex documents", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
        text("DOC_ID", "", label = "Doc ID", description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.", display = ParameterDisplay.PROMPT, allowEmpty = true)
    }
})

object CleanUpIndex : BuildType({
    name = "Clean up index"
    description = "Remove documents from index which are not in the config"

    params {
        select("env.DEPLOY_ENV", "", label = "Deployment environment", description = "Select an environment on which you want clean up the index", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
        text("env.CONFIG_FILE_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.CONFIG_FILE_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS_PROD", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net", allowEmpty = false)

    }

    vcs {
        root(vcsrootmasteronly)
    }

    steps {
        dockerCommand {
            name = "Build a Python Docker image"
            commandType = build {
                source = file {
                    path = "apps/Dockerfile"
                }
                namesAndTags = "python-runner"
                commandArgs = "--pull"
            }
            param("dockerImage.platform", "linux")
        }

        script {
            name = "Run the cleanup script"
            scriptContent = """
                #!/bin/bash
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export ELASTICSEARCH_URLS="%env.ELASTICSEARCH_URLS_PROD%"
                    export CONFIG_FILE_URL="%env.CONFIG_FILE_URL_PROD%"
                fi
                
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}CONFIG_FILE

                pip install elasticsearch
                cd apps/index_cleaner
                python main.py
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object TestContent : BuildType({
    name = "Test"

    params {
        text("env.TEST_ENVIRONMENT_DOCKER_NETWORK", "host", allowEmpty = false)
    }

    vcs {
        root(vcsroot)

        cleanCheckout = true
    }

    steps {
        dockerCompose {
            name = "Compose services"
            file = "apps/search_indexer/tests/test_doc_crawler/resources/docker-compose.yml"
        }
        dockerCommand {
            name = "Build a Docker image for running the Python search_indexer"
            commandType = build {
                source = file {
                    path = "apps/Dockerfile"
                }
                namesAndTags = "python-runner"
                commandArgs = "--pull"
            }
        }

        script {
            name = "Run tests for crawling documents and uploading index"
            scriptContent = """
                cd apps/search_indexer
                make test-doc-crawler
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:.teamcity/settings.kts
                +:apps/search_indexer/**
                -:user=doctools:**
            """.trimIndent()
        }
    }

    features {
        commitStatusPublisher {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%serviceAccountUsername%"
                password = "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
            }
        }
        sshAgent {
            teamcitySshKey = "dita-ot.rsa"
        }
    }
})

object DeployServerConfig : BuildType({
    name = "Deploy server config"

    params {
        select("env.DEPLOY_ENV", "", label = "Deployment environment", description = "Select an environment on which you want deploy the config", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
    }

    vcs {
        root(vcsrootmasteronly)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Generate config file"
            scriptContent = """
                #!/bin/bash
                set -xe
                cd apps/config_deployer
                python main.py
            """.trimIndent()
            dockerImage = "python:3.8-slim"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Upload config to S3"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ %env.DEPLOY_ENV% == "prod" ]]; then
                  export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                  export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                  export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                  export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                  export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                  export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"					
                fi
                
                aws s3 cp apps/config_deployer/out/config.json s3://tenant-doctools-%env.DEPLOY_ENV%-builds/portal-config/config.json
                """.trimIndent()
        }
    }
})

object TestConfig : BuildType({
    name = "Test config"

    vcs {
        root(vcsroot)

        cleanCheckout = true
    }

    steps {
        dockerCommand {
            name = "Build a Docker image for running the Python apps"
            commandType = build {
                source = file {
                    path = "apps/Dockerfile"
                }
                namesAndTags = "python-runner"
                commandArgs = "--pull"
            }
        }

        script {
            name = "Run tests for server config"
            scriptContent = """
                cd apps/search_indexer
                make test-config
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--network=host"
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:.teamcity/**/*.*
                -:user=doctools:**
            """.trimIndent()
        }
    }

    features {
        commitStatusPublisher {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%serviceAccountUsername%"
                password = "credentialsJSON:01a9d262-c4a1-4c6a-9341-70e3999e329b"
            }
        }
        sshAgent {
            teamcitySshKey = "dita-ot.rsa"
        }
    }
})

object BuildDockerImage : Template({
    name = "Build Docker Image"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Build and Push Docker Image"
            id = "TEMPLATE_RUNNER_1"
            scriptContent = """
                #!/bin/bash 
                set -xe
                if [[ "%teamcity.build.branch%" == "master" ]] || [[ "%teamcity.build.branch%" == "refs/heads/master" ]]; then
                    export TAG_VERSION=${'$'}{TAG_VERSION}
                else 
                    export TAG_VERSION=${'$'}(echo "%teamcity.build.branch%" | tr -d /)-${'$'}{DEPLOY_ENV}
                fi
                docker build -t docportal ./server
                docker tag docportal artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
                docker push artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
    }

    features {
        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
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
                if [[ "%env.DEPLOY_ENV%" == "dev" ]]; then
                    if [[ "%teamcity.build.branch%" != "master" ]] && [[ "%teamcity.build.branch%" != "refs/heads/master" ]]; then
                        export TAG_VERSION=${'$'}(echo "%teamcity.build.branch%" | tr -d /)-${'$'}{DEPLOY_ENV}
                    fi
                elif [[ "%env.DEPLOY_ENV%" == "int" ]]; then
                    export TAG_VERSION=${'$'}TAG_VERSION
                else
                    export TAG_VERSION=v${'$'}TAG_VERSION
                fi
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                fi
                sh server/ci/deployKubernetes.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
        script {
            name = "Check new Pods Status"
            id = "CHECK_PODS_STATUS"
            scriptContent = """
                #!/bin/bash
                set -e
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                fi
                aws eks update-kubeconfig --name atmos-%env.DEPLOY_ENV%
                sleep 10
                TIME="0"
                while true; do
                    if [[ "${'$'}TIME" == "10" ]]; then
                        break
                    fi
                    FAIL_PODS=`kubectl get pods -l app=docportal-app --namespace=doctools | grep CrashLoopBackOff | cut -d' ' -f1 | tail -n +2`
                    if [[ ! -z "${'$'}FAIL_PODS" ]]; then
                        echo "The following pods failed in last Deployment. Please check it in Kubernetes Dashboard."
                        echo "${'$'}FAIL_PODS" && false
                    fi
                    sleep 10
                    TIME=${'$'}[${'$'}TIME+1]
                done
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
        script {
            name = "Acceptance Tests"
            id = "ACCEPTANCE_TESTS"
            scriptContent = """echo "Acceptance tests should go here. Update this step to add your own acceptance tests.""""
        }
    }

    features {
        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_2"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }
})

object Server : Project({
    name = "Server"

    buildType(Checkmarx)
    buildType(Test)
    buildType(TestConfig)
    buildType(DeployInt)
    buildType(DeployStaging)
    buildType(DeployDev)
    buildType(Release)
    buildType(DeployProd)
    buildType(DeployServerConfig)

    buildTypesOrder = arrayListOf(DeployServerConfig, Test, Checkmarx, DeployDev, DeployInt, DeployStaging, DeployProd, Release)
})

object HelperObjects {
    private fun getObjectsFromConfig(configPath: String, objectName: String): JSONArray {
        val config = JSONObject(File(configPath).readText(Charsets.UTF_8))
        return config.getJSONArray(objectName)
    }

    val docConfigs = getObjectsFromConfig("config/server-config.json", "docs")
    val sourceConfigs = getObjectsFromConfig("config/sources.json", "sources")
    private val buildConfigs = getObjectsFromConfig("config/builds.json", "builds")

    private fun getObjectById(objectList: JSONArray, idName: String, idValue: String): JSONObject {
        for (i in 0 until objectList.length()) {
            val obj = objectList.getJSONObject(i)
            if (obj.getString(idName) == idValue) {
                return obj
            }
        }
        return JSONObject()
    }

    private fun removeSpecialCharacters(stringToClean: String): String {
        val re = Regex("[^A-Za-z0-9]")
        return re.replace(stringToClean, "")
    }

    private fun getSourceById(sourceId: String, sourceList: JSONArray): Pair<String, String> {
        for (i in 0 until sourceList.length()) {
            val source = sourceList.getJSONObject(i)
            if (source.getString("id") == sourceId) {
                var sourceGitBranch = "master"
                val sourceGitUrl = source.getString("gitUrl")
                if (source.has("branch")) {
                    sourceGitBranch = source.getString("branch")
                }
                return Pair(sourceGitUrl, sourceGitBranch)
            }
        }
        return Pair("", "")
    }


    fun createExportBuildsFromConfig(): MutableList<BuildType> {
        class ExportFilesFromXDocsToBitbucketAbstract(build_id: String, source_title: String, export_path_ids: String, git_path: String, branch_name: String, nightly_build: Boolean) : BuildType({

            id = RelativeId(build_id)
            name = "Export $source_title from XDocs and add to git ($build_id)"

            enablePersonalBuilds = false
            type = Type.COMPOSITE

            params {
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.EXPORT_PATH_IDS", export_path_ids)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.GIT_URL", git_path)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.GIT_BRANCH", branch_name)
            }

            dependencies {
                snapshot(ExportFilesFromXDocsToBitbucket) {
                    reuseBuilds = ReuseBuilds.NO
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            if (nightly_build) {
                triggers {
                    schedule {
                        schedulingPolicy = daily {
                            hour = 0
                        }
                        branchFilter = ""
                        triggerBuild = always()
                        withPendingChangesOnly = false
                    }
                }
            }
        })

        val builds = mutableListOf<BuildType>()
        for (i in 0 until sourceConfigs.length()) {
            val source = sourceConfigs.getJSONObject(i)
            if (source.has("xdocsPathIds")) {
                val sourceId = source.getString("id")
                val gitUrl = source.getString("gitUrl")
                val sourceTitle = source.getString("title")
                val branchName = if (source.has("branch")) source.getString("branch") else "master"
                val exportBuildId = source.getString("id") + "_export"
                val xdocsPathIds = source.getJSONArray("xdocsPathIds").joinToString(" ")

                val build = getObjectById(buildConfigs, "srcId", sourceId)
                var nightlyBuild = false
                if (build.has("docId")) {
                    val buildDocId = build.getString("docId")
                    val doc = getObjectById(docConfigs, "id", buildDocId)
                    nightlyBuild = doc.getJSONArray("environments").contains("int")
                }

                builds.add(ExportFilesFromXDocsToBitbucketAbstract(exportBuildId, sourceTitle, xdocsPathIds, gitUrl, branchName, nightlyBuild))
            }
        }
        return builds
    }

    private fun createProductProject(product_name: String, docs: MutableList<JSONObject>): Project {

        val versions = mutableListOf<String>()
        val noVersionLabel = "No version"
        for (doc in docs) {
            val metadata = doc.getJSONObject("metadata")
            if (metadata.has("version")) {
                val docVersion = metadata.getString("version")
                if (!versions.contains(docVersion)) {
                    versions.add(docVersion)
                }
            } else if (!versions.contains(noVersionLabel)) {
                versions.add(noVersionLabel)
            }
        }

        val subProjects = mutableListOf<Project>()
        for (version in versions) {
            val docsInVersion = mutableListOf<JSONObject>()
            for (doc in docs) {
                val metadata = doc.getJSONObject("metadata")
                if (!docsInVersion.contains(doc)) {
                    if (metadata.has("version") && metadata.getString("version") == version) {
                        docsInVersion.add(doc)
                    } else if (!metadata.has("version") && version == noVersionLabel) {
                        docsInVersion.add(doc)
                    }
                }
            }
            if (!docsInVersion.isNullOrEmpty()) {
                subProjects.add(createVersionProject(product_name, version, docsInVersion))
            }
        }

        return Project {
            id = RelativeId(removeSpecialCharacters(product_name))
            name = product_name

            subProjects.forEach(this::subProject)
        }
    }

    private fun createVersionProject(product_name: String, version: String, docs: MutableList<JSONObject>): Project {

        val subProjects = mutableListOf<Project>()
        for (doc in docs) {
            subProjects.add(createDocProjectWithBuilds(doc, product_name, version))
        }

        return Project {
            id = RelativeId(removeSpecialCharacters(product_name + version))
            name = version

            subProjects.forEach(this::subProject)
        }
    }

    class DocVcsRoot(vcs_root_id: RelativeId, git_source_url: String, git_source_branch: String) : GitVcsRoot({
        id = vcs_root_id
        name = vcs_root_id.toString()
        url = git_source_url
        authMethod = uploadedKey {
            uploadedKey = "sys-doc.rsa"
        }

        if (git_source_branch != "") {
            branch = "refs/heads/$git_source_branch"
        }

    })

    private fun createDocProjectWithBuilds(doc: JSONObject, product_name: String, version: String): Project {

        class BuildPublishToS3Index(product: String, platform: String, version: String, doc_title: String, doc_id: String, ditaval_file: String, input_path: String, create_index_redirect: String, build_env: String, publish_path: String, git_source_url: String, git_source_branch: String, resources_to_copy: List<JSONObject>, vcs_root_id: RelativeId, index_for_search: Boolean) : BuildType({
            if (index_for_search) {
                templates(BuildOutputFromDita, CrawlDocumentAndUpdateSearchIndex)
            } else {
                templates(BuildOutputFromDita)
            }

            id = RelativeId(removeSpecialCharacters(build_env + product + version + doc_id))
            name = "Publish to $build_env"
            maxRunningBuilds = 1

            var buildPdf = "true"
            if (build_env == "int") {
                buildPdf = "false"
            }

            vcs {
                root(vcs_root_id, "+:. => %SOURCES_ROOT%")
            }

            params {
                password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
                text("env.DOC_ID", doc_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.DEPLOY_ENV", build_env, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.PUBLISH_PATH", publish_path, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.S3_BUCKET_NAME", "tenant-doctools-%env.DEPLOY_ENV%-builds", display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
                text("GW_PRODUCT", product, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_PLATFORM", platform, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_VERSION", version, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_TITLE", doc_title, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("FILTER_PATH", ditaval_file, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("ROOT_MAP", input_path, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GIT_URL", git_source_url, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GIT_BRANCH", git_source_branch, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("BUILD_PDF", buildPdf, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("CREATE_INDEX_REDIRECT", create_index_redirect, display = ParameterDisplay.HIDDEN, allowEmpty = false)
            }

            steps {
                script {
                    name = "Upload generated content to the S3 bucket"
                    id = "UPLOAD_GENERATED_CONTENT"
                    scriptContent = """
                    #!/bin/bash
                    set -xe
                    export WORKING_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%"
                    export OUTPUT_PATH="out"

                    if [[ "%env.DEPLOY_ENV%" == "staging" ]]; then
                        echo "Creating a ZIP package"
                        cd "${'$'}WORKING_DIR/${'$'}OUTPUT_PATH" || exit
                        zip -r "${'$'}WORKING_DIR/docs.zip" * &&
                            mv "${'$'}WORKING_DIR/docs.zip" "${'$'}WORKING_DIR/${'$'}OUTPUT_PATH/"
                    fi
                    
                    aws s3 sync ${'$'}WORKING_DIR/${'$'}OUTPUT_PATH s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete
                """.trimIndent()
                }

                stepsOrder = arrayListOf("BUILD_OUTPUT_FROM_DITA", "UPLOAD_GENERATED_CONTENT")
                if (index_for_search) {
                    stepsOrder.addAll(arrayListOf("BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC"))
                }

            }


            if (!resources_to_copy.isNullOrEmpty()) {
                val extraSteps = mutableListOf<ScriptBuildStep>()
                val stepIds = mutableListOf<String>()
                var stepIdSuffix = 0
                for (resource in resources_to_copy) {
                    val resourceGitUrl = resource.getString("resourceGitUrl")
                    val resourceGitBranch = resource.getString("resourceGitBranch")
                    val resourceSourceFolder = resource.getString("resourceSourceFolder")
                    val resourceTargetFolder = resource.getString("resourceTargetFolder")

                    val stepId = "COPY_RESOURCES$stepIdSuffix"
                    stepIds.add(stepId)

                    extraSteps.add(ScriptBuildStep {
                        id = stepId
                        name = "Copy resources from git to S3"
                        scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        export RESOURCE_DIR="resource$stepIdSuffix"
                        
                        git clone --single-branch --branch $resourceGitBranch $resourceGitUrl ${'$'}RESOURCE_DIR
                        export S3_BUCKET_NAME=tenant-doctools-%env.DEPLOY_ENV%-builds
                        if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                            echo "Setting credentials to access prod"
                            export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                            export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                            export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                        fi
                        
                        echo "Copying files to S3"
                        aws s3 sync ./${'$'}RESOURCE_DIR/$resourceSourceFolder/ s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH%/$resourceTargetFolder --delete
                    """.trimIndent()
                    })

                    stepIdSuffix += 1

                }

                steps {
                    extraSteps.forEach(this::step)
                    stepsOrder.addAll(2, stepIds)
                }
            }

            features {
                sshAgent {
                    teamcitySshKey = "sys-doc.rsa"
                }
            }

            if (build_env == "int") {
                triggers {
                    vcs {
                        triggerRules = """
                        -:root=${vcsrootmasteronly.id}:**
                    """.trimIndent()
                    }
                }
            }
        })

        class PublishToS3IndexProd(publish_path: String, doc_id: String) : BuildType({
            templates(CrawlDocumentAndUpdateSearchIndex)
            id = RelativeId(removeSpecialCharacters("prod$doc_id"))
            name = "Copy from staging to prod"

            params {
                password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
                text("DOC_ID", doc_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("DEPLOY_ENV", "prod", display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.PUBLISH_PATH", publish_path, display = ParameterDisplay.HIDDEN, allowEmpty = false)
            }

            steps {
                script {
                    id = "COPY_FROM_STAGING_TO_PROD"
                    name = "Copy from S3 on staging to S3 on Prod"
                    scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Copying from staging to Teamcity"
                    aws s3 sync s3://tenant-doctools-staging-builds/%env.PUBLISH_PATH% %env.PUBLISH_PATH%/ --delete
                    
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    
                    echo "Uploading from Teamcity to prod"
                    aws s3 sync %env.PUBLISH_PATH%/ s3://tenant-doctools-prod-builds/%env.PUBLISH_PATH% --delete
                """.trimIndent()
                }

                stepsOrder = arrayListOf("COPY_FROM_STAGING_TO_PROD", "BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC")

            }

        })

        val builds = mutableListOf<BuildType>()

        val docId = doc.getString("id")
        val publishPath = doc.getString("url")
        val docTitle = doc.getString("title")

        val metadata = doc.getJSONObject("metadata")
        val platform = metadata.getJSONArray("platform").joinToString(separator = ",")
        val environments = doc.getJSONArray("environments")
        val indexForSearch = if (doc.has("indexForSearch")) doc.getBoolean("indexForSearch") else true

        val build = getObjectById(buildConfigs, "docId", docId)
        val filter = if (build.has("filter")) build.getString("filter") else ""

        val indexRedirect = if (build.has("indexRedirect")) build.getBoolean("indexRedirect").toString() else "false"

        val root = build.getString("root")
        val sourceId = build.getString("srcId")
        val vcsRootId = RelativeId(removeSpecialCharacters(product_name + version + docId + sourceId))
        val (sourceGitUrl, sourceGitBranch) = getSourceById(sourceId, sourceConfigs)

        val resourcesToCopy = mutableListOf<JSONObject>()
        if (build.has("resources")) {
            val resources = build.getJSONArray("resources")
            for (j in 0 until resources.length()) {
                val resource = resources.getJSONObject(j)
                val resourceVcsId = resource.getString("srcId")
                val (resourceGitUrl, resourceGitBranch) = getSourceById(resourceVcsId, sourceConfigs)
                val resourceSourceFolder = resource.getString("sourceFolder")
                val resourceTargetFolder = resource.getString("targetFolder")
                val resourceObject = JSONObject()
                resourceObject.put("resourceGitUrl", resourceGitUrl)
                resourceObject.put("resourceGitBranch", resourceGitBranch)
                resourceObject.put("resourceSourceFolder", resourceSourceFolder)
                resourceObject.put("resourceTargetFolder", resourceTargetFolder)
                resourcesToCopy.add(resourceObject)
            }
        }

        for (env in environments) {
            if (env == "prod") {
                builds.add(PublishToS3IndexProd(publishPath, docId))
            } else {
                builds.add(BuildPublishToS3Index(product_name, platform, version, docTitle, docId, filter, root, indexRedirect, env as String,
                        publishPath, sourceGitUrl, sourceGitBranch, resourcesToCopy, vcsRootId, indexForSearch))
            }
        }

        return Project {
            id = RelativeId(removeSpecialCharacters(docTitle + product_name + version + docId))
            name = "$docTitle $platform $product_name $version"

            vcsRoot(DocVcsRoot(vcsRootId, sourceGitUrl, sourceGitBranch))

            builds.forEach(this::buildType)
        }
    }

    fun createProjects(): List<Project> {

        val products = mutableListOf<String>()
        val noProductLabel = "No product"
        for (i in 0 until docConfigs.length()) {
            val doc = docConfigs.getJSONObject(i)
            val metadata = doc.getJSONObject("metadata")
            if (metadata.has("product")) {
                val docProducts = metadata.getJSONArray("product")
                for (docProduct in docProducts) {
                    if (!products.contains(docProduct.toString())) {
                        products.add(docProduct.toString())
                    }
                }
            } else if (!products.contains(noProductLabel)) {
                products.add(noProductLabel)
            }
        }
        val subProjects = mutableListOf<Project>()
        for (product in products) {
            val docsInProduct = mutableListOf<JSONObject>()
            for (i in 0 until docConfigs.length()) {
                val doc = docConfigs.getJSONObject(i)
                val docId = doc.getString("id")
                if (!getObjectById(buildConfigs, "docId", docId).isEmpty && !docsInProduct.contains(doc)) {
                    val metadata = doc.getJSONObject("metadata")
                    if (metadata.has("product") && metadata.getJSONArray("product").contains(product)) {
                        docsInProduct.add(doc)
                    } else if (!metadata.has("product") && product == noProductLabel) {
                        docsInProduct.add(doc)
                    }
                }
            }
            if (!docsInProduct.isNullOrEmpty()) {
                subProjects.add(createProductProject(product, docsInProduct))
            }
        }
        return subProjects
    }

    fun createSourceValidationsFromConfig(): List<Project> {

        class ValidateDoc(build_info: JSONObject, vcs_root_id: RelativeId, git_source_id: String, git_source_branch: String) : BuildType({
            templates(RunContentValidations)

            val docBuildRootMap = build_info.getString("root")
            val docBuildFilter = if (build_info.has("filter")) build_info.getString("filter") else ""
            val docBuildIndexRedirect = if (build_info.has("indexRedirect")) build_info.getBoolean("indexRedirect").toString() else "false"
            val docBuildDocId = build_info.getString("docId")
            val doc = getObjectById(docConfigs, "id", docBuildDocId)
            val docId = doc.getString("id")
            val docTitle = doc.getString("title")
            val docMetadata = doc.getJSONObject("metadata")
            val docProduct = docMetadata.getJSONArray("product").joinToString(separator = ",")
            val docPlatform = docMetadata.getJSONArray("platform").joinToString(separator = ",")
            val docVersion = docMetadata.getString("version")

            id = RelativeId(removeSpecialCharacters(docProduct + docVersion + docId + "validatedoc"))
            name = "Validate $docTitle $docPlatform $docVersion"

            params {
                text("GW_PRODUCT", docProduct, allowEmpty = false)
                text("GW_PLATFORM", docPlatform, allowEmpty = false)
                text("GW_VERSION", docVersion, allowEmpty = false)
                text("FILTER_PATH", docBuildFilter, allowEmpty = false)
                text("CREATE_INDEX_REDIRECT", docBuildIndexRedirect, allowEmpty = false)
                text("ROOT_MAP", docBuildRootMap, allowEmpty = false)
                text("DOC_ID", docId, allowEmpty = false)
                text("env.SOURCES_ROOT", "src_root", allowEmpty = false)
                text("DITA_OT_WORKING_DIR", "%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%", allowEmpty = false)
                text("env.DOC_INFO", "%teamcity.build.workingDir%/doc_info.json", display = ParameterDisplay.HIDDEN, allowEmpty = false)
            }
            steps {
                script {
                    name = "Get document details"
                    id = "GET_DOCUMENT_DETAILS"

                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        jq -n '$build_info' | jq '. += {"gitBuildBranch": "%teamcity.build.vcs.branch.$vcs_root_id%", "gitSourceId": "$git_source_id"}' > %env.DOC_INFO%
                        cat %env.DOC_INFO%
                        
                    """.trimIndent()
                }

                stepsOrder = arrayListOf("GET_DOCUMENT_DETAILS", "BUILD_GUIDEWIRE_WEBHELP", "BUILD_NORMALIZED_DITA", "RUN_SCHEMATRON_VALIDATIONS", "RUN_DOC_VALIDATOR")

            }

            vcs {
                root(vcs_root_id, "+:. => %env.SOURCES_ROOT%")
                cleanCheckout = true
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${vcs_root_id}:**
                    """.trimIndent()

                    branchFilter = """
                        +:*
                        -:<default>
                    """.trimIndent()
                }
            }

            features {
                commitStatusPublisher {
                    vcsRootExtId = vcs_root_id.toString()
                    publisher = bitbucketServer {
                        url = "https://stash.guidewire.com"
                        userName = "%serviceAccountUsername%"
                        password = "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
                    }
                }

                pullRequests {
                    vcsRootExtId = vcs_root_id.toString()
                    provider = bitbucketServer {
                        serverUrl = "https://stash.guidewire.com"
                        authType = password {
                            username = "%serviceAccountUsername%"
                            password = "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
                        }
                        filterTargetBranch = "refs/heads/$git_source_branch"
                    }
                }
            }
        })

        class CleanValidationResults(vcs_root_id: RelativeId, git_source_id: String, git_source_url: String) : BuildType({
            id = RelativeId(removeSpecialCharacters(git_source_id + "cleanresults"))
            name = "Clean validation results for $git_source_id"

            params {
                text("env.ELASTICSEARCH_URLS", "https://docsearch-doctools.int.ccs.guidewire.net", display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.GIT_SOURCE_ID", git_source_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.GIT_SOURCE_URL", git_source_url, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.SOURCES_ROOT", "src_root", display = ParameterDisplay.HIDDEN, allowEmpty = false)
            }

            steps {

                script {
                    name = "Run the results cleaner"
                    id = "RUN_RESULTS_CLEANER"
                    executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
                    scriptContent = """
                        #!/bin/bash
                        set -xe
        
                        results_cleaner --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --git-source-id "%env.GIT_SOURCE_ID%" --git-source-url "%env.GIT_SOURCE_URL%"
                    """.trimIndent()
                    dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-validator:latest"
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            vcs {
                root(vcs_root_id, "+:. => %env.SOURCES_ROOT%")
                cleanCheckout = true
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${vcs_root_id}:**
                    """.trimIndent()

                    branchFilter = """
                        +:<default>
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

        val sourcesToValidate = mutableListOf<Project>()
        for (i in 0 until sourceConfigs.length()) {
            val source = sourceConfigs.getJSONObject(i)
            if (!source.has("xdocsPathIds")) {
                val sourceDocBuilds = mutableListOf<JSONObject>()
                val sourceId = source.getString("id")
                val sourceTitle = source.getString("title")
                val sourceGitUrl = source.getString("gitUrl")
                val sourceGitBranch = if (source.has("branch")) source.getString("branch") else "master"

                for (j in 0 until buildConfigs.length()) {
                    val build = buildConfigs.getJSONObject(j)
                    val buildSrcId = build.getString("srcId")
                    if (buildSrcId == sourceId) {
                        sourceDocBuilds.add(build)
                    }
                }

                if (!sourceDocBuilds.isNullOrEmpty()) {
                    sourcesToValidate.add(
                            Project {
                                id = RelativeId(removeSpecialCharacters(sourceId + sourceGitBranch))
                                name = "$sourceTitle ($sourceId)"

                                vcsRoot(DocVcsRoot(RelativeId(sourceId), sourceGitUrl, sourceGitBranch))
                                buildType(CleanValidationResults(RelativeId(sourceId), sourceId, sourceGitUrl))

                                for (docBuild in sourceDocBuilds) {
                                    buildType(ValidateDoc(docBuild, RelativeId(sourceId), sourceId, sourceGitBranch))
                                }

                            }

                    )
                }
            }
        }
        return sourcesToValidate
    }
}

object ExportFilesFromXDocsToBitbucket : BuildType({
    name = "Export files from XDocs to Bitbucket"

    maxRunningBuilds = 1

    params {
        text("env.EXPORT_PATH_IDS", "", description = "A list of space-separated path IDs from XDocs", display = ParameterDisplay.PROMPT, allowEmpty = true)
        text("env.GIT_URL", "", description = "The URL of the Bitbucket repository where the files exported from XDocs are added", display = ParameterDisplay.PROMPT, allowEmpty = true)
        text("env.GIT_BRANCH", "", description = "The branch of the Bitbucket repository where the files exported from XDocs are added", display = ParameterDisplay.PROMPT, allowEmpty = true)
        text("env.SOURCES_ROOT", "src_root", label = "Git clone directory", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.XDOCS_EXPORT_DIR", "%system.teamcity.build.tempDir%/xdocs_export_dir", display = ParameterDisplay.HIDDEN, allowEmpty = false)
    }

    vcs {
        root(AbsoluteId("DocumentationTools_XDocsClient"))

        cleanCheckout = true
    }

    steps {
        script {
            name = "Export files from XDocs"
            id = "EXPORT_FILES_FROM_XDOCS"
            workingDir = "LocalClient/sample/local/bin"
            scriptContent = """
                #!/bin/bash
                chmod 777 runExport.sh
                for path in %env.EXPORT_PATH_IDS%; do ./runExport.sh "${'$'}path" %env.XDOCS_EXPORT_DIR%; done
            """.trimIndent()
        }
        script {
            name = "Add exported files to Bitbucket"
            id = "RUNNER_2622"
            scriptContent = """
                #!/bin/bash
                set -xe
                git config --global user.email "doctools@guidewire.com"
                git config --global user.name "%serviceAccountUsername%"
                git clone --single-branch --branch %env.GIT_BRANCH% %env.GIT_URL% %env.SOURCES_ROOT%
                cp -R %env.XDOCS_EXPORT_DIR%/* %env.SOURCES_ROOT%/
                cd %env.SOURCES_ROOT%
                git add -A
                if git status | grep "Changes to be committed"
                then
                  git commit -m "[TeamCity] Adds files exported from XDocs"
                  git pull
                  git push
                else
                  echo "No changes to commit"
                fi
            """.trimIndent()
        }
    }

    features {
        sshAgent {
            id = "ssh-agent-build-feature"
            teamcitySshKey = "sys-doc.rsa"
        }
    }
})

object CreateReleaseTag : BuildType({
    name = "Create a release tag"

    val gitRepositories = mutableListOf<String>()
    for (i in 0 until HelperObjects.sourceConfigs.length()) {
        val source = HelperObjects.sourceConfigs.getJSONObject(i)
        val gitUrl = source.getString("gitUrl")
        val branchName = if (source.has("branch")) source.getString("branch") else "master"
        if (branchName == "master") {
            gitRepositories.add(gitUrl)
        }
    }

    params {
        text("env.SOURCES_ROOT", "src_root", label = "Git clone directory", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.TAG_VERSION", "", description = "Version of InsuranceSuite for which you want to create a documentation tag. Example: 10.1.0", display = ParameterDisplay.PROMPT,
                regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""", validationMessage = "Invalid SemVer format")
        select("env.GIT_URL", "", display = ParameterDisplay.PROMPT, options = gitRepositories)
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -xe
                export TAG_NAME="v%env.TAG_VERSION%"

                git config --global user.email "doctools@guidewire.com"
                git config --global user.name "%serviceAccountUsername%"
                
                git clone %env.GIT_URL% %env.SOURCES_ROOT%
                cd %env.SOURCES_ROOT%
                
                git tag -a "${'$'}TAG_NAME" -m "Documentation ${'$'}TAG_VERSION"
                echo "Created tag ${'$'}TAG_NAME"
                git push origin "${'$'}TAG_NAME"
                echo "Pushed tag to the remote repository"
            """.trimIndent()
        }
    }

    features {
        sshAgent {
            teamcitySshKey = "sys-doc.rsa"
        }
    }
})

object RunContentValidations : Template({
    name = "Run content validations"

    artifactRules = "**/*.log => logs"

    params {
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.FILTER_PATH", "%FILTER_PATH%", allowEmpty = false)
        text("env.CREATE_INDEX_REDIRECT", "%CREATE_INDEX_REDIRECT%", allowEmpty = false)
        text("env.ROOT_MAP", "%ROOT_MAP%", allowEmpty = false)
        text("env.DOC_ID", "%DOC_ID%", allowEmpty = false)
        text("env.DITA_OT_WORKING_DIR", "%DITA_OT_WORKING_DIR%", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "https://docsearch-doctools.int.ccs.guidewire.net", display = ParameterDisplay.HIDDEN, allowEmpty = true)
        text("env.NORMALIZED_DITA_DIR", "%env.DITA_OT_WORKING_DIR%/normalized_dita", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.DITA_OT_LOGS_DIR", "%env.DITA_OT_WORKING_DIR%/dita_ot_logs", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.SCHEMATRON_REPORTS_DIR", "%env.DITA_OT_WORKING_DIR%/schematron_reports", display = ParameterDisplay.HIDDEN, allowEmpty = false)
    }

    steps {
        script {
            name = "Create directories"
            id = "CREATE_DIRECTORIES"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                mkdir -p %env.NORMALIZED_DITA_DIR%
                mkdir -p %env.DITA_OT_LOGS_DIR%
                mkdir -p %env.SCHEMATRON_REPORTS_DIR%
            """.trimIndent()
        }

        script {
            name = "Build Guidewire webhelp"
            id = "BUILD_GUIDEWIRE_WEBHELP"
            scriptContent = """
                #!/bin/bash
                set -xe

                export OUTPUT_PATH="out/webhelp"
                export LOG_FILE="${'$'}{OUTPUT_PATH}/webhelp_build.log"

                export DITA_BASE_COMMAND="docker run -i -v %env.DITA_OT_WORKING_DIR%:/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest -i \"/src/%env.ROOT_MAP%\" -o \"/src/${'$'}OUTPUT_PATH\" -f webhelp_Guidewire --use-doc-portal-params yes --gw-product \"%env.GW_PRODUCT%\" --gw-platform \"%env.GW_PLATFORM%\" --gw-version \"%env.GW_VERSION%\" -l \"/src/${'$'}LOG_FILE\""
                
                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"/src/%env.FILTER_PATH%\""
                fi

                if [[ "%env.CREATE_INDEX_REDIRECT%" == "true" ]]; then
                    export DITA_BASE_COMMAND+=" --create-index-redirect yes --webhelp.publication.toc.links all"
                fi
                
                SECONDS=0
                docker login -u '%env.ARTIFACTORY_USERNAME%' --password '%env.ARTIFACTORY_PASSWORD%' artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest

                echo "Building Guidewire webhelp for %env.GW_PRODUCT% %env.GW_PLATFORM% %env.GW_VERSION%"
                mkdir -p "%env.DITA_OT_WORKING_DIR%/${'$'}{OUTPUT_PATH}"
                ${'$'}DITA_BASE_COMMAND
                
                cp %env.DITA_OT_WORKING_DIR%/${'$'}LOG_FILE %env.DITA_OT_LOGS_DIR%/
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
        }

        script {
            name = "Build normalized DITA"
            id = "BUILD_NORMALIZED_DITA"
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            scriptContent = """
                #!/bin/bash
                set -xe

                export OUTPUT_PATH="out/dita"
                export LOG_FILE="${'$'}{OUTPUT_PATH}/dita_build.log"
                
                export DITA_BASE_COMMAND="docker run -i -v %env.DITA_OT_WORKING_DIR%:/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest -i \"/src/%env.ROOT_MAP%\" -o \"/src/${'$'}OUTPUT_PATH\" -f dita -l \"/src/${'$'}LOG_FILE\""

                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"/src/%env.FILTER_PATH%\""
                fi

                SECONDS=0
                docker login -u '%env.ARTIFACTORY_USERNAME%' --password '%env.ARTIFACTORY_PASSWORD%' artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest

                echo "Building normalized DITA"
                mkdir -p "%env.DITA_OT_WORKING_DIR%/${'$'}{OUTPUT_PATH}"
                ${'$'}DITA_BASE_COMMAND
                
                cp -R %env.DITA_OT_WORKING_DIR%/${'$'}OUTPUT_PATH/* %env.NORMALIZED_DITA_DIR%/
                cp %env.DITA_OT_WORKING_DIR%/${'$'}LOG_FILE %env.DITA_OT_LOGS_DIR%/

                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
        }

        script {
            name = "Run Schematron validations"
            id = "RUN_SCHEMATRON_VALIDATIONS"
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export OUTPUT_PATH="out/validate"
                export TEMP_DIR="tmp/validate"
                export LOG_FILE="${'$'}{OUTPUT_PATH}/validate_build.log"
                
                SECONDS=0
                docker login -u '%env.ARTIFACTORY_USERNAME%' --password '%env.ARTIFACTORY_PASSWORD%' artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest
 
                echo "Running the validate plugin"
                mkdir -p "%env.DITA_OT_WORKING_DIR%/${'$'}{OUTPUT_PATH}"
                docker run -i -v %env.DITA_OT_WORKING_DIR%:/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest -i \"/src/%env.ROOT_MAP%\" -o \"/src/${'$'}OUTPUT_PATH\" -f validate --clean.temp no --temp \"/src/${'$'}TEMP_DIR\" -l \"/src/${'$'}LOG_FILE\"
                
                cp %env.DITA_OT_WORKING_DIR%/${'$'}TEMP_DIR/validation-report.xml %env.SCHEMATRON_REPORTS_DIR%/
                cp %env.DITA_OT_WORKING_DIR%/${'$'}LOG_FILE %env.DITA_OT_LOGS_DIR%/
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
        }

        script {
            name = "Run the doc validator"
            id = "RUN_DOC_VALIDATOR"
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            scriptContent = """
                #!/bin/bash
                set -xe
                
                doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" validators "%env.NORMALIZED_DITA_DIR%" dita \
                  && doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" validators "%env.NORMALIZED_DITA_DIR%" images \
                  && doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" validators "%env.NORMALIZED_DITA_DIR%" files \
                  && doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" validators "%env.NORMALIZED_DITA_DIR%" content \
                  && doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" extractors "%env.DITA_OT_LOGS_DIR%" dita-ot-logs \
                  && doc_validator --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --doc-info "%env.DOC_INFO%" extractors "%env.SCHEMATRON_REPORTS_DIR%" schematron-reports
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-validator:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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

object BuildOutputFromDita : Template({
    name = "Build the output from DITA"

    params {
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.GW_TITLE", "%GW_TITLE%", allowEmpty = false)
        text("env.FILTER_PATH", "%FILTER_PATH%", allowEmpty = false)
        text("env.ROOT_MAP", "%ROOT_MAP%", allowEmpty = false)
        text("env.GIT_URL", "%GIT_URL%", allowEmpty = false)
        text("env.GIT_BRANCH", "%GIT_BRANCH%", allowEmpty = false)
        text("env.BUILD_PDF", "%BUILD_PDF%", allowEmpty = false)
        text("env.CREATE_INDEX_REDIRECT", "%CREATE_INDEX_REDIRECT%", allowEmpty = false)
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
    }

    vcs {
        cleanCheckout = true
    }

    steps {
        script {
            name = "Build output from DITA"
            id = "BUILD_OUTPUT_FROM_DITA"
            scriptContent = """
                #!/bin/bash
                set -xe

                export OUTPUT_PATH="out"
                export WORKING_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%"

                export DITA_BASE_COMMAND="docker run -i -v ${'$'}WORKING_DIR:/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest -i \"/src/%env.ROOT_MAP%\" -o \"/src/${'$'}OUTPUT_PATH\" --use-doc-portal-params yes --gw-product \"%env.GW_PRODUCT%\" --gw-platform \"%env.GW_PLATFORM%\" --gw-version \"%env.GW_VERSION%\" --gw-title \"%env.GW_TITLE%\""
                
                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"/src/%env.FILTER_PATH%\""
                fi
                
                if [[ "%env.BUILD_PDF%" == "true" ]]; then
                    export DITA_BASE_COMMAND+=" -f wh-pdf --git.url \"%env.GIT_URL%\" --git.branch \"%env.GIT_BRANCH%\" --dita.ot.pdf.format pdf5_Guidewire"
                elif [[ "%env.BUILD_PDF%" == "false" ]]; then
                    export DITA_BASE_COMMAND+=" -f webhelp_Guidewire_validate"
                fi
                
                if [[ "%env.CREATE_INDEX_REDIRECT%" == "true" ]]; then
                    export DITA_BASE_COMMAND+=" --create-index-redirect yes --webhelp.publication.toc.links all"
                fi
                
                SECONDS=0
                docker login -u '%env.ARTIFACTORY_USERNAME%' --password '%env.ARTIFACTORY_PASSWORD%' artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest

                echo "Building output for %env.GW_PRODUCT% %env.GW_PLATFORM% %env.GW_VERSION%"
                ${'$'}DITA_BASE_COMMAND

                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
        }
    }

})

object CrawlDocumentAndUpdateSearchIndex : Template({
    name = "Update the search index"
    artifactRules = """
        **/*.log => logs
    """.trimIndent()

    params {
        text("env.DEPLOY_ENV", "%DEPLOY_ENV%", label = "Deployment environment", description = "The environment on which you want reindex documents", allowEmpty = false)
        text("env.DOC_ID", "%DOC_ID%", label = "Doc ID", description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.", allowEmpty = true)
        text("env.CONFIG_FILE_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.CONFIG_FILE_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.DOC_S3_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.DOC_S3_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS_PROD", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.APP_BASE_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.APP_BASE_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)
        text("env.INDEX_NAME", "gw-docs", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    steps {
        dockerCommand {
            name = "Build a Python Docker image"
            id = "BUILD_CRAWLER_DOCKER_IMAGE"
            commandType = build {
                source = file {
                    path = "apps/Dockerfile"
                }
                namesAndTags = "python-runner"
                commandArgs = "--pull"
            }
            param("dockerImage.platform", "linux")
        }
        script {
            name = "Crawl the document and update the index"
            id = "CRAWL_DOC"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export DOC_S3_URL="%env.DOC_S3_URL_PROD%"
                    export ELASTICSEARCH_URLS="%env.ELASTICSEARCH_URLS_PROD%"
                    export CONFIG_FILE_URL="%env.CONFIG_FILE_URL_PROD%"
                    export APP_BASE_URL="%env.APP_BASE_URL_PROD%"
                fi
                
                curl ${'$'}CONFIG_FILE_URL > %teamcity.build.workingDir%/config.json
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"               

                cd apps/search_indexer
                make run-doc-crawler
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    features {
        dockerSupport {
            id = "DockerSupport"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }
})

object ServiceBuilds : Project({
    name = "Service builds"
    description = "Builds used as a service to other builds. You can also run the service builds manually."

    buildType(ExportFilesFromXDocsToBitbucket)
    buildType(CreateReleaseTag)
})

object XdocsExportBuilds : Project({
    name = "XDocs export builds"

    val builds = HelperObjects.createExportBuildsFromConfig()
    builds.forEach(this::buildType)
})

object Content : Project({
    name = "Content"

    subProject(ServiceBuilds)
    subProject(XdocsExportBuilds)
    buildType(UpdateSearchIndex)
    buildType(CleanUpIndex)
    buildType(TestContent)
})

object Services : Project({
    name = "Services"

    buildType(DeployS3Ingress)
    buildType(DeploySearchService)
})

object Docs : Project({
    name = "Docs"

    HelperObjects.createProjects().forEach(this::subProject)
})

object Sources : Project({
    name = "Sources"

    HelperObjects.createSourceValidationsFromConfig().forEach(this::subProject)
})



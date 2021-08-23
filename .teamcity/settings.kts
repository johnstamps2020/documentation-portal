import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.*
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.ScheduleTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import kotlin.random.Random.Default.nextInt

version = "2020.1"

project {

    vcsRoot(vcsrootmasteronly)
    vcsRoot(vcsroot)
    vcsRoot(LocalizedPDFs)

    template(Deploy)
    template(BuildDocSiteOutputFromDita)
    template(BuildDocSiteAndLocalOutputFromDita)
    template(BuildDockerImage)
    template(BuildYarn)
    template(BuildSphinx)
    template(BuildStorybook)
    template(CrawlDocumentAndUpdateSearchIndex)
    template(RunContentValidations)

    params {
        param("env.NAMESPACE", "doctools")
    }

    subProject(Infrastructure)
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

object LocalizedPDFs : GitVcsRoot({
    name = "Localization PDFs"
    url = "ssh://git@stash.guidewire.com/docsources/localization-pdfs.git"
    branch = "refs/heads/main"
    authMethod = uploadedKey {
        uploadedKey = "sys-doc.rsa"
    }
})

object Checkmarx : BuildType({
    templates(AbsoluteId("CheckmarxSastScan"))
    name = "Checkmarx"

    params {
        text("checkmarx.project.name", "doctools")
        text(
            "checkmarx.location.files.exclude ", """
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
            """.trimIndent()
        )
    }

    vcs {
        root(DslContext.settingsRoot)
        cleanCheckout = true
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
        param("env.PARTNERS_LOGIN_URL", "https://qaint-guidewire.cs4.force.com/partners/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://qaint-guidewire.cs4.force.com/customers/idp/endpoint/HttpRedirect")
    }

    vcs {
        cleanCheckout = true
    }

    triggers {
        finishBuildTrigger {
            id = "TRIGGER_1"
            buildType = "${TestDocPortalServer.id}"
            successfulOnly = true
        }
    }

    dependencies {
        snapshot(Checkmarx) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
        snapshot(TestDocPortalServer) {
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
        snapshot(TestDocPortalServer) {
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
        text(
            "env.TAG_VERSION", "", label = "Deploy Version", display = ParameterDisplay.PROMPT,
            regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""", validationMessage = "Invalid SemVer Format"
        )
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
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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
        text(
            "env.TAG_VERSION", "", label = "Deploy Version", display = ParameterDisplay.PROMPT,
            regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""", validationMessage = "Invalid SemVer Format"
        )
        param("env.PARTNERS_LOGIN_URL", "https://uat-guidewire.cs23.force.com/partners/idp/endpoint/HttpRedirect")
        param("env.CUSTOMERS_LOGIN_URL", "https://uat-guidewire.cs23.force.com/customers/idp/endpoint/HttpRedirect")
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
        select(
            "semver-scope", "patch", label = "Version Scope", display = ParameterDisplay.PROMPT,
            options = listOf("Patch" to "patch", "Minor" to "minor", "Major" to "major")
        )
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
                git config --local user.email "doctools@guidewire.com"
                git config --local user.name "sys-doc"
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
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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

object TestDocPortalServer : BuildType({
    name = "Test Doc Portal server app"

    params {
        text("env.APP_BASE_URL", "http://localhost/", allowEmpty = false)
        text("env.INDEX_NAME", "gw-docs", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "http://localhost:9200")
        text("env.ELASTIC_SEARCH_URL", "http://localhost:9200")
        text("env.DOC_S3_URL", "http://localhost/")
        text(
            "env.CONFIG_FILE",
            "%teamcity.build.workingDir%/apps/doc_crawler/tests/test_doc_crawler/resources/input/config/gw-docs.json"
        )
        text("env.TEST_ENVIRONMENT_DOCKER_NETWORK", "host", allowEmpty = false)
    }

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
//        dockerCompose {
//            name = "Compose services"
//            file = "apps/doc_crawler/tests/test_doc_crawler/resources/docker-compose.yml"
//        }
//
//        dockerCommand {
//            name = "Build the Doc Crawler Docker image locally"
//            commandType = build {
//                source = file {
//                    path = "apps/doc_crawler/Dockerfile"
//                }
//                namesAndTags = "doc-crawler:local"
//                commandArgs = "--pull"
//            }
//            param("dockerImage.platform", "linux")
//        }
//
//        script {
//            name = "Crawl the document and update the local index"
//            id = "CRAWL_DOC"
//            scriptContent = """
//                #!/bin/bash
//                set -xe
//
//                cat > scrapy.cfg <<- EOM
//                [settings]
//                default = doc_crawler.settings
//                EOM
//
//                doc_crawler
//            """.trimIndent()
//            dockerImage = "doc-crawler:local"
//            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
//        }
//
//        script {
//            name = "Test the Node.js server app"
//            scriptContent = """
//                set -e
//                export APP_BASE_URL=http://localhost:8081
//                cd server/
//                npm install
//                npm test
//            """.trimIndent()
//            dockerImage = "artifactory.guidewire.com/hub-docker-remote/node:14-alpine"
//            dockerPull = true
//        }
        script {
            name = "Disable temporarily"
            scriptContent = """
                echo Tests are acting weird so we disabled them.
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            triggerRules = """
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

object TestSettingsKts : BuildType({
    name = "Test settings.kts"

    vcs {
        root(DslContext.settingsRoot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Test settings.kts"
            scriptContent = """
                set -e
                FILE=.teamcity/settings.kts
                if test -f "${'$'}FILE"; then
                    echo "${'$'}FILE exists."
                fi
                echo "Fake test successful! (remember to add real tests at some point 👻)"
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:.teamcity/settings.kts
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
    }
})

object DeploySearchService : BuildType({
    name = "Deploy a search service"
    description = "Creates or updates a search service ingress for a selected environment"

    params {
        select(
            "env.DEPLOY_ENV", "", display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "us-east-2")
        )
        text("env.DEPLOYMENT_NAME", "docsearch-%env.DEPLOY_ENV%", display = ParameterDisplay.HIDDEN)
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
                    export KUBE_FILE=apps/doc_crawler/kube/deployment-prod.yml
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                    export KUBE_FILE=apps/doc_crawler/kube/deployment.yml
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
        select(
            "env.DEPLOY_ENV", "", display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod" to "us-east-2", "portal2")
        )
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
                elif [[ "%env.DEPLOY_ENV%" == "portal2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    export KUBE_FILE=s3/kube/ingress-portal2.yml
                    export DEPLOY_ENV="us-east-2"
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
        select(
            "DEPLOY_ENV",
            "",
            label = "Deployment environment",
            description = "The environment on which you want reindex documents",
            display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod", "portal2")
        )
        text(
            "DOC_ID",
            "",
            label = "Doc ID",
            description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.",
            display = ParameterDisplay.PROMPT,
            allowEmpty = true
        )
    }
})

object PublishIndexCleanerDockerImage : BuildType({
    name = "Publish Index Cleaner image"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish Index Cleaner image to Artifactory"
            scriptContent = """
                set -xe
                cd apps/index_cleaner
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:apps/index_cleaner/**
                -:user=doctools:**
            """.trimIndent()
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

object PublishSitemapGeneratorDockerImage : BuildType({
    name = "Publish the image for Sitemap Generator"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish the image for Sitemap Generator to Artifactory"
            scriptContent = """
                set -xe
                cd apps/sitemap_generator
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:apps/sitemap_generator/**
                -:user=doctools:**
            """.trimIndent()
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

object CleanUpIndex : BuildType({
    name = "Clean up index"
    description = "Remove documents from index which are not in the config"

    params {
        select(
            "env.DEPLOY_ENV",
            "",
            label = "Deployment environment",
            description = "Select an environment on which you want clean up the index",
            display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod")
        )
        text(
            "env.CONFIG_FILE_URL",
            "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json",
            allowEmpty = false
        )
        text(
            "env.CONFIG_FILE_URL_PROD",
            "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json",
            allowEmpty = false
        )
        text(
            "env.ELASTICSEARCH_URLS",
            "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net",
            allowEmpty = false
        )
        text(
            "env.ELASTICSEARCH_URLS_PROD",
            "https://docsearch-doctools.internal.us-east-2.service.guidewire.net",
            allowEmpty = false
        )

    }

    steps {
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

                index_cleaner
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/index-cleaner:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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

object GenerateSitemap : BuildType({
    name = "Generate sitemap.xml"
    description = "Create a sitemap based on the search index"

    params {
        select(
            "env.DEPLOY_ENV",
            "us-east-2",
            label = "Deployment environment",
            description = "Select an environment on which you want clean up the index",
            display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod" to "us-east-2")
        )
        text("env.OUTPUT_DIR", "%teamcity.build.checkoutDir%/build", allowEmpty = false)
        text(
            "env.ELASTICSEARCH_URLS",
            "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net",
            allowEmpty = false
        )
        text(
            "env.ELASTICSEARCH_URLS_PROD",
            "https://docsearch-doctools.internal.us-east-2.service.guidewire.net",
            allowEmpty = false
        )
        text("env.APP_BASE_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.APP_BASE_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)

    }

    vcs {
        root(vcsrootmasteronly)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Run the script which generates the sitemap"
            scriptContent = """
                #!/bin/bash
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export ELASTICSEARCH_URLS="%env.ELASTICSEARCH_URLS_PROD%"
                    export APP_BASE_URL="%env.APP_BASE_URL_PROD%"
                fi
                
                sitemap_generator
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/sitemap-generator:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Deploy sitemap to Kubernetes"
            id = "DEPLOY_TO_K8S"
            scriptContent = """
                #!/bin/bash 
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                fi
                sh %teamcity.build.workingDir%/ci/deployFilesToPersistentVolume.sh sitemap
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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

    triggers {
        schedule {
            schedulingPolicy = daily {
                hour = 1
                minute = 1
            }
            branchFilter = "+:<default>"
        }
    }
})

object TestDocCrawler : BuildType({
    name = "Test Doc Crawler"

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
            file = "apps/doc_crawler/tests/test_doc_crawler/resources/docker-compose.yml"
        }

        script {
            name = "Run tests for crawling documents and uploading index"
            scriptContent = """
                cd apps/doc_crawler
                ./test_doc_crawler.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:apps/doc_crawler/**
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
        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }
})

object PublishConfigDeployerDockerImage : BuildType({
    name = "Publish Config Deployer image"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish Config Deployer image to Artifactory"
            scriptContent = """
                set -xe
                cd apps/config_deployer
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:.teamcity/**/*.*
                +:apps/config_deployer/**
                -:user=doctools:**
            """.trimIndent()
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

    dependencies {
        snapshot(TestConfigDeployer) {
            reuseBuilds = ReuseBuilds.SUCCESSFUL
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object TestConfigDeployer : BuildType({
    name = "Test Config Deployer"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Run tests for config deployer"
            scriptContent = """
                #!/bin/bash
                set -xe
                cd apps/config_deployer
                ./test_config_deployer.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

    }

    triggers {
        vcs {
            triggerRules = """
                +:apps/config_deployer/**
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

        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }

})

object PublishFlailSsgDockerImage : BuildType({
    name = "Publish Flail SSG image"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish Flail SSG image to Artifactory"
            scriptContent = """
                set -xe
                cd frontend/flail_ssg
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:frontend/flail_ssg/**
                -:user=doctools:**
            """.trimIndent()
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

    dependencies {
        snapshot(TestFlailSsg) {
            reuseBuilds = ReuseBuilds.SUCCESSFUL
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object TestFlailSsg : BuildType({
    name = "Test Flail SSG"

    params {
        text("env.DOCS_INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/docs")
        text("env.DOCS_OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out/docs")
        text(
            "env.DOCS_CONFIG_FILE",
            "%env.DOCS_OUTPUT_DIR%/merge-all.json",
            display = ParameterDisplay.HIDDEN
        )
    }

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Prepare the docs config file"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer merge %env.DOCS_INPUT_DIR% -o %env.DOCS_OUTPUT_DIR%
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Run tests for Flail SSG"
            scriptContent = """
                #!/bin/bash
                set -xe
                cd frontend/flail_ssg
                ./test_flail_ssg.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

    }

    triggers {
        vcs {
            triggerRules = """
                +:frontend/**
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

        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }

})

object PublishLionPageBuilderDockerImage : BuildType({
    name = "Publish Lion Page Builder image"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish Lion Page Builder image to Artifactory"
            scriptContent = """
                set -xe
                cd apps/lion_page_builder
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:apps/lion_page_builder/**
                -:user=doctools:**
            """.trimIndent()
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

    dependencies {
        snapshot(TestLionPageBuilder) {
            reuseBuilds = ReuseBuilds.SUCCESSFUL
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object TestLionPageBuilder : BuildType({
    name = "Test Lion Page Builder"

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Run tests for Lion Page Builder"
            scriptContent = """
                #!/bin/bash
                set -xe
                cd apps/lion_page_builder
                ./test_lion_page_builder.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

    }

    triggers {
        vcs {
            triggerRules = """
                +:apps/lion_page_builder/**
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

        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
        }
    }

})

object DeployServerConfig : BuildType({
    name = "Deploy server config"

    params {
        text("env.INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/docs")
        text("env.OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out")
        select(
            "env.DEPLOY_ENV",
            "",
            label = "Deployment environment",
            description = "Select an environment on which you want deploy the config",
            display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod")
        )
    }

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Generate config file"
            scriptContent = """
                #!/bin/bash
                set -xe
                config_deployer deploy %env.INPUT_DIR% --deploy-env %env.DEPLOY_ENV% -o %env.OUTPUT_DIR%
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"
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
                
                aws s3 sync %env.OUTPUT_DIR% s3://tenant-doctools-%env.DEPLOY_ENV%-builds/portal-config --delete
                """.trimIndent()
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

object DeployFrontend : BuildType({
    name = "Deploy frontend"

    params {
        text("env.INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/docs")
        text("env.OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out")
        text(
            "env.DOCS_CONFIG_FILE",
            "%env.OUTPUT_DIR%/merge-all.json",
            display = ParameterDisplay.HIDDEN
        )
        text("env.PAGES_DIR", "%teamcity.build.checkoutDir%/frontend/pages", display = ParameterDisplay.HIDDEN)
        text("env.TEMPLATES_DIR", "%teamcity.build.checkoutDir%/frontend/templates", display = ParameterDisplay.HIDDEN)
        text("env.OUTPUT_DIR", "%teamcity.build.checkoutDir%/output", display = ParameterDisplay.HIDDEN)
        text("env.SEND_BOUNCER_HOME", "no", display = ParameterDisplay.HIDDEN)
        text("LION_SOURCES_ROOT", "pdf-src", display = ParameterDisplay.HIDDEN)
        text("env.LOC_DOCS_SRC", "%teamcity.build.checkoutDir%/%LION_SOURCES_ROOT%", display = ParameterDisplay.HIDDEN)
        text("env.LOC_DOCS_OUT", "%env.PAGES_DIR%/l10n", display = ParameterDisplay.HIDDEN)
        select(
            "env.DEPLOY_ENV",
            "dev",
            label = "Deployment environment",
            description = "Select an environment on which you want deploy the config",
            display = ParameterDisplay.PROMPT,
            options = listOf("dev", "int", "staging", "prod" to "us-east-2")
        )
    }

    vcs {
        root(vcsroot)
        cleanCheckout = true
    }

    vcs {
        root(LocalizedPDFs, "+:. => %LION_SOURCES_ROOT%")
        cleanCheckout = true
    }


    steps {
        script {
            name = "Merge docs config files"
            scriptContent = """
                #!/bin/bash
                set -xe
                config_deployer merge %env.INPUT_DIR% -o %env.OUTPUT_DIR%
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Generate localization page configurations"
            scriptContent = """
                #!/bin/bash
                set -xe
                lion_page_builder
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/lion-page-builder:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Copy localized PDFs to the S3 bucket"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ %env.DEPLOY_ENV% == "us-east-2" ]]; then
                  export DEPLOY_ENV=prod
                  export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                  export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                  export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                  export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                  export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                  export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"					
                fi
                
                aws s3 sync %env.LOC_DOCS_SRC% s3://tenant-doctools-${'$'}DEPLOY_ENV-builds/l10n --exclude ".git/*" --delete
            """.trimIndent()
        }
        script {
            name = "Build pages"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export DEPLOY_ENV=prod
                fi
                
                flail_ssg
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/flail-ssg:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Deploy to Kubernetes"
            scriptContent = """
                #!/bin/bash 
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "us-east-2" ]]; then
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                fi
                sh %teamcity.build.workingDir%/ci/deployFilesToPersistentVolume.sh frontend
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:root=${LocalizedPDFs.id}:**
                +:root=${vcsroot.id}:apps/lion_page_builder/**
                +:root=${vcsroot.id}:frontend/**
                -:user=doctools:**
            """.trimIndent()
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

object TestConfig : BuildType({
    name = "Test config files"

    params {
        text("env.DOCS_INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/docs")
        text("env.SOURCES_INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/sources")
        text("env.BUILDS_INPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/builds")
        text("env.DOCS_OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out/docs")
        text("env.SOURCES_OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out/sources")
        text("env.BUILDS_OUTPUT_DIR", "%teamcity.build.checkoutDir%/.teamcity/config/out/builds")
        text(
            "env.DOCS_CONFIG_FILE",
            "%env.DOCS_OUTPUT_DIR%/merge-all.json",
            display = ParameterDisplay.HIDDEN
        )
        text(
            "env.SOURCES_CONFIG_FILE",
            "%env.SOURCES_OUTPUT_DIR%/merge-all.json",
            display = ParameterDisplay.HIDDEN
        )
        text(
            "env.BUILDS_CONFIG_FILE",
            "%env.BUILDS_OUTPUT_DIR%/merge-all.json",
            display = ParameterDisplay.HIDDEN
        )
        text("env.SCHEMA_PATH", "%teamcity.build.checkoutDir%/.teamcity/config/config-schema.json")
    }

    vcs {
        root(vcsroot)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Merge config files"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer merge %env.DOCS_INPUT_DIR% -o %env.DOCS_OUTPUT_DIR%
                config_deployer merge %env.SOURCES_INPUT_DIR% -o %env.SOURCES_OUTPUT_DIR%
                config_deployer merge %env.BUILDS_INPUT_DIR% -o %env.BUILDS_OUTPUT_DIR%
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Run tests for config files"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer test %env.DOCS_CONFIG_FILE% --schema-path %env.SCHEMA_PATH%
                config_deployer test %env.SOURCES_CONFIG_FILE% --schema-path %env.SCHEMA_PATH%
                config_deployer test %env.BUILDS_CONFIG_FILE% --sources-path %env.SOURCES_CONFIG_FILE% --docs-path %env.DOCS_CONFIG_FILE% --schema-path %env.SCHEMA_PATH%  
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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
        dockerSupport {
            id = "TEMPLATE_BUILD_EXT_1"
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_155"
            }
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
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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
                if [[ "%env.DEPLOY_ENV%" == "dev" ]] || [[ "%env.DEPLOY_ENV%" == "int" ]]; then
                    if [[ "%teamcity.build.branch%" == "master" ]] || [[ "%teamcity.build.branch%" == "refs/heads/master" ]]; then
                        export TAG_VERSION=${'$'}{TAG_VERSION}
                    else 
                        export TAG_VERSION=${'$'}(echo "%teamcity.build.branch%" | tr -d /)-${'$'}{DEPLOY_ENV}
                    fi
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
            scriptContent =
                """echo "Acceptance tests should go here. Update this step to add your own acceptance tests.""""
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

object Infrastructure : Project({
    name = "Infrastructure"

    subProject(Testing)
    subProject(Deployment)
})

object Testing : Project({
    name = "Testing"

    buildType(TestConfigDeployer)
    buildType(TestDocPortalServer)
    buildType(TestSettingsKts)
    buildType(TestConfig)
    buildType(TestDocCrawler)
    buildType(TestFlailSsg)
    buildType(TestLionPageBuilder)
})

object Deployment : Project({
    name = "Deployment"

    buildType(PublishConfigDeployerDockerImage)
    buildType(PublishDocCrawlerDockerImage)
    buildType(PublishIndexCleanerDockerImage)
    buildType(PublishFlailSsgDockerImage)
    buildType(PublishLionPageBuilderDockerImage)
    buildType(PublishSitemapGeneratorDockerImage)
    buildType(DeployS3Ingress)
    buildType(DeploySearchService)
})

object Server : Project({
    name = "Server"

    buildType(Checkmarx)
    buildType(DeployInt)
    buildType(DeployStaging)
    buildType(DeployDev)
    buildType(Release)
    buildType(DeployProd)
    buildType(DeployServerConfig)
    buildType(DeployFrontend)

})

object HelperObjects {
    private fun getObjectsFromAllConfigFiles(srcDir: String, objectName: String): JSONArray {
        val allConfigObjects = JSONArray()
        val jsonFiles = File(srcDir).walk().filter { File(it.toString()).extension == "json" }
        for (file in jsonFiles) {
            val configFileData = JSONObject(File(file.toString()).readText(Charsets.UTF_8))
            val configObjects = configFileData.getJSONArray(objectName)
            configObjects.forEach { allConfigObjects.put(it) }
        }
        return allConfigObjects
    }

    val docConfigs = getObjectsFromAllConfigFiles("config/docs", "docs")
    val sourceConfigs = getObjectsFromAllConfigFiles("config/sources", "sources")
    private val buildConfigs = getObjectsFromAllConfigFiles("config/builds", "builds")

    private fun getObjectById(objectList: JSONArray, idName: String, idValue: String): JSONObject {
        for (i in 0 until objectList.length()) {
            val obj = objectList.getJSONObject(i)
            if (obj.getString(idName) == idValue) {
                return obj
            }
        }
        return JSONObject()
    }

    private fun getObjectsById(objectList: JSONArray, idName: String, idValue: String): JSONArray {
        val matches = JSONArray()
        for (i in 0 until objectList.length()) {
            val obj = objectList.getJSONObject(i)
            if (obj.getString(idName) == idValue) {
                matches.put(obj)
            }
        }
        return matches
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
        class ExportFilesFromXDocsToBitbucketAbstract(
            build_id: String,
            source_title: String,
            export_path_ids: String,
            git_path: String,
            branch_name: String,
            scheduled_build: Boolean,
            source_id: String,
            export_server: String,
            sch_freq: String,
            sch_hour_daily: Int,
            sch_minute_daily: Int,
            sch_hour_weekly: Int,
            sch_minute_weekly: Int
        ) : BuildType({

            id = RelativeId(build_id)
            name = "Export $source_title from XDocs and add to git ($build_id)"

            enablePersonalBuilds = false
            type = Type.COMPOSITE

            params {
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.EXPORT_PATH_IDS", export_path_ids)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.GIT_URL", git_path)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.GIT_BRANCH", branch_name)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.SRC_ID", source_id)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.EXPORT_SERVER", export_server)
            }

            dependencies {
                snapshot(ExportFilesFromXDocsToBitbucket) {
                    reuseBuilds = ReuseBuilds.NO
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            if (scheduled_build) {
                triggers {
                    schedule {
                        if (sch_freq == "daily") {
                            schedulingPolicy = daily {
                                hour = sch_hour_daily
                                minute = sch_minute_daily
                            }
                        } else if (sch_freq == "weekly") {
                            schedulingPolicy = weekly {
                                dayOfWeek = ScheduleTrigger.DAY.Saturday
                                hour = sch_hour_weekly
                            }
                        }

                        branchFilter = ""
                        triggerBuild = always()
                        withPendingChangesOnly = false
                    }
                }
            }
        })

        val builds = mutableListOf<BuildType>()

        val exportServers = arrayOf("ORP-XDOCS-WDB03", "ORP-XDOCS-WDB04")
        var exportServerIndex = 0

        var schHourDaily = 0
        var schMinuteDaily = 0
        var schHourWeekly = 12
        var schMinuteWeekly = 0
        val dailyMinutesOffset = 2
        val weeklyMinutesOffset = 10

        for (i in 0 until sourceConfigs.length()) {
            val source = sourceConfigs.getJSONObject(i)
            if (source.has("xdocsPathIds")) {
                val sourceId = source.getString("id")
                val gitUrl = source.getString("gitUrl")
                val sourceTitle = source.getString("title")
                val branchName = if (source.has("branch")) source.getString("branch") else "master"
                val exportFreq = if (source.has("exportFrequency")) source.getString("exportFrequency") else "daily"
                val exportBuildId = source.getString("id") + "_export"
                val xdocsPathIds = source.getJSONArray("xdocsPathIds").joinToString(" ")
                val matchBuilds = getObjectsById(buildConfigs, "srcId", sourceId)
                var scheduledBuild = false
                var buildDocId: String

                if (matchBuilds.length() > 0) {
                    for (j in 0 until matchBuilds.length()) {
                        val build = matchBuilds.getJSONObject(j)
                        buildDocId = build.getString("docId")
                        val doc = getObjectById(docConfigs, "id", buildDocId)
                        if (doc.getJSONArray("environments").contains("int")) {
                            scheduledBuild = true
                        }
                    }
                }

                builds.add(
                    ExportFilesFromXDocsToBitbucketAbstract(
                        exportBuildId,
                        sourceTitle,
                        xdocsPathIds,
                        gitUrl,
                        branchName,
                        scheduledBuild,
                        sourceId,
                        exportServers[exportServerIndex],
                        exportFreq,
                        schHourDaily,
                        schMinuteDaily,
                        schHourWeekly,
                        schMinuteWeekly
                    )
                )

                if (scheduledBuild && exportFreq == "daily") {
                    schMinuteDaily += dailyMinutesOffset
                    if (schMinuteDaily >= 60) {
                        schHourDaily += 1
                        schMinuteDaily = 0
                    }
                    if (schHourDaily >= 24) {
                        schHourDaily = 0
                    }
                    exportServerIndex++
                    if (exportServerIndex == exportServers.size) {
                        exportServerIndex = 0
                    }
                }
                if (scheduledBuild && exportFreq == "weekly") {
                    schMinuteWeekly += weeklyMinutesOffset

                    if (schMinuteWeekly >= 60) {
                        schHourWeekly += 1
                        schMinuteWeekly = 0
                    }
                    if (schHourWeekly >= 24) {
                        schHourWeekly = 0
                    }
                }
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
                val docVersions = metadata.getJSONArray("version")
                for (docVersion in docVersions) {
                    if (!versions.contains(docVersion.toString())) {
                        versions.add(docVersion.toString())
                    }
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
                    if (metadata.has("version") && metadata.getJSONArray("version").contains(version)) {
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

        class BuildAndPublishDockerImageWithContent(vcs_root_id: RelativeId, ga4Id: String) : BuildType(
            {
                name = "Build and publish Docker image with build content"
                id = RelativeId(removeSpecialCharacters(this.name).replace(" ", ""))
                params {
                    text(
                        "doc-version",
                        "",
                        description = "Version",
                        display = ParameterDisplay.PROMPT,
                        allowEmpty = true
                    )
                    text("env.GA4_ID", ga4Id, allowEmpty = true)
                }
                vcs {
                    root(vcs_root_id)
                }
                steps {
                    script {
                        scriptContent = "./build_standalone.sh"
                    }
                    script {
                        scriptContent = """
                                export BRANCH_NAME=%doc-version%
                                docker build -t gccwebhelp .
                                docker tag gccwebhelp artifactory.guidewire.com/doctools-docker-dev/gccwebhelp:${'$'}{BRANCH_NAME}
                                docker push artifactory.guidewire.com/doctools-docker-dev/gccwebhelp:${'$'}{BRANCH_NAME}
                            """.trimIndent()
                    }
                }
            }
        )

        val subProjects = mutableListOf<Project>()
        for (doc in docs) {
            subProjects.add(createDocProjectWithBuilds(doc, product_name, version))
        }

        return Project {
            id = RelativeId(removeSpecialCharacters(product_name + version))
            name = version

            subProjects.forEach(this::subProject)
            // Currently, GCC is the only project using the BuildAndPublishDockerImageWithContent class.
            // When we have more projects, we will create a more sustainable solution than this simple condition.
            if (product_name == "Guidewire Cloud Console" && version == "latest") {
                val docId = "guidewirecloudconsolerootinsurerdev"
                val build = getObjectById(buildConfigs, "docId", docId)
                val sourceId = build.getString("srcId")
                val vcsRootId =
                    RelativeId(removeSpecialCharacters(product_name + version + docId + sourceId + "docker"))
                val (sourceGitUrl, sourceGitBranch) = getSourceById(sourceId, sourceConfigs)
                buildType(BuildAndPublishDockerImageWithContent(vcsRootId, "G-6XJD083TC6"))
                vcsRoot(DocVcsRoot(vcsRootId, sourceGitUrl, sourceGitBranch))
            }
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

        class BuildPublishToS3Index(
            buildType: String,
            nodeImageVersion: String?,
            product: String,
            platform: String,
            version: String,
            doc_id: String,
            source_id: String,
            ditaval_file: String,
            input_path: String,
            create_index_redirect: String,
            build_env: String,
            publish_path: String,
            git_source_url: String,
            git_source_branch: String,
            resources_to_copy: List<JSONObject>,
            vcs_root_id: RelativeId,
            index_for_search: Boolean,
            workingDir: String,
            customOutputFolder: String,
            vcsRootIsExported: Boolean,
            customEnvironmentVars: JSONArray?
        ) : BuildType({
            val buildZipPackage = (build_env == "staging" && "self-managed" in platform.toLowerCase())
            var buildTemplate: Template = if (buildZipPackage) {
                BuildDocSiteAndLocalOutputFromDita
            } else {
                BuildDocSiteOutputFromDita
            }

            when (buildType) {
                "yarn" -> buildTemplate = BuildYarn
                "sphinx" -> buildTemplate = BuildSphinx
                "storybook" -> buildTemplate = BuildStorybook
            }

            if (index_for_search) {
                templates(buildTemplate, CrawlDocumentAndUpdateSearchIndex)
            } else {
                templates(buildTemplate)
            }

            var buildPdf = "true"
            if (build_env == "int") {
                buildPdf = "false"
            }

            id = RelativeId(removeSpecialCharacters(build_env + product + version + doc_id))
            name = "Publish to $build_env"
            maxRunningBuilds = 1

            vcs {
                root(vcs_root_id, "+:. => %SOURCES_ROOT%")
            }

            params {
                password(
                    "env.AUTH_TOKEN",
                    "credentialsJSON:67d9216c-4183-4ebf-a9b3-374ea5e547ec",
                    display = ParameterDisplay.HIDDEN
                )
                text("env.DOC_ID", doc_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.SRC_ID", source_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.DEPLOY_ENV", build_env, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("env.PUBLISH_PATH", publish_path, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text(
                    "env.S3_BUCKET_NAME",
                    "tenant-doctools-%env.DEPLOY_ENV%-builds",
                    display = ParameterDisplay.HIDDEN,
                    allowEmpty = false
                )
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
                text("GW_DOC_ID", doc_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_PRODUCT", product, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_PLATFORM", platform, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GW_VERSION", version, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("FILTER_PATH", ditaval_file, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("ROOT_MAP", input_path, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GIT_URL", git_source_url, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("GIT_BRANCH", git_source_branch, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text("BUILD_PDF", buildPdf, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text(
                    "CREATE_INDEX_REDIRECT",
                    create_index_redirect,
                    display = ParameterDisplay.HIDDEN,
                    allowEmpty = false
                )
                text("WORKING_DIR", workingDir, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                text(
                    "env.CUSTOM_OUTPUT_FOLDER",
                    customOutputFolder,
                    display = ParameterDisplay.HIDDEN,
                    allowEmpty = false
                )

                if (customEnvironmentVars != null) {
                    for (i in 0 until customEnvironmentVars.length()) {
                        val item = customEnvironmentVars.getJSONObject(i)
                        text("env." + item.getString("name"), item.getString("value"))
                    }
                }

                if (nodeImageVersion != null) {
                    text("NODE_IMAGE_VERSION", nodeImageVersion)
                } else {
                    text("NODE_IMAGE_VERSION", "12.14.1")
                }
            }

            steps {
                script {
                    name = "Upload generated content to the S3 bucket"
                    id = "UPLOAD_GENERATED_CONTENT"
                    scriptContent = """
                    #!/bin/bash
                    set -xe
                    export ROOT_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%"
                    export WORKING_SUBDIR=%WORKING_DIR%
                    
                    if [[ -z ${'$'}{WORKING_SUBDIR} ]]; then
                        echo "working subdir not set"
                    else
                        export ROOT_DIR="%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%/${'$'}WORKING_SUBDIR"
                        echo "Working dir set to ${'$'}ROOT_DIR"
                    fi
                    
                    if [[ -d "${'$'}ROOT_DIR/out" ]]; then
                        export OUTPUT_PATH="out"
                    elif [[ -d "${'$'}ROOT_DIR/dist" ]]; then
                        export OUTPUT_PATH="dist"
                    elif [[ -d "${'$'}ROOT_DIR/build" ]]; then
                        export OUTPUT_PATH="build"
                    fi
                    
                    echo "output path set to ${'$'}OUTPUT_PATH"

                    aws s3 sync ${'$'}ROOT_DIR/${'$'}OUTPUT_PATH s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete
                """.trimIndent()
                }

                stepsOrder = arrayListOf("BUILD_DOC_SITE_OUTPUT")
                if (buildZipPackage) {
                    stepsOrder.addAll(arrayListOf("BUILD_LOCAL_OUTPUT", "CREATE_ZIP_PACKAGE"))
                }
                stepsOrder.add("UPLOAD_GENERATED_CONTENT")
                if (index_for_search) {
                    stepsOrder.add("CRAWL_DOC")
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
                        name = "Copy resources from git to the doc output dir"
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
                        
                        echo "Copying files to the doc output dir"
                        mkdir -p %env.WORKING_DIR%/%env.OUTPUT_PATH%/$resourceTargetFolder
                        cp -R ./${'$'}RESOURCE_DIR/$resourceSourceFolder/* %env.WORKING_DIR%/%env.OUTPUT_PATH%/$resourceTargetFolder/
                    """.trimIndent()
                    })

                    stepIdSuffix += 1

                }

                steps {
                    extraSteps.forEach(this::step)
                    stepsOrder.addAll(stepsOrder.indexOf("UPLOAD_GENERATED_CONTENT"), stepIds)
                }
            }

            features {
                sshAgent {
                    teamcitySshKey = "sys-doc.rsa"
                }
            }

            if (build_env == "int") {
                if (vcsRootIsExported) {
                    triggers {
                        vcs {
                            triggerRules = """
                        +:root=${vcs_root_id.id};comment=\[%env.SRC_ID%\]:**
                    """.trimIndent()
                        }
                    }
                } else {
                    triggers {
                        vcs {
                            triggerRules = """
                        +:root=${vcs_root_id.id}:**
                            """.trimIndent()
                        }
                    }
                }
            }
        })

        class PublishToS3IndexProd(publish_path: String, doc_id: String, product: String, version: String) : BuildType({
            templates(CrawlDocumentAndUpdateSearchIndex)
            id = RelativeId(removeSpecialCharacters("prod$product$version$doc_id"))
            name = "Copy from staging to prod"

            params {
                password(
                    "env.AUTH_TOKEN",
                    "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083",
                    display = ParameterDisplay.HIDDEN
                )
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

                stepsOrder = arrayListOf("COPY_FROM_STAGING_TO_PROD", "CRAWL_DOC")

            }

        })

        class BuildDownloadableOutputFromDita(
            product: String,
            version: String,
            doc_id: String,
            vcs_root_id: RelativeId,
            ditaval_file: String,
            input_path: String,
            create_index_redirect: String,
            git_source_url: String,
            git_source_branch: String
        ) : BuildType({
            id = RelativeId(removeSpecialCharacters("local$product$version$doc_id"))
            name = "Build downloadable output"
            maxRunningBuilds = 1

            artifactRules = """
                %env.WORKING_DIR%/%env.OUTPUT_PATH% => /
            """.trimIndent()

            vcs {
                root(vcs_root_id, "+:. => %env.SOURCES_ROOT%")
                cleanCheckout = true
            }

            params {
                text("env.FILTER_PATH", ditaval_file, allowEmpty = false)
                text("env.ROOT_MAP", input_path, allowEmpty = false)
                text("env.GIT_URL", git_source_url, allowEmpty = false)
                text("env.GIT_BRANCH", git_source_branch, allowEmpty = false)
                text("env.CREATE_INDEX_REDIRECT", create_index_redirect, allowEmpty = false)
                text("env.SOURCES_ROOT", "src_root", allowEmpty = false)
                text("env.WORKING_DIR", "%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%", allowEmpty = false)
                text("env.OUTPUT_PATH", "out", allowEmpty = false)
                text("env.ZIP_SRC_DIR", "zip")
                select(
                    "env.OUTPUT_FORMAT",
                    "webhelp",
                    label = "Output format",
                    description = "Select an output format",
                    display = ParameterDisplay.PROMPT,
                    options = listOf(
                        "Webhelp" to "webhelp",
                        "PDF" to "pdf",
                        "Webhelp with bundled PDF" to "webhelp_pdf"
                    )
                )

            }

            steps {
                script {
                    name = "Build local output from DITA"
                    id = "BUILD_LOCAL_OUTPUT"
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        export DITA_BASE_COMMAND="dita -i \"%env.WORKING_DIR%/%env.ROOT_MAP%\" -o \"%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/%env.OUTPUT_PATH%\" --use-doc-portal-params no"
                        
                        if [[ ! -z "%env.FILTER_PATH%" ]]; then
                            export DITA_BASE_COMMAND+=" --filter \"%env.WORKING_DIR%/%env.FILTER_PATH%\""
                        fi
                        
                        if [[ "%env.OUTPUT_FORMAT%" == "webhelp_pdf" ]]; then
                            export DITA_BASE_COMMAND+=" -f wh-pdf --git.url \"%env.GIT_URL%\" --git.branch \"%env.GIT_BRANCH%\" --dita.ot.pdf.format pdf5_Guidewire"
                        elif [[ "%env.OUTPUT_FORMAT%" == "webhelp" ]]; then
                            export DITA_BASE_COMMAND+=" -f webhelp_Guidewire"
                        elif [[ "%env.OUTPUT_FORMAT%" == "pdf" ]]; then
                            export DITA_BASE_COMMAND+=" -f pdf_Guidewire_remote"
                        fi
                        
                        if [[ "%env.OUTPUT_FORMAT%" == "webhelp"* && "%env.CREATE_INDEX_REDIRECT%" == "true" ]]; then
                            export DITA_BASE_COMMAND+=" --create-index-redirect yes --webhelp.publication.toc.links all"
                        fi
                        
                        SECONDS=0
        
                        echo "Building local output"
                        ${'$'}DITA_BASE_COMMAND
                                                            
                        duration=${'$'}SECONDS
                        echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
                    """.trimIndent()
                    dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
                script {
                    name = "Create a ZIP package"
                    id = "CREATE_ZIP_PACKAGE"
                    scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Creating a ZIP package"
                mkdir -p %env.WORKING_DIR%/%env.OUTPUT_PATH%
                cd "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/%env.OUTPUT_PATH%" || exit
                zip -r "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/docs.zip" * &&
                    mv "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/docs.zip" "%env.WORKING_DIR%/%env.OUTPUT_PATH%/" &&
                    rm -rf "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%"
            """.trimIndent()
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

        val builds = mutableListOf<BuildType>()

        val docId = doc.getString("id")
        val publishPath = doc.getString("url")
        val docTitle = doc.getString("title")

        val metadata = doc.getJSONObject("metadata")
        val platform = metadata.getJSONArray("platform").joinToString(separator = ",")
        val environments = doc.getJSONArray("environments")
        val indexForSearch = if (doc.has("indexForSearch")) doc.getBoolean("indexForSearch") else true

        val build = getObjectById(buildConfigs, "docId", docId)

        val buildType = if (build.has("buildType")) build.getString("buildType") else ""
        val nodeImageVersion = if (build.has("nodeImageVersion")) build.getString("nodeImageVersion") else null
        val filter = if (build.has("filter")) build.getString("filter") else ""
        val workingDir = if (build.has("workingDir")) build.getString("workingDir") else ""
        val indexRedirect = if (build.has("indexRedirect")) build.getBoolean("indexRedirect").toString() else "false"
        val root = if (build.has("root")) build.getString("root") else ""
        val customOutputFolder = if (build.has("customOutputFolder")) build.getString("customOutputFolder") else ""
        val customEnvironment: JSONArray? = if (build.has("customEnv")) build.getJSONArray("customEnv") else null

        val sourceId = build.getString("srcId")
        val vcsRootId = RelativeId(removeSpecialCharacters(product_name + version + docId + sourceId))
        val source = getObjectById(sourceConfigs, "id", sourceId)
        val sourceIsExportedFromXdocs = source.has("xdocsPathIds")
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
                builds.add(PublishToS3IndexProd(publishPath, docId, product_name, version))
            } else {
                builds.add(
                    BuildPublishToS3Index(
                        buildType,
                        nodeImageVersion,
                        product_name,
                        platform,
                        version,
                        docId,
                        sourceId,
                        filter,
                        root,
                        indexRedirect,
                        env as String,
                        publishPath,
                        sourceGitUrl,
                        sourceGitBranch,
                        resourcesToCopy,
                        vcsRootId,
                        indexForSearch,
                        workingDir,
                        customOutputFolder,
                        sourceIsExportedFromXdocs,
                        customEnvironment
                    )
                )
            }
        }

        if (buildType == "dita") {
            builds.add(
                BuildDownloadableOutputFromDita(
                    product_name,
                    version,
                    docId,
                    vcsRootId,
                    filter,
                    root,
                    indexRedirect,
                    sourceGitUrl,
                    sourceGitBranch
                )
            )
        }

        return Project {
            id = RelativeId(removeSpecialCharacters(docTitle + product_name + version + docId))
            name = "$docTitle $product_name $version $platform"

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

        class ValidateDoc(build_info: JSONObject, vcs_root_id: RelativeId, git_source_id: String) : BuildType({

            val docBuildType = if (build_info.has("buildType")) build_info.getString("buildType") else ""

            when (docBuildType) {
                "yarn" -> templates(BuildYarn)
                "sphinx" -> templates(BuildSphinx)
                "dita" -> templates(RunContentValidations)
            }

            val docBuildRootMap = if (build_info.has("root")) build_info.getString("root") else ""
            val docBuildFilter = if (build_info.has("filter")) build_info.getString("filter") else ""
            val docBuildIndexRedirect =
                if (build_info.has("indexRedirect")) build_info.getBoolean("indexRedirect").toString() else "false"
            val workingDir = if (build_info.has("workingDir")) build_info.getString("workingDir") else ""
            val docBuildDocId = build_info.getString("docId")
            val doc = getObjectById(docConfigs, "id", docBuildDocId)
            val docId = doc.getString("id")
            val docTitle = doc.getString("title")
            val docMetadata = doc.getJSONObject("metadata")
            val docProduct = docMetadata.getJSONArray("product").joinToString(separator = ",")
            val docPlatform = docMetadata.getJSONArray("platform").joinToString(separator = ",")
            val docVersion = docMetadata.getJSONArray("version").joinToString(separator = ",")

            id = RelativeId(removeSpecialCharacters(docProduct + docVersion + docId + "validatedoc"))
            name = "Validate $docTitle $docProduct $docVersion"

            params {
                text("GW_DOC_ID", docId, allowEmpty = false)
                text("GW_PRODUCT", docProduct, allowEmpty = false)
                text("GW_PLATFORM", docPlatform, allowEmpty = false)
                text("GW_VERSION", docVersion, allowEmpty = false)
                text("FILTER_PATH", docBuildFilter, allowEmpty = false)
                text("CREATE_INDEX_REDIRECT", docBuildIndexRedirect, allowEmpty = false)
                text("ROOT_MAP", docBuildRootMap, allowEmpty = false)
                text("DOC_ID", docId, allowEmpty = false)
                text("env.SOURCES_ROOT", "src_root", allowEmpty = false)
                text("DITA_OT_WORKING_DIR", "%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%", allowEmpty = false)
                text(
                    "env.DOC_INFO",
                    "%teamcity.build.workingDir%/doc_info.json",
                    display = ParameterDisplay.HIDDEN,
                    allowEmpty = false
                )
                text("WORKING_DIR", workingDir, allowEmpty = false)
                text("DEPLOY_ENV", "dev", allowEmpty = false)
                text("env.PUBLISH_PATH", "root", display = ParameterDisplay.HIDDEN, allowEmpty = false)
            }

            if (docBuildType == "dita") {
                steps {
                    script {
                        name = "Get document details"
                        id = "GET_DOCUMENT_DETAILS"

                        scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        jq -n '$doc' | jq '. += {"gitBuildBranch": "%teamcity.build.vcs.branch.$vcs_root_id%", "gitSourceId": "$git_source_id"}' > %env.DOC_INFO%
                        cat %env.DOC_INFO%
                        
                    """.trimIndent()
                    }

                    stepsOrder = arrayListOf(
                        "GET_DOCUMENT_DETAILS",
                        "BUILD_GUIDEWIRE_WEBHELP",
                        "BUILD_NORMALIZED_DITA",
                        "RUN_SCHEMATRON_VALIDATIONS",
                        "RUN_DOC_VALIDATOR"
                    )

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
                    }
                }
            }
        })

        class CleanValidationResults(vcs_root_id: RelativeId, git_source_id: String, git_source_url: String) :
            BuildType({
                id = RelativeId(removeSpecialCharacters(git_source_id + "cleanresults"))
                name = "Clean validation results for $git_source_id"

                params {
                    text(
                        "env.ELASTICSEARCH_URLS",
                        "https://docsearch-doctools.int.ccs.guidewire.net",
                        display = ParameterDisplay.HIDDEN,
                        allowEmpty = false
                    )
                    text("env.GIT_SOURCE_ID", git_source_id, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                    text("env.GIT_SOURCE_URL", git_source_url, display = ParameterDisplay.HIDDEN, allowEmpty = false)
                    text(
                        "env.S3_BUCKET_NAME",
                        "tenant-doctools-int-builds",
                        display = ParameterDisplay.HIDDEN,
                        allowEmpty = false
                    )
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
        
                        results_cleaner --elasticsearch-urls "%env.ELASTICSEARCH_URLS%" --git-source-id "%env.GIT_SOURCE_ID%" --git-source-url "%env.GIT_SOURCE_URL%" --s3-bucket-name "%env.S3_BUCKET_NAME%"
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
            val sourceGitBranch = if (source.has("branch")) source.getString("branch") else "master"
            if (!source.has("xdocsPathIds") && (sourceGitBranch == "master" || sourceGitBranch == "main")) {
                val sourceDocBuilds = mutableListOf<JSONObject>()
                val sourceId = source.getString("id")
                val sourceTitle = source.getString("title")
                val sourceGitUrl = source.getString("gitUrl")

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
                                val docBuildType =
                                    if (docBuild.has("buildType")) docBuild.getString("buildType") else ""
                                if (docBuildType != "storybook") {
                                    buildType(ValidateDoc(docBuild, RelativeId(sourceId), sourceId))
                                }
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

    maxRunningBuilds = 2

    params {
        text(
            "env.EXPORT_PATH_IDS",
            "",
            description = "A list of space-separated path IDs from XDocs",
            display = ParameterDisplay.PROMPT,
            allowEmpty = true
        )
        text(
            "env.GIT_URL",
            "",
            description = "The URL of the Bitbucket repository where the files exported from XDocs are added",
            display = ParameterDisplay.PROMPT,
            allowEmpty = true
        )
        text(
            "env.GIT_BRANCH",
            "",
            description = "The branch of the Bitbucket repository where the files exported from XDocs are added",
            display = ParameterDisplay.PROMPT,
            allowEmpty = true
        )
        text(
            "env.SOURCES_ROOT",
            "src_root",
            label = "Git clone directory",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.XDOCS_EXPORT_DIR",
            "%system.teamcity.build.tempDir%/xdocs_export_dir",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.SRC_ID",
            "",
            description = "The ID of the source",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.EXPORT_SERVER",
            "",
            description = "The export server",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
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
                sed -i "s/ORP-XDOCS-WDB03/%env.EXPORT_SERVER%/" ../../../conf/LocClientConfig.xml
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
                
                git clone --single-branch --branch %env.GIT_BRANCH% %env.GIT_URL% %env.SOURCES_ROOT%
                cp -R %env.XDOCS_EXPORT_DIR%/* %env.SOURCES_ROOT%/
                
                cd %env.SOURCES_ROOT%
                git config --local user.email "doctools@guidewire.com"
                git config --local user.name "%serviceAccountUsername%"
                
                git add -A
                if git status | grep "Changes to be committed"
                then
                  git commit -m "[TeamCity][%env.SRC_ID%] Add files exported from XDocs"
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

    val gitUrls = mutableListOf<String>()
    for (i in 0 until HelperObjects.sourceConfigs.length()) {
        val source = HelperObjects.sourceConfigs.getJSONObject(i)
        val gitUrl = source.getString("gitUrl")
        val branchName = if (source.has("branch")) source.getString("branch") else "master"
        if (branchName == "master" && !gitUrls.contains(gitUrl)) {
            gitUrls.add(gitUrl)
        }
    }

    params {
        text(
            "env.SOURCES_ROOT",
            "src_root",
            label = "Git clone directory",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.TAG_VERSION",
            "",
            description = "Version of InsuranceSuite for which you want to create a documentation tag. Example: 10.1.0",
            display = ParameterDisplay.PROMPT,
            regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""",
            validationMessage = "Invalid SemVer format"
        )
        select("env.GIT_URL", "", display = ParameterDisplay.PROMPT, options = gitUrls)
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -xe
                export TAG_NAME="v%env.TAG_VERSION%"
                
                git clone %env.GIT_URL% %env.SOURCES_ROOT%
                
                cd %env.SOURCES_ROOT%
                git config --local user.email "doctools@guidewire.com"
                git config --local user.name "%serviceAccountUsername%"
                
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

//TODO: This template may not be needed. We could merge it with the ValidateDoc class
//TODO: Convert DITA OT scripts to use the dockerSupport feature instead of pulling and logging in the script
object RunContentValidations : Template({
    name = "Run content validations"

    artifactRules = """
        **/*.log => logs
        preview_url.txt
    """.trimIndent()

    params {
        text("env.GW_DOC_ID", "%GW_DOC_ID%", allowEmpty = false)
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.FILTER_PATH", "%FILTER_PATH%", allowEmpty = false)
        text("env.CREATE_INDEX_REDIRECT", "%CREATE_INDEX_REDIRECT%", allowEmpty = false)
        text("env.ROOT_MAP", "%ROOT_MAP%", allowEmpty = false)
        text("env.DOC_ID", "%DOC_ID%", allowEmpty = false)
        text("env.DITA_OT_WORKING_DIR", "%DITA_OT_WORKING_DIR%", allowEmpty = false)
        text(
            "env.ELASTICSEARCH_URLS",
            "https://docsearch-doctools.int.ccs.guidewire.net",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = true
        )
        text(
            "env.S3_BUCKET_PREVIEW_PATH",
            "s3://tenant-doctools-int-builds/preview",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = true
        )
        text(
            "env.NORMALIZED_DITA_DIR",
            "%env.DITA_OT_WORKING_DIR%/normalized_dita",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.DITA_OT_LOGS_DIR",
            "%env.DITA_OT_WORKING_DIR%/dita_ot_logs",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
        text(
            "env.SCHEMATRON_REPORTS_DIR",
            "%env.DITA_OT_WORKING_DIR%/schematron_reports",
            display = ParameterDisplay.HIDDEN,
            allowEmpty = false
        )
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

                export DITA_BASE_COMMAND="docker run -i -v %env.DITA_OT_WORKING_DIR%:/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest -i \"/src/%env.ROOT_MAP%\" -o \"/src/${'$'}OUTPUT_PATH\" -f webhelp_Guidewire --use-doc-portal-params yes --gw-doc-id \"%env.GW_DOC_ID%\" --gw-product \"%env.GW_PRODUCT%\" --gw-platform \"%env.GW_PLATFORM%\" --gw-version \"%env.GW_VERSION%\" -l \"/src/${'$'}LOG_FILE\""
                
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
                
                export GIT_SOURCE_ID=$(jq -r .gitSourceId "%env.DOC_INFO%")
                export GIT_BUILD_BRANCH=$(jq -r .gitBuildBranch "%env.DOC_INFO%")
                aws s3 sync "%env.DITA_OT_WORKING_DIR%/${'$'}{OUTPUT_PATH}" "%env.S3_BUCKET_PREVIEW_PATH%/${'$'}GIT_SOURCE_ID/${'$'}GIT_BUILD_BRANCH/%env.DOC_ID%" --delete
                echo "Output preview available at https://docs.int.ccs.guidewire.net/preview/${'$'}GIT_SOURCE_ID/${'$'}GIT_BUILD_BRANCH/%env.DOC_ID%" > preview_url.txt
                
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

object BuildStorybook : Template({
    name = "Get published Storybook"

    params {
        text("env.GW_DOC_ID", "%GW_DOC_ID%", allowEmpty = false)
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.DEPLOY_ENV", "%DEPLOY_ENV%", allowEmpty = false)
        text("env.NAMESPACE", "%NAMESPACE%", allowEmpty = false)
        text("env.TARGET_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.TARGET_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)
        text("env.WORKING_DIR", "%WORKING_DIR%")
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly)
    }

    steps {
        script {
            name = "Build Storybook"
            id = "BUILD_OUTPUT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ -f "ci/npmLogin.sh" ]]; then
                    export ARTIFACTORY_PASSWORD_BASE64=${'$'}(echo -n "${'$'}{ARTIFACTORY_PASSWORD}" | base64)
                    sh ci/npmLogin.sh
                fi
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export TARGET_URL="%env.TARGET_URL_PROD%"
                fi
                
                export JUTRO_VERSION=%env.GW_VERSION%
                
                export BASE_URL=/%env.PUBLISH_PATH%/
                cd %env.SOURCES_ROOT%/%env.WORKING_DIR%
                
                yarn
                NODE_OPTIONS=--max_old_space_size=4096 CI=true yarn build
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/jutro-docker-dev/generic:14.14.0-yarn-chrome"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
        }
    }

    vcs {
        cleanCheckout = true
    }
})

object BuildSphinx : Template({
    name = "Build a Sphinx project"

    params {
        text("env.GW_DOC_ID", "%GW_DOC_ID%", allowEmpty = false)
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.DEPLOY_ENV", "%DEPLOY_ENV%", allowEmpty = false)
        text("env.NAMESPACE", "%NAMESPACE%", allowEmpty = false)
        text("env.TARGET_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.TARGET_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)
        text("env.WORKING_DIR", "%WORKING_DIR%")
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly)
    }

    steps {
        script {
            name = "Build the Sphinx project"
            id = "BUILD_OUTPUT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export TARGET_URL="%env.TARGET_URL_PROD%"
                fi
                
                export BASE_URL=/%env.PUBLISH_PATH%/
                
                pip install poetry
                apt-get update && apt-get install -y build-essential
                apt-get install -y python3-sphinx
                cd %env.SOURCES_ROOT%
                poetry config virtualenvs.create false
                poetry install
                poetry run python get_specs.py
                make html
                cp -r ./_build/html ./build
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
        }
    }

    vcs {
        cleanCheckout = true
    }
})

object BuildYarn : Template({
    name = "Build a yarn project"

    params {
        text("env.GW_DOC_ID", "%GW_DOC_ID%", allowEmpty = false)
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.DEPLOY_ENV", "%DEPLOY_ENV%", allowEmpty = false)
        text("env.NAMESPACE", "%NAMESPACE%", allowEmpty = false)
        text("env.TARGET_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.TARGET_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)
        text("env.WORKING_DIR", "%WORKING_DIR%")
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly)
    }

    steps {
        script {
            name = "Build the yarn project"
            id = "BUILD_OUTPUT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ -f "ci/npmLogin.sh" ]]; then
                    export ARTIFACTORY_PASSWORD_BASE64=${'$'}(echo -n "${'$'}{ARTIFACTORY_PASSWORD}" | base64)
                    sh ci/npmLogin.sh
                fi
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export TARGET_URL="%env.TARGET_URL_PROD%"
                fi
                
                export BASE_URL=/%env.PUBLISH_PATH%/
                cd %env.SOURCES_ROOT%/%env.WORKING_DIR%
                yarn
                yarn build
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/node:%NODE_IMAGE_VERSION%"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "--user 1000:1000"
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

    vcs {
        cleanCheckout = true
    }
})

open class BuildOutputFromDita(createZipPackage: Boolean) : Template({
    name = if (createZipPackage) {
        "Build the doc site and local output from DITA"
    } else {
        "Build the doc site output from DITA"
    }

    params {
        text("env.GW_DOC_ID", "%GW_DOC_ID%", allowEmpty = false)
        text("env.GW_PRODUCT", "%GW_PRODUCT%", allowEmpty = false)
        text("env.GW_PLATFORM", "%GW_PLATFORM%", allowEmpty = false)
        text("env.GW_VERSION", "%GW_VERSION%", allowEmpty = false)
        text("env.FILTER_PATH", "%FILTER_PATH%", allowEmpty = false)
        text("env.ROOT_MAP", "%ROOT_MAP%", allowEmpty = false)
        text("env.GIT_URL", "%GIT_URL%", allowEmpty = false)
        text("env.GIT_BRANCH", "%GIT_BRANCH%", allowEmpty = false)
        text("env.BUILD_PDF", "%BUILD_PDF%", allowEmpty = false)
        text("env.CREATE_INDEX_REDIRECT", "%CREATE_INDEX_REDIRECT%", allowEmpty = false)
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
        text("env.WORKING_DIR", "%teamcity.build.checkoutDir%/%env.SOURCES_ROOT%", allowEmpty = false)
        text("env.OUTPUT_PATH", "out", allowEmpty = false)
        text("env.ZIP_SRC_DIR", "zip")
    }

    vcs {
        cleanCheckout = true
    }

    steps {
        script {
            name = "Build doc site output from DITA"
            id = "BUILD_DOC_SITE_OUTPUT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export DITA_BASE_COMMAND="dita -i \"%env.WORKING_DIR%/%env.ROOT_MAP%\" -o \"%env.WORKING_DIR%/%env.OUTPUT_PATH%\" --use-doc-portal-params yes --gw-doc-id \"%env.GW_DOC_ID%\" --gw-product \"%env.GW_PRODUCT%\" --gw-platform \"%env.GW_PLATFORM%\" --gw-version \"%env.GW_VERSION%\""
                
                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"%env.WORKING_DIR%/%env.FILTER_PATH%\""
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

                echo "Building output for %env.GW_PRODUCT% %env.GW_PLATFORM% %env.GW_VERSION%"
                ${'$'}DITA_BASE_COMMAND
                                    
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux

        }
        if (createZipPackage) {
            script {
                name = "Build local output from DITA"
                id = "BUILD_LOCAL_OUTPUT"
                scriptContent = """
                #!/bin/bash
                set -xe
                
                export DITA_BASE_COMMAND="dita -i \"%env.WORKING_DIR%/%env.ROOT_MAP%\" -o \"%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/%env.OUTPUT_PATH%\" --use-doc-portal-params no -f webhelp_Guidewire_validate"
                
                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"%env.WORKING_DIR%/%env.FILTER_PATH%\""
                fi
                
                if [[ "%env.CREATE_INDEX_REDIRECT%" == "true" ]]; then
                    export DITA_BASE_COMMAND+=" --create-index-redirect yes --webhelp.publication.toc.links all"
                fi
                
                SECONDS=0

                echo "Building local output"
                ${'$'}DITA_BASE_COMMAND
                
                if [[ "%env.BUILD_PDF%" == "true" ]]; then
                    echo "Copying PDF from the doc site output to the local output"
                    cp -avR "%env.WORKING_DIR%/%env.OUTPUT_PATH%/pdf" "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/%env.OUTPUT_PATH%"
                fi
                                    
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
                dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
            script {
                name = "Create a ZIP package"
                id = "CREATE_ZIP_PACKAGE"
                scriptContent = """
                #!/bin/bash
                set -xe
                             
                echo "Creating a ZIP package"
                cd "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/%env.OUTPUT_PATH%" || exit
                zip -r "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/docs.zip" * &&
                    mv "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%/docs.zip" "%env.WORKING_DIR%/%env.OUTPUT_PATH%/" &&
                    rm -rf "%env.WORKING_DIR%/%env.ZIP_SRC_DIR%"
            """.trimIndent()
            }
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

object BuildDocSiteOutputFromDita : BuildOutputFromDita(createZipPackage = false)
object BuildDocSiteAndLocalOutputFromDita : BuildOutputFromDita(createZipPackage = true)

object PublishDocCrawlerDockerImage : BuildType({
    name = "Publish Doc Crawler docker image"

    params {
        text("env.IMAGE_VERSION", "latest")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Publish Doc Crawler Docker image to Artifactory"
            scriptContent = """
                set -xe
                cd apps/doc_crawler
                ./publish_docker.sh %env.IMAGE_VERSION%       
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:<default>"
            triggerRules = """
                +:apps/doc_crawler/**
                -:user=doctools:**
            """.trimIndent()
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

    dependencies {
        snapshot(TestDocCrawler) {
            reuseBuilds = ReuseBuilds.SUCCESSFUL
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object CrawlDocumentAndUpdateSearchIndex : Template({
    name = "Update the search index"
    artifactRules = """
        **/*.log => logs
        config.json
        tmp_config.json
    """.trimIndent()

    params {
        text(
            "env.DEPLOY_ENV",
            "%DEPLOY_ENV%",
            label = "Deployment environment",
            description = "The environment on which you want reindex documents",
            allowEmpty = false
        )
        text(
            "env.DOC_ID",
            "%DOC_ID%",
            label = "Doc ID",
            description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.",
            allowEmpty = true
        )
        text(
            "env.CONFIG_FILE_URL",
            "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json",
            allowEmpty = false
        )
        text(
            "env.CONFIG_FILE_URL_PROD",
            "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json",
            allowEmpty = false
        )
        text("env.DOC_S3_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.DOC_S3_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.DOC_S3_URL_PORTAL2", "https://portal2.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text(
            "env.ELASTICSEARCH_URLS",
            "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net",
            allowEmpty = false
        )
        text(
            "env.ELASTICSEARCH_URLS_PROD",
            "https://docsearch-doctools.internal.us-east-2.service.guidewire.net",
            allowEmpty = false
        )
        text("env.APP_BASE_URL", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.APP_BASE_URL_PROD", "https://docs.guidewire.com", allowEmpty = false)
        text("env.INDEX_NAME", "gw-docs", allowEmpty = false)
        text("env.CONFIG_FILE", "%teamcity.build.workingDir%/config.json", allowEmpty = false)
    }

    steps {
        script {
            name = "Get config file"
            id = "GET_CONFIG_FILE"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export CONFIG_FILE_URL="%env.CONFIG_FILE_URL_PROD%"
                    curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > %env.CONFIG_FILE%                 
                elif [[ "%env.DEPLOY_ENV%" == "portal2" ]]; then
                    export CONFIG_FILE_URL="%env.CONFIG_FILE_URL_PROD%"
                    curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc"))]}' > %env.CONFIG_FILE%
                else
                    curl ${'$'}CONFIG_FILE_URL > %env.CONFIG_FILE%
                fi
            """.trimIndent()
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
                    export APP_BASE_URL="%env.APP_BASE_URL_PROD%"
                elif [[ "%env.DEPLOY_ENV%" == "portal2" ]]; then
                    export DOC_S3_URL="%env.DOC_S3_URL_PORTAL2%"
                    export ELASTICSEARCH_URLS="%env.ELASTICSEARCH_URLS_PROD%"
                    export APP_BASE_URL="%env.APP_BASE_URL_PROD%"
                fi
                                
                cat > scrapy.cfg <<- EOM
                [settings]
                default = doc_crawler.settings
                EOM

                doc_crawler
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-crawler:latest"
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
    buildType(GenerateSitemap)
})

object Docs : Project({
    name = "Docs"

    HelperObjects.createProjects().forEach(this::subProject)
})

object Sources : Project({
    name = "Sources"

    HelperObjects.createSourceValidationsFromConfig().forEach(this::subProject)
})



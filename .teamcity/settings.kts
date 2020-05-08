import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCompose
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONObject
import java.io.File

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

version = "2019.2"

project {

    vcsRoot(vcsrootmasteronly)
    vcsRoot(vcsroot)
    vcsRoot(DitaOt331)

    template(Deploy)
    template(BuildDockerImage)
    template(BuildAndUploadToS3)
    template(AddFilesFromXDocsToBitbucket)

    params {
        param("env.NAMESPACE", "doctools")
    }

    buildType(TestConfig)
    subProject(Server)
    subProject(Content)
}

object Helpers {
    fun getBuildsFromConfig(env: String, configPath: String): Pair<MutableList<VcsRoot>, MutableList<BuildType>> {
        class CreateVcsRoot(git_path: String, my_id: String) : jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot({
            id = RelativeId(my_id)
            name = my_id
            url = git_path
            authMethod = uploadedKey {
                uploadedKey = "sys-doc.rsa"
            }
        })

        class BuildAndUploadToS3AbstractDev(build_id: String, build_name: String, ditaval_file: String, input_path: String,
                                            build_env: String, publish_path: String, vsc_root_id: String,
                                            export_build_id: String) : BuildType({
            templates(BuildAndUploadToS3)

            id = RelativeId(build_id)
            name = build_name


            params {
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
                text("FORMAT", "webhelp_Guidewire", allowEmpty = false)
                text("TOOLS_ROOT", "tools_root", allowEmpty = false)
                text("DITAVAL_FILE", ditaval_file, allowEmpty = false)
                text("INPUT_PATH", input_path, allowEmpty = false)
                text("S3_BUCKET_NAME", "tenant-doctools-${build_env}-builds", allowEmpty = false)
                text("PUBLISH_PATH", publish_path, allowEmpty = false)
                text("CONFIG_FILE", "%teamcity.build.workingDir%/.teamcity/config/gw-docs-dev.json", allowEmpty = false)
                text("CRAWLER_START_URL", "https://%CRAWLER_ALLOWED_DOMAINS%/%PUBLISH_PATH%", allowEmpty = false)
                text("CRAWLER_ALLOWED_DOMAINS", "ditaot.internal.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("CRAWLER_REFERER", "https://docs.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEXER_SEARCH_APP_URLS", "https://docsearch-doctools.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEXER_INDEX_NAME", "gw-docs", allowEmpty = false)
                text("INDEXER_INDEX_FILE", "elastic_search/documents.json", allowEmpty = false)
                text("INDEXER_DOCUMENT_KEYS", "/%PUBLISH_PATH%.*", allowEmpty = false)
            }

            vcs {
                root(RelativeId(vsc_root_id), "+:. => %SOURCES_ROOT%")
            }

            if (export_build_id == "") {
                triggers.vcs {
                    id = "vcsTrigger"
                    triggerRules = """
                        -:root=${vcsrootmasteronly.id}:**
                        -:root=${DitaOt331.id}:**
                        -:root=DocumentationTools_DitaOtPlugins:**
                    """.trimIndent()
                }
            }

            dependencies {
                snapshot(TestContent) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestConfig) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            if (export_build_id != "") {
                dependencies.snapshot(RelativeId(export_build_id)) { onDependencyFailure = FailureAction.FAIL_TO_START }
            }

        })

        class BuildAndUploadToS3AbstractStaging(build_id: String, build_name: String, ditaval_file: String, input_path: String, build_env: String, publish_path: String, vsc_root_id: String, export_build_id: String) : BuildType({
            templates(BuildAndUploadToS3)

            id = RelativeId(build_id)
            name = build_name

            params {
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
                text("FORMAT", "webhelp_Guidewire", allowEmpty = false)
                text("TOOLS_ROOT", "tools_root", allowEmpty = false)
                text("DITAVAL_FILE", ditaval_file, allowEmpty = false)
                text("INPUT_PATH", input_path, allowEmpty = false)
                text("S3_BUCKET_NAME", "tenant-doctools-${build_env}-builds", allowEmpty = false)
                text("PUBLISH_PATH", publish_path, allowEmpty = false)
                text("CONFIG_FILE", "%teamcity.build.workingDir%/.teamcity/config/gw-docs-staging.json", allowEmpty = false)
                text("CRAWLER_START_URL", "https://%CRAWLER_ALLOWED_DOMAINS%/%PUBLISH_PATH%", allowEmpty = false)
                text("CRAWLER_ALLOWED_DOMAINS", "ditaot.internal.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("CRAWLER_REFERER", "https://docs.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEXER_SEARCH_APP_URLS", "https://docsearch-doctools.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEXER_INDEX_NAME", "gw-docs", allowEmpty = false)
                text("INDEXER_INDEX_FILE", "elastic_search/documents.json", allowEmpty = false)
                text("INDEXER_DOCUMENT_KEYS", "/%PUBLISH_PATH%.*", allowEmpty = false)
            }

            vcs {
                root(RelativeId(vsc_root_id), "+:. => %SOURCES_ROOT%")
            }

            if (export_build_id != "") {
                dependencies.snapshot(RelativeId(export_build_id)) { onDependencyFailure = FailureAction.FAIL_TO_START }
            }
        })

        class ExportFilesFromXDocsToBitbucketAbstract(build_id: String, source_title: String, export_path_ids: String,
                                                      vcs_root_id: String, startHour: Int, startMinute: Int) : BuildType({
            templates(AddFilesFromXDocsToBitbucket)

            id = RelativeId(build_id)
            name = "Export $source_title from XDocs and add to git"

            params {
                text("EXPORT_PATH_IDS", export_path_ids, allowEmpty = false)
                text("XDOCS_EXPORT_DIR", "%system.teamcity.build.tempDir%/xdocs_export_dir", allowEmpty = false)
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
            }

            vcs {
                root(RelativeId(vcs_root_id), "+:. => %SOURCES_ROOT%")
            }

            triggers {
                schedule {
                    schedulingPolicy = daily {
                        hour = startHour
                        minute = startMinute
                    }
                    branchFilter = ""
                    triggerBuild = always()
                    withPendingChangesOnly = false
                }
            }
        })

        fun getScheduleWindow(index: Int): Pair<Int, Int> {
            val startTime: Int = 0
            val interval: Int = 7
            val hour = startTime + ((interval * index) / 60)
            val minute = startTime + ((interval * index) % 60)

            return Pair(hour, minute)
        }

        val config = JSONObject(File(configPath).readText(Charsets.UTF_8))

        val builds = mutableListOf<BuildType>()
        val roots = mutableListOf<VcsRoot>()
        var scheduleIndex = 0

        val sourceConfigs = config.getJSONArray("sources")
        for (i in 0 until sourceConfigs.length()) {
            val source = sourceConfigs.getJSONObject(i)
            val gitUrl: String = source.get("gitUrl").toString()
            val sourceId: String = source.get("id").toString()
            val sourceTitle: String = source.get("title").toString()
            roots.add(CreateVcsRoot(gitUrl, sourceId))

            if (source.has("xdocsPathIds")) {
                val exportBuildId: String = source.get("id").toString() + "-export"
                val xdocsPathIds: String = source.getJSONArray("xdocsPathIds").joinToString(" ")
                val (availableHour, availableMinute) = getScheduleWindow(scheduleIndex)
                scheduleIndex++

                builds.add(ExportFilesFromXDocsToBitbucketAbstract(exportBuildId,
                        sourceTitle, xdocsPathIds, sourceId, availableHour, availableMinute))
            }
        }

        val docConfigs = config.getJSONArray("docs")
        for (i in 0 until docConfigs.length()) {
            val doc = docConfigs.getJSONObject(i)
            if (doc.has("build")) {
                val buildId: String = doc.get("id").toString()
                val publishPath: String = doc.get("url").toString()
                val title: String = doc.get("title").toString()

                val metadata = doc.getJSONObject("metadata")
                val platform: String? = metadata.get("platform").toString()
                val product: String? = metadata.get("product").toString()
                val version: String? = metadata.get("version").toString()

                val buildName = "Build $title $platform $version"

                val build: JSONObject = doc.getJSONObject("build")
                val filter: String = build.get("filter").toString()
                val root: String = build.get("root").toString()
                val vcsRootId: String = build.get("src").toString()
                val exportBuildId = "$vcsRootId-export"

                if (env == "dev" || env == "int") {
                    builds.add(BuildAndUploadToS3AbstractDev(buildId, buildName, filter, root, env,
                            publishPath, vcsRootId, exportBuildId))
                }

                if (env == "staging") {
                    builds.add(BuildAndUploadToS3AbstractStaging(buildId, buildName, filter, root, env,
                            publishPath, vcsRootId, exportBuildId))
                }
            }
        }

        return Pair(roots, builds)
    }
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

object DitaOt331 : GitVcsRoot({
    name = "dita-ot-331"
    url = "ssh://git@stash.guidewire.com/doctools/dita-ot-331.git"
    branchSpec = "+:refs/*"
    authMethod = uploadedKey {
        uploadedKey = "dita-ot.rsa"
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
        param("env.CONFIG_FILENAME", "gw-docs-dev.json")
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
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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
        param("env.CONFIG_FILENAME", "gw-docs-staging.json")
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

                cp ./.teamcity/config/${'$'}{CONFIG_FILENAME} ./server/config.json
                cd server/
                export TAG_VERSION=${'$'}(npm version %semver-scope%)
                git add .
                git commit -m "push changes to ${'$'}{TAG_VERSION}"
                git tag -a ${'$'}{TAG_VERSION} -m "create new %semver-scope% version ${'$'}{TAG_VERSION}"
                git push origin master
                git push --tags
                
                docker build -t docportal .
                docker tag docportal:latest artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
                docker push artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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
                userName = "%env.ARTIFACTORY_USERNAME%"
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
                    export KUBE_FILE=apps/elastic_search/kube/deployment-prod.yml
                else
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"
                    export KUBE_FILE=apps/elastic_search/kube/deployment.yml
                fi
                sh ci/deployKubernetes.sh
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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

object LoadSearchIndex : BuildType({
    name = "Delete and load THE ENTIRE search index"

    params {
        text("env.CONFIG_FILE", "%teamcity.build.workingDir%/.teamcity/config/gw-docs-dev.json", allowEmpty = false)
        text("env.CONFIG_FILE_STAGING", "%teamcity.build.workingDir%/.teamcity/config/gw-docs-staging.json", allowEmpty = false)
        text("env.CRAWLER_START_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.CRAWLER_START_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.BUILD_START_URLS_FROM_CONFIG", "yes")
        text("env.CRAWLER_ALLOWED_DOMAINS", "ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.CRAWLER_ALLOWED_DOMAINS_PROD", "ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.CRAWLER_ALLOWED_DOMAINS_PORTAL2", "portal2.guidewire.com", allowEmpty = false)
        text("env.CRAWLER_REFERER", "https://docs.%env.DEPLOY_ENV%.ccs.guidewire.net")
        text("env.CRAWLER_REFERER_PROD", "https://docs.guidewire.com")
        text("env.INDEXER_SEARCH_APP_URLS", "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.INDEXER_SEARCH_APP_URLS_PROD", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.INDEXER_INDEX_NAME", "gw-docs", allowEmpty = false)
        text("env.INDEXER_INDEX_FILE", "elastic_search/documents.json", allowEmpty = false)
        text("env.INDEXER_DOCUMENT_KEYS", "@&~(/portal/secure/doc.+)")
        text("env.INDEXER_DOCUMENT_KEYS_PORTAL2", "/portal/secure/doc.*")
        select("env.DEPLOY_ENV", "", label = "Deployment environment", description = "Select an environment on which you want reindex documents", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
        select("env.DOC_SERVER", "", label = "Documentation server", description = "Select where the documents that you want reindex are hosted", display = ParameterDisplay.PROMPT,
                options = listOf("s3", "portal2"))
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
            name = "Collect documents and load index"
            scriptContent = """
                #!/bin/bash
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export CRAWLER_START_URL="${'$'}{CRAWLER_START_URL_PROD}"
                    export CRAWLER_ALLOWED_DOMAINS="${'$'}{CRAWLER_ALLOWED_DOMAINS_PROD}"
                    export CRAWLER_REFERER="${'$'}{CRAWLER_REFERER_PROD}"                    
                    export INDEXER_SEARCH_APP_URLS="${'$'}{INDEXER_SEARCH_APP_URLS_PROD}"
                fi

                if [[ "%env.DEPLOY_ENV%" == "staging" ]] || [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export CONFIG_FILE="${'$'}{CONFIG_FILE_STAGING}"
                fi
                
                if [[ "%env.DOC_SERVER%" == "portal2" ]]; then
                    export INDEXER_DOCUMENT_KEYS="${'$'}{INDEXER_DOCUMENT_KEYS_PORTAL2}"
                    export CRAWLER_ALLOWED_DOMAINS="${'$'}{CRAWLER_ALLOWED_DOMAINS_PORTAL2}"
                fi
                

                cd apps
                make collect-documents
                make load-index
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

        script {
            name = "Publish to S3"
            scriptContent = "aws s3 sync ./apps/elastic_search/out s3://tenant-doctools-admin-builds/broken-links-reports/%env.DEPLOY_ENV%/%env.DOC_SERVER%"
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
            file = "apps/tests/test_elastic_search/resources/docker-compose.yml"
        }
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
            name = "Run tests for collecting documents"
            scriptContent = """
                cd apps
                make test-collect-documents
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Run tests for loading index"
            scriptContent = """
                cd apps
                make test-load-index
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    triggers {
        vcs {
            triggerRules = """
                +:.teamcity/settings.kts
                +:apps/**
                -:user=doctools:**
            """.trimIndent()
        }
    }

    features {
        commitStatusPublisher {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%serviceAccountUsername%"
                password = "zxx02d98e2c9ff7a3fe236631b550fc8db9b0a9c655f3a18e4b775d03cbe80d301b"
            }
        }
        sshAgent {
            teamcitySshKey = "dita-ot.rsa"
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
                cd apps
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
                +:.teamcity/config/**/*.json

                -:user=doctools:**
            """.trimIndent()
        }
    }

    features {
        commitStatusPublisher {
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%serviceAccountUsername%"
                password = "zxx02d98e2c9ff7a3fe236631b550fc8db9b0a9c655f3a18e4b775d03cbe80d301b"
            }
        }
        sshAgent {
            teamcitySshKey = "dita-ot.rsa"
        }
    }
})

object CopyContentFromStagingToProd : BuildType({
    name = "Copy content from Staging to Prod"

    steps {
        script {
            name = "Copy from S3 on staging to S3 on Prod"
            scriptContent = """
                aws s3 sync s3://tenant-doctools-staging-builds stage/ --delete
                
                export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                
                aws s3 sync stage/ s3://tenant-doctools-prod-builds --delete
            """.trimIndent()
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
                cp ./.teamcity/config/${'$'}{CONFIG_FILENAME} ./server/config.json
                docker build -t docportal ./server
                docker tag docportal artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
                docker push artifactory.guidewire.com/doctools-docker-dev/docportal:${'$'}{TAG_VERSION}
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.10"
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

object AddFilesFromXDocsToBitbucket : Template({
    name = "Add files from XDocs to Bitbucket template"

    maxRunningBuilds = 1

    params {
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", label = "Git clone directory", description = "Directory for the repo cloned from Bitbucket", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.EXPORT_PATH_IDS", "%EXPORT_PATH_IDS%", allowEmpty = false)
        text("env.XDOCS_EXPORT_DIR", "%XDOCS_EXPORT_DIR%", allowEmpty = false)
    }

    vcs {
        root(AbsoluteId("DocumentationTools_XDocsClient"))

        cleanCheckout = true
    }

    steps {
        script {
            name = "Export files from XDocs"
            id = "RUNNER_2621"
            workingDir = "LocalClient/sample/local/bin"
            scriptContent = """
                chmod 777 runExport.sh
                for path in %env.EXPORT_PATH_IDS%; do ./runExport.sh "${'$'}path" %env.XDOCS_EXPORT_DIR%; done
            """.trimIndent()
        }
        script {
            name = "Add exported files to Bitbucket"
            id = "RUNNER_2622"
            scriptContent = """
                set -xe
                git config --global user.email "doctools@guidewire.com"
                git config --global user.name "%serviceAccountUsername%"
                cp -R %env.XDOCS_EXPORT_DIR%/* %env.SOURCES_ROOT%/
                cd %env.SOURCES_ROOT%
                git add -A
                if git status | grep "Changes to be committed"
                then
                  git commit -m "[TeamCity] Adds files exported from XDocs"
                  git push origin master
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

object BuildAndUploadToS3 : Template({
    name = "Build DITA and upload to S3 template"

    maxRunningBuilds = 1

    params {
        text("env.S3_BUCKET_NAME", "%S3_BUCKET_NAME%", description = "Set to dev, int or staging", allowEmpty = false)
        text("env.INPUT_PATH", "%INPUT_PATH%", allowEmpty = false)
        text("env.PUBLISH_PATH", "%PUBLISH_PATH%", allowEmpty = false)
        text("env.FORMAT", "%FORMAT%", allowEmpty = false)
        text("env.DITAVAL_FILE", "%DITAVAL_FILE%", allowEmpty = false)
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
        text("env.TOOLS_ROOT", "%TOOLS_ROOT%", allowEmpty = false)
        text("env.CONFIG_FILE", "%CONFIG_FILE%", allowEmpty = false)
        text("env.CRAWLER_START_URL", "%CRAWLER_START_URL%", allowEmpty = false)
        text("env.CRAWLER_ALLOWED_DOMAINS", "%CRAWLER_ALLOWED_DOMAINS%", allowEmpty = false)
        text("env.CRAWLER_REFERER", "%CRAWLER_REFERER%", allowEmpty = false)
        text("env.INDEXER_SEARCH_APP_URLS", "%INDEXER_SEARCH_APP_URLS%", allowEmpty = false)
        text("env.INDEXER_INDEX_NAME", "%INDEXER_INDEX_NAME%", allowEmpty = false)
        text("env.INDEXER_INDEX_FILE", "%INDEXER_INDEX_FILE%", allowEmpty = false)
        text("env.INDEXER_DOCUMENT_KEYS", "%INDEXER_DOCUMENT_KEYS%")
    }

    vcs {
        root(DitaOt331, "+:. => ./%env.DITA_OT_331_DIR%")
        root(vcsrootmasteronly, "+:. => %env.TOOLS_ROOT%")
        root(AbsoluteId("DocumentationTools_DitaOtPlugins"), "+:. => ./%env.DITA_OT_PLUGINS_DIR%")

        cleanCheckout = true
    }

    steps {
        script {
            name = "Run build"
            id = "RUNNER_2108"
            scriptContent = """
                chmod -R 777 ./
                %env.DITA_OT_331_DIR%/bin/dita --install
                %env.DITA_OT_331_DIR%/bin/dita --input=%env.SOURCES_ROOT%/%env.INPUT_PATH% --format=%env.FORMAT% --filter=%env.SOURCES_ROOT%/%env.DITAVAL_FILE% --use-doc-portal-params=yes
            """.trimIndent()
        }
        script {
            name = "Upload to the S3 bucket"
            id = "RUNNER_2633"
            scriptContent = "aws s3 sync ./out s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete"
        }
        dockerCommand {
            name = "Build a Python Docker image"
            id = "RUNNER_2634"
            commandType = build {
                source = file {
                    path = "%env.TOOLS_ROOT%/apps/Dockerfile"
                }
                namesAndTags = "python-runner"
                commandArgs = "--pull"
            }
            param("dockerImage.platform", "linux")
        }
        script {
            name = "Collect documents and load index"
            id = "RUNNER_2635"
            workingDir = "%env.TOOLS_ROOT%"
            scriptContent = """
                cd apps
                make collect-documents
                make load-index
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    features {
        commitStatusPublisher {
            id = "BUILD_EXT_329"
            vcsRootExtId = "${DitaOt331.id}"
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%env.ARTIFACTORY_USERNAME%"
                password = "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
            }

        }
        dockerSupport {
            id = "DockerSupport"
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
    buildType(DeployInt)
    buildType(DeployStaging)
    buildType(DeployDev)
    buildType(Release)
    buildType(DeployProd)

    buildTypesOrder = arrayListOf(Test, Checkmarx, DeployDev, DeployInt, DeployStaging, DeployProd, Release)
})

object Content : Project({
    name = "Content"

    buildType(LoadSearchIndex)
    subProject(DeployServices)
    buildType(TestContent)
    subProject(DeployDevContent)
    subProject(DeployIntContent)
    subProject(DeployStagingContent)
    subProject(DeployProdContent)

})

object DeployServices : Project({
    name = "Deploy services"

    buildType(DeployS3Ingress)
    buildType(DeploySearchService)
})

object DeployDevContent : Project({
    name = "Deploy to Dev"

    val (roots, builds) = Helpers.getBuildsFromConfig("dev", "config/gw-docs-dev.json")
    roots.forEach(this::vcsRoot)
    builds.forEach(this::buildType)
})

object DeployIntContent : Project({
    name = "Deploy to Int"

    val (roots, builds) = Helpers.getBuildsFromConfig("int", "config/gw-docs-int.json")
    roots.forEach(this::vcsRoot)
    builds.forEach(this::buildType)
})

object DeployStagingContent : Project({
    name = "Deploy to Staging"

    val (roots, builds) = Helpers.getBuildsFromConfig("staging", "config/gw-docs-staging.json")
    roots.forEach(this::vcsRoot)
    builds.forEach(this::buildType)
})

object DeployProdContent : Project({
    name = "Deploy to Prod"

    buildType(CopyContentFromStagingToProd)
})

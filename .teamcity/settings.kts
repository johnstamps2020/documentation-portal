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
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

version = "2019.2"

project {

    vcsRoot(vcsrootmasteronly)
    vcsRoot(vcsroot)

    template(Deploy)
    template(BuildDockerImage)
    template(BuildAndUploadToS3DitaDev)
    template(CrawlDocumentAndUpdateIndex)
    template(PublishBrokenLinksReportToS3)
    template(AddFilesFromXDocsToBitbucket)

    params {
        param("env.NAMESPACE", "doctools")
    }

    buildType(TestConfig)
    subProject(Server)
    subProject(Content)
    subProject(ModularBuilds)
}

object Helpers {
    private fun getBuildsFromConfig(env: String): MutableList<BuildType> {

        class UploadToS3AbstractProd(relative_copy_path: String, title: String, doc_id: String, doc_version: String, doc_platform: String, build_env: String) : BuildType({
            templates(CrawlDocumentAndUpdateIndex)
            id = RelativeId(doc_id + env)
            name = "Copy $title $doc_platform $doc_version from Staging to Prod ($doc_id)"

            params {
                text("TOOLS_ROOT", "tools_root", allowEmpty = false)
                text("S3_BUCKET_NAME", "tenant-doctools-${build_env}-builds", allowEmpty = false)
                text("CONFIG_FILE_URL", "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json", allowEmpty = false)
                text("APP_BASE_URL", "https://docs.guidewire.com", allowEmpty = false)
                text("DOC_S3_URL", "https://ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
                text("DOC_ID", doc_id, allowEmpty = false)
                text("ELASTICSEARCH_URLS", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net", allowEmpty = false)
                text("INDEX_NAME", "gw-docs", allowEmpty = false)
                text("PUBLISH_PATH", relative_copy_path, allowEmpty = false)
            }

            steps {
                script {
                    id = "COPY_FROM_STAGING_TO_PROD"
                    name = "Copy from S3 on staging to S3 on Prod"
                    scriptContent = """
                        echo "Copying from staging to Teamcity"
                        aws s3 sync s3://tenant-doctools-staging-builds/$relative_copy_path $relative_copy_path/ --delete
                        
                        echo "Setting credentials to access prod"
                        export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                        export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                        export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                        
                        echo "Uploading from Teamcity to prod"
                        aws s3 sync $relative_copy_path/ s3://tenant-doctools-prod-builds/$relative_copy_path --delete
                    """.trimIndent()
                }
                stepsOrder = arrayListOf("COPY_FROM_STAGING_TO_PROD", "BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC")
            }

        })

        class BuildAndUploadToS3AbstractDevAndIntDitaDev(doc_id: String, build_name: String, ditaval_file: String, input_path: String, build_env: String, publish_path: String, vcs_root_id: String) : BuildType({
            templates(BuildAndUploadToS3DitaDev, CrawlDocumentAndUpdateIndex, PublishBrokenLinksReportToS3)

            id = RelativeId(doc_id + env)
            name = build_name

            params {
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
                text("FORMAT", "html5", allowEmpty = false)
                text("DITA_OUTPUT_DIR", "%system.teamcity.build.tempDir%/out", allowEmpty = false)
                text("OUTPUT_DIR", "%system.teamcity.build.tempDir%/html5", allowEmpty = false)
                text("TOOLS_ROOT", "tools_root", allowEmpty = false)
                text("DITAVAL_FILE", ditaval_file, allowEmpty = false)
                text("INPUT_PATH", input_path, allowEmpty = false)
                text("S3_BUCKET_NAME", "tenant-doctools-${build_env}-builds", allowEmpty = false)
                text("PUBLISH_PATH", publish_path, allowEmpty = false)
                text("CONFIG_FILE_URL", "https://ditaot.internal.${build_env}.ccs.guidewire.net/portal-config/config.json", allowEmpty = false)
                text("APP_BASE_URL", "https://docs.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("DOC_S3_URL", "https://ditaot.internal.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("DOC_ID", doc_id, allowEmpty = false)
                text("ELASTICSEARCH_URLS", "https://docsearch-doctools.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEX_NAME", "gw-docs", allowEmpty = false)
            }

            vcs {
                root(AbsoluteId(vcs_root_id), "+:. => %SOURCES_ROOT%")
            }


        })

        class BuildAndUploadToS3Abstract(product: String, platform: String, version: String, doc_id: String, build_name: String, ditaval_file: String, input_path: String, build_env: String, publish_path: String, vcs_root_id: String, resources: JSONArray?, git_source_url: String, git_source_branch: String) : BuildType({
            templates(CrawlDocumentAndUpdateIndex, PublishBrokenLinksReportToS3)

            id = RelativeId(doc_id + env)
            name = build_name

            maxRunningBuilds = 1

            var build_format = "wh-pdf"
            var pdf_transtype = "pdf5_Guidewire"
            var git_src_url = git_source_url
            if (build_env == "int") {
                build_format = "webhelp_Guidewire_validate"
                pdf_transtype = ""
                git_src_url = ""
            }

            params {
                text("env.SOURCES_ROOT", "src_root", allowEmpty = false)
                text("env.FORMAT", build_format, allowEmpty = false)
                text("env.PDF_TRANSTYPE", pdf_transtype)
                text("env.DITAVAL_FILE", ditaval_file, allowEmpty = false)
                text("env.INPUT_PATH", input_path, allowEmpty = false)
                text("env.S3_BUCKET_NAME", "tenant-doctools-${build_env}-builds", allowEmpty = false)
                text("env.PUBLISH_PATH", publish_path, allowEmpty = false)
                text("env.PRODUCT", product, allowEmpty = false)
                text("env.PLATFORM", platform, allowEmpty = false)
                text("env.VERSION", version, allowEmpty = false)
                text("env.SSH_USER", value = "ssh_user", allowEmpty = false)
                password("env.SSH_PASSWORD", value = "credentialsJSON:a547ee60-435e-47c3-901e-a1255a38dd3b")
                text("TOOLS_ROOT", "tools_root", allowEmpty = false)
                text("CONFIG_FILE_URL", "https://ditaot.internal.${build_env}.ccs.guidewire.net/portal-config/config.json", allowEmpty = false)
                text("APP_BASE_URL", "https://docs.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("DOC_S3_URL", "https://ditaot.internal.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("DOC_ID", doc_id, allowEmpty = false)
                text("ELASTICSEARCH_URLS", "https://docsearch-doctools.${build_env}.ccs.guidewire.net", allowEmpty = false)
                text("INDEX_NAME", "gw-docs", allowEmpty = false)
            }

            var baseDitaCommand = "%env.DITA_OT_DIR%/bin/dita --input=\"%env.SOURCES_ROOT%/%env.INPUT_PATH%\" --format=%env.FORMAT% --use-doc-portal-params=yes --gw-product=\"%env.PRODUCT%\" --gw-platform=\"%env.PLATFORM%\" --gw-version=\"%env.VERSION%\""
            if (ditaval_file != "") {
                baseDitaCommand += " --filter=\"%env.SOURCES_ROOT%/$ditaval_file\""
            }

            if (git_src_url != "") {
                baseDitaCommand += " --git.url=$git_src_url"
                if (git_source_branch != "") {
                    baseDitaCommand += " --git.branch=$git_source_branch"
                }
            }

            if (pdf_transtype != "") {
                baseDitaCommand += " --dita.ot.pdf.format=\"%env.PDF_TRANSTYPE%\""
            }

            steps {
                script {
                    name = "Run DITA build"
                    id = "RUN_DITA_BUILD"
                    scriptContent = """
                            chmod -R 777 ./
                            %env.DITA_OT_DIR%/bin/dita --install
                            
                            $baseDitaCommand
                        """.trimIndent()
                }
                script {
                    name = "Upload generated content to the S3 bucket"
                    id = "UPLOAD_GENERATED_CONTENT"
                    scriptContent = "aws s3 sync ./out s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete"
                }

                stepsOrder = arrayListOf<String>("RUN_DITA_BUILD", "UPLOAD_GENERATED_CONTENT", "BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC", "PUBLISH_BROKEN_LINK")
            }



            features {
                dockerSupport {
                    id = "DockerSupport"
                    loginToRegistry = on {
                        dockerRegistryId = "PROJECT_EXT_155"
                    }
                }
            }

            val resourceVcsIds = mutableListOf<String>()

            if (resources != null) {
                val extraSteps = mutableListOf<ScriptBuildStep>()
                val stepIds = mutableListOf<String>()
                for (j in 0 until resources.length()) {
                    val resource = resources.getJSONObject(j)
                    resourceVcsIds.add(resource.getString("src"))
                    val resourceSourceFolder = resource.getString("sourceFolder")
                    val resourceTargetFolder = resource.getString("targetFolder")

                    val stepId = "COPY_RESOURCES$j"
                    stepIds.add(stepId)

                    extraSteps.add(ScriptBuildStep {
                        id = stepId
                        name = "Copy resources from git to S3"
                        scriptContent = """
                                    export S3_BUCKET_NAME=tenant-doctools-$env-builds
                                    if [[ $env == "prod" ]]; then
                                        echo "Setting credentials to access prod"
                                        export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                                        export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                                        export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                                    fi
                                    
                                    echo "Copying files to S3"
                                    aws s3 sync ./resource$j/$resourceSourceFolder/ s3://${'$'}S3_BUCKET_NAME/${'$'}PUBLISH_PATH/$resourceTargetFolder --delete
                                """.trimIndent()
                    })
                }

                val orderWithExtraSteps = arrayListOf<String>()
                orderWithExtraSteps.addAll(arrayListOf<String>("RUN_DITA_BUILD", "UPLOAD_GENERATED_CONTENT"))
                orderWithExtraSteps.addAll(stepIds)
                orderWithExtraSteps.addAll(arrayListOf<String>("BUILD_CRAWLER_DOCKER_IMAGE", "CRAWL_DOC", "PUBLISH_BROKEN_LINK"))

                steps {
                    extraSteps.forEach(this::step)
                    stepsOrder = orderWithExtraSteps
                }
            }

            vcs {
                root(AbsoluteId("DocumentationTools_DitaOtPlugins"), "+:. => ./%env.DITA_OT_PLUGINS_DIR%")
                root(AbsoluteId(vcs_root_id), "+:. => %env.SOURCES_ROOT%")
                if (resourceVcsIds.count() > 0) {
                    for (i in 0 until resourceVcsIds.count()) {
                        root(AbsoluteId(resourceVcsIds[i]), "+:. => resource$i")
                    }
                }

                cleanCheckout = true
            }

            if (env == "int") {
                triggers {
                    vcs {
                        triggerRules = """
                        -:root=${vcsrootmasteronly.id}:**
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

            }

        })

        val configPath = "config/server-config.json"
        val config = JSONObject(File(configPath).readText(Charsets.UTF_8))

        val builds = mutableListOf<BuildType>()

        val docConfigs = config.getJSONArray("docs")
        for (i in 0 until docConfigs.length()) {
            val doc = docConfigs.getJSONObject(i)
            if (doc.has("build")) {
                val buildId = doc.getString("id")
                val publishPath = doc.getString("url")
                val title = doc.getString("title")

                val metadata = doc.getJSONObject("metadata")
                val product = metadata.getJSONArray("product")[0].toString()
                val platform = metadata.getJSONArray("platform").joinToString(separator = ",")
                val version = metadata.getString("version")
                val environments = doc.getJSONArray("environments")

                val buildName = "Build $title $platform $version ($buildId)"

                val build: JSONObject = doc.getJSONObject("build")
                val buildType = build.getString("buildType")
                var filter = ""
                if (build.has("filter")) {
                    filter = build.getString("filter")
                }

                var resources: JSONArray? = null
                if (build.has("resources")) {
                    resources = build.getJSONArray("resources")
                }

                val root = build.getString("root")
                val vcsRootId = build.getString("src")
                val sourcesFromConfig = getSourcesFromConfig()
                val (sourceGitUrl, sourceGitBranch) = getSourceById(vcsRootId, sourcesFromConfig)

                if (environments.contains(env)) {
                    if (env == "prod") {
                        builds.add(UploadToS3AbstractProd(publishPath, title, buildId, version, platform, env))
                    } else {
                        if (buildType == "dita-dev") {
                            builds.add(BuildAndUploadToS3AbstractDevAndIntDitaDev(buildId, buildName, filter, root, env,
                                    publishPath, vcsRootId))
                        } else {
                            builds.add(BuildAndUploadToS3Abstract(product, platform, version, buildId, buildName, filter, root, env,
                                    publishPath, vcsRootId, resources, sourceGitUrl, sourceGitBranch))
                        }
                    }
                }
            }
        }

        return builds
    }

    private fun getSourceById(sourceId: String, sourceList: JSONArray): Pair<String, String> {
        for (i in 0 until sourceList.length()) {
            val source = sourceList.getJSONObject(i)
            if (source.getString("id") == sourceId) {
                var sourceGitBranch = ""
                val sourceGitUrl = source.getString("gitUrl")
                if (source.has("branch")) {
                    sourceGitBranch = source.getString("branch")
                }
                return Pair(sourceGitUrl, sourceGitBranch)
            }
        }
        return Pair("", "")
    }

    private fun getSourcesFromConfig(): JSONArray {
        val sourceConfigPath = "config/sources.json"
        val config = JSONObject(File(sourceConfigPath).readText(Charsets.UTF_8))
        return config.getJSONArray("sources")
    }

    fun getVcsRootsAndExportsFromConfig(): Pair<MutableList<VcsRoot>, MutableList<BuildType>> {
        class CreateVcsRoot(git_path: String, vcs_root_id: String, branch_name: String) :
                jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot({
                    id = AbsoluteId(vcs_root_id)
                    name = vcs_root_id
                    url = git_path
                    authMethod = uploadedKey {
                        uploadedKey = "sys-doc.rsa"
                    }

                    if (branch_name != "") {
                        branch = "refs/heads/$branch_name"
                    }
                })

        class ExportFilesFromXDocsToBitbucketAbstract(build_id: String, source_title: String, export_path_ids: String,
                                                      vcs_root_id: String, startHour: Int, startMinute: Int) : BuildType({
            templates(AddFilesFromXDocsToBitbucket)

            id = RelativeId(build_id)
            name = "Export $source_title from XDocs and add to git ($build_id)"

            params {
                text("EXPORT_PATH_IDS", export_path_ids, allowEmpty = false)
                text("XDOCS_EXPORT_DIR", "%system.teamcity.build.tempDir%/xdocs_export_dir", allowEmpty = false)
                text("SOURCES_ROOT", "src_root", allowEmpty = false)
            }

            vcs {
                root(AbsoluteId(vcs_root_id), "+:. => %SOURCES_ROOT%")
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
            val startTime = 0
            val interval = 30
            val hour = startTime + ((interval * index) / 60)
            val minute = startTime + ((interval * index) % 60)

            return Pair(hour, minute)
        }

        val builds = mutableListOf<BuildType>()
        val roots = mutableListOf<VcsRoot>()
        var scheduleIndex = 0

        val sourceConfigs = getSourcesFromConfig()
        for (i in 0 until sourceConfigs.length()) {
            val source = sourceConfigs.getJSONObject(i)
            val gitUrl: String = source.get("gitUrl").toString()
            val sourceId: String = source.get("id").toString()
            val sourceTitle: String = source.get("title").toString()
            var branchName = ""
            if (source.has("branch")) {
                branchName = source.getString("branch")
            }
            roots.add(CreateVcsRoot(gitUrl, sourceId, branchName))

            if (source.has("xdocsPathIds")) {
                val exportBuildId: String = source.get("id").toString() + "export"
                val xdocsPathIds: String = source.getJSONArray("xdocsPathIds").joinToString(" ")
                val (availableHour, availableMinute) = getScheduleWindow(scheduleIndex)
                scheduleIndex++

                builds.add(ExportFilesFromXDocsToBitbucketAbstract(exportBuildId,
                        sourceTitle, xdocsPathIds, sourceId, availableHour, availableMinute))
            }
        }

        return Pair(roots, builds)
    }

    fun getContentProjectFromConfig(env: String): Project {
        return Project {
            id = RelativeId("deploycontentto$env")
            name = "Deploy content to $env"

            val builds = getBuildsFromConfig(env)
            builds.forEach(this::buildType)
        }
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
    name = "Update search index (all docs or single doc)"

    artifactRules = """
        **/*.log => logs
    """.trimIndent()

    params {
        text("env.CONFIG_FILE_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.CONFIG_FILE_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json", allowEmpty = false)
        text("env.DOC_S3_URL", "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.DOC_S3_URL_PROD", "https://ditaot.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS_PROD", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net", allowEmpty = false)
        text("env.INDEX_NAME", "gw-docs", allowEmpty = false)
        select("env.DEPLOY_ENV", "", label = "Deployment environment", description = "Select an environment on which you want reindex documents", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
        text("env.DOC_ID", "", label = "Doc ID", description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.",
                display = ParameterDisplay.PROMPT, allowEmpty = true)
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
            name = "Crawl the documents and update the index"
            scriptContent = """
                #!/bin/bash
                set -xe
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export DOC_S3_URL="%env.DOC_S3_URL_PROD%"
                    export ELASTICSEARCH_URLS="%env.ELASTICSEARCH_URLS_PROD%"
                    export CONFIG_FILE_URL="%env.CONFIG_FILE_URL_PROD%"
                fi
                
                curl %env.CONFIG_FILE_URL% > %teamcity.build.workingDir%/config.json
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"

                cd apps/search_indexer
                make run-doc-crawler
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

        script {
            name = "Publish broken link report to S3"
            scriptContent = "aws s3 sync ./apps/search_indexer/out s3://tenant-doctools-admin-builds/broken-links-reports/%env.DEPLOY_ENV%/%env.DOC_ID%"
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
                
                curl ${'$'}CONFIG_FILE_URL > %teamcity.build.workingDir%/config.json
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"                
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
                password = "zxx02d98e2c9ff7a3fe236631b550fc8db9b0a9c655f3a18e4b775d03cbe80d301b"
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

object BuildAndUploadToS3DitaDev : Template({
    name = "Build DITA DEV and upload to S3 template"

    maxRunningBuilds = 1

    params {
        text("env.TOOLS_ROOT", "%TOOLS_ROOT%", allowEmpty = false)
        text("env.DITA_OUTPUT_DIR", "%DITA_OUTPUT_DIR%", allowEmpty = false)
        text("env.OUTPUT_DIR", "%OUTPUT_DIR%", allowEmpty = false)
        text("env.S3_BUCKET_NAME", "%S3_BUCKET_NAME%", description = "Set to dev, int or staging", allowEmpty = false)
        text("env.INPUT_PATH", "%INPUT_PATH%", allowEmpty = false)
        text("env.PUBLISH_PATH", "%PUBLISH_PATH%", allowEmpty = false)
        text("env.FORMAT", "%FORMAT%", allowEmpty = false)
        text("env.DITAVAL_FILE", "%DITAVAL_FILE%", allowEmpty = false)
        text("env.SOURCES_ROOT", "%SOURCES_ROOT%", allowEmpty = false)
    }

    vcs {
        root(AbsoluteId("DocumentationTools_DitaOtPlugins"), "+:. => ./%env.DITA_OT_PLUGINS_DIR%")

        cleanCheckout = true
    }

    steps {
        script {
            name = "Run build"
            id = "RUNNER_2108"
            scriptContent = """
                chmod -R 777 ./
                %env.DITA_OT_DIR%/bin/dita --install
                %env.DITA_OT_DIR%/bin/dita --input=%env.SOURCES_ROOT%/%env.INPUT_PATH% --output=%env.DITA_OUTPUT_DIR% --format=%env.FORMAT% --filter=%env.SOURCES_ROOT%/%env.DITAVAL_FILE% --use-doc-portal-params=yes --nav-toc=full --toc.class=home
            """.trimIndent()
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
            name = "Run transformations for HTML5"
            id = "RUNNER_2635"
            workingDir = "%env.TOOLS_ROOT%"
            scriptContent = """
                cd apps/dita_processor
                make run-html5-processor
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
        script {
            name = "Upload to the S3 bucket"
            id = "RUNNER_2633"
            scriptContent = "aws s3 sync %env.OUTPUT_DIR% s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete"
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

object CrawlDocumentAndUpdateIndex : Template({
    name = "Crawl document and update index"

    maxRunningBuilds = 1

    artifactRules = """
        **/*.log => logs
    """.trimIndent()


    params {
        text("env.TOOLS_ROOT", "%TOOLS_ROOT%", allowEmpty = false)
        text("env.CONFIG_FILE_URL", "%CONFIG_FILE_URL%", allowEmpty = false)
        text("env.APP_BASE_URL", "%APP_BASE_URL%", allowEmpty = false)
        text("env.DOC_S3_URL", "%DOC_S3_URL%", allowEmpty = false)
        text("env.DOC_ID", "%DOC_ID%", allowEmpty = false)
        text("env.ELASTICSEARCH_URLS", "%ELASTICSEARCH_URLS%", allowEmpty = false)
        text("env.INDEX_NAME", "%INDEX_NAME%", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly, "+:. => %env.TOOLS_ROOT%")

        cleanCheckout = true
    }

    steps {
        dockerCommand {
            name = "Build a Python Docker image"
            id = "BUILD_CRAWLER_DOCKER_IMAGE"
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
            name = "Crawl the document and update the index"
            id = "CRAWL_DOC"
            workingDir = "%env.TOOLS_ROOT%"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                curl %env.CONFIG_FILE_URL% > %teamcity.build.workingDir%/config.json
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

object PublishBrokenLinksReportToS3 : Template({
    name = "Publish the broken link report to S3"

    params {
        text("env.TOOLS_ROOT", "%TOOLS_ROOT%", allowEmpty = false)
        text("env.S3_BUCKET_NAME", "%S3_BUCKET_NAME%", allowEmpty = false)
        text("env.PUBLISH_PATH", "%PUBLISH_PATH%", allowEmpty = false)
    }
    steps {
        script {
            name = "Publish broken link report to S3"
            id = "PUBLISH_BROKEN_LINK"
            workingDir = "%env.TOOLS_ROOT%"
            scriptContent = "aws s3 sync ./apps/search_indexer/out s3://%env.S3_BUCKET_NAME%/broken-links-reports/%env.PUBLISH_PATH% --delete"
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
    buildType(DeployServerConfig)

    buildTypesOrder = arrayListOf(DeployServerConfig, Test, Checkmarx, DeployDev, DeployInt, DeployStaging, DeployProd, Release)
})

object Content : Project({
    name = "Content"

    val (roots, builds) = Helpers.getVcsRootsAndExportsFromConfig()
    roots.forEach(this::vcsRoot)
    builds.forEach(this::buildType)

    buildType(UpdateSearchIndex)
    buildType(CleanUpIndex)
    subProject(DeployServices)
    buildType(TestContent)
    subProject(Helpers.getContentProjectFromConfig("dev"))
    subProject(Helpers.getContentProjectFromConfig("int"))
    subProject(Helpers.getContentProjectFromConfig("staging"))
    subProject(Helpers.getContentProjectFromConfig("prod"))

})

object DeployServices : Project({
    name = "Deploy services"

    buildType(DeployS3Ingress)
    buildType(DeploySearchService)
})

object BuildInsuranceSuiteGuide : BuildType({
    name = "Build an InsuranceSuite guide"

    params {
        password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
        select("env.DEPLOY_ENV", "int", display = ParameterDisplay.PROMPT,
                options = listOf("dev", "staging", "int", "prod"))
        text("env.DOC_ID", "", display = ParameterDisplay.PROMPT, allowEmpty = false)
    }

    steps {
        script {
            name = "Trigger a modular build"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                curl -X POST -H "Content-Type: application/xml" \
                    -H "Authorization: Bearer %env.AUTH_TOKEN%" \
                    -H "Accept: application/json" \
                    -d  '<build><buildType id="${GetDocParametersFromConfigFiles.id}"/><properties><property name="env.DEPLOY_ENV" value="%env.DEPLOY_ENV%"/><property name="env.DOC_ID" value="%env.DOC_ID%"/></properties></build>' \
                    https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/buildQueue
            """.trimIndent()
        }
    }
})

object GetDocParametersFromConfigFiles : BuildType({
    name = "Get doc parameters from config files"

    params {
        password("env.AUTH_TOKEN", "zxxaeec8f6f6d499cc0f0456adfd76876510711db553bf4359d4b467411e68628e67b5785b904c4aeaf6847d4cb54386644e6a95f0b3a5ed7c6c2d0f461cc147a675cfa7d14a3d1af6ca3fc930f3765e9e9361acdb990f107a25d9043559a221834c6c16a63597f75da68982eb331797083", display = ParameterDisplay.HIDDEN)
        text("env.CONFIG_FILE", "%teamcity.build.checkoutDir%/.teamcity/config/server-config.json", allowEmpty = false)
        text("env.DEPLOY_ENV", "", allowEmpty = true)
        text("env.SOURCES_FILE", "%teamcity.build.checkoutDir%/.teamcity/config/sources.json", allowEmpty = false)
        text("env.OUT_FILE", "%teamcity.build.workingDir%/doc_params.txt")
        text("env.DOC_ID", "", allowEmpty = true)
    }

    vcs {
        root(DslContext.settingsRoot)
        cleanCheckout = true
    }

    steps {
        script {
            name = "Get doc parameters from config files"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export GW_PRODUCT=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).metadata.product[0]' %env.CONFIG_FILE%)
                export GW_PLATFORM=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).metadata.platform[0]' %env.CONFIG_FILE%)
                export GW_VERSION=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).metadata.version' %env.CONFIG_FILE%)
                export FILTER_PATH=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).build.filter' %env.CONFIG_FILE%)
                export ROOT_MAP=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).build.root' %env.CONFIG_FILE%)
                
                export SOURCE_ID=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).build.src' %env.CONFIG_FILE%)
                export GIT_URL=${'$'}(jq -r --arg source_id "${'$'}SOURCE_ID" '.sources | .[] | select(.id == ${'$'}source_id).gitUrl' %env.SOURCES_FILE%)
                export GIT_BRANCH=${'$'}(jq -r --arg source_id "${'$'}SOURCE_ID" '.sources | .[] | select(.id == ${'$'}source_id).branch' %env.SOURCES_FILE%)
                
                if [[ "${'$'}GIT_BRANCH" == null ]]; then
                  export GIT_BRANCH=master
                fi
                
                export PUBLISH_PATH=${'$'}(jq -r --arg doc_id "${'$'}DOC_ID" '.docs | .[] | select(.id == ${'$'}doc_id).url' %env.CONFIG_FILE%)
                
                curl -X POST -H "Content-Type: application/xml" \
                    -H "Authorization: Bearer %env.AUTH_TOKEN%" \
                    -H "Accept: application/json" \
                    -d  '<build><buildType id="${BuildOutputFromDita.id}"/><properties><property name="env.GW_PRODUCT" value="'"${'$'}GW_PRODUCT"'"/><property name="env.GW_PLATFORM" value="'"${'$'}GW_PLATFORM"'"/><property name="env.GW_VERSION" value="'"${'$'}GW_VERSION"'"/><property name="env.FILTER_PATH" value="'"${'$'}FILTER_PATH"'"/><property name="env.ROOT_MAP" value="'"${'$'}ROOT_MAP"'"/><property name="env.GIT_URL" value="'"${'$'}GIT_URL"'"/><property name="env.GIT_BRANCH" value="'"${'$'}GIT_BRANCH"'"/><property name="env.PUBLISH_PATH" value="'"${'$'}PUBLISH_PATH"'"/><property name="env.DOC_ID" value="%env.DOC_ID%"/></properties></build>' \
                    https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/buildQueue

            """.trimIndent()
        }
    }
})

object TestExportFromXDocs : BuildType({
    name = "Test export from XDocs"

    params {
        text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.EXPORT_PATH_IDS", "/Content/doc/insuranceSuite/upgrade/1.x/active/upgrade-guide/_superbook.ditamap /SysConfig/publishProfiles/processingProfiles/filterSets/IS-BC-OnPrem-Draft.ditaval /SysConfig/publishProfiles/processingProfiles/filterSets/IS-CC-OnPrem-Draft.ditaval /SysConfig/publishProfiles/processingProfiles/filterSets/IS-PC-OnPrem-Draft.ditaval")
        text("reverse.dep.${ExportFilesFromXDocsToBitbucket.id}.env.GIT_URL", "ssh://git@stash.guidewire.com/docsources/insurancesuite-upgrade-tools-1x.git")
    }

    dependencies {
        snapshot(ExportFilesFromXDocsToBitbucket) {
            synchronizeRevisions = true
            reuseBuilds = ReuseBuilds.NO
            runOnSameAgent = true
        }
    }
})

object ExportFilesFromXDocsToBitbucket : BuildType({
    name = "Export files from XDocs to Bitbucket"

    maxRunningBuilds = 2

    params {
        text("env.EXPORT_PATH_IDS", "", allowEmpty = true)
        text("env.GIT_URL", "", allowEmpty = true)
        text("env.SOURCES_ROOT", "src_root", label = "Git clone directory", description = "Directory for the repo cloned from Bitbucket", display = ParameterDisplay.HIDDEN, allowEmpty = false)
        text("env.XDOCS_EXPORT_DIR", "%system.teamcity.build.tempDir%/xdocs_export_dir ", allowEmpty = false)
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
                git clone --single-branch --branch master %env.GIT_URL% %env.SOURCES_ROOT%
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

object BuildOutputFromDita : BuildType({
    name = "Build the output from DITA"

    maxRunningBuilds = 3

    params {
        text("env.DOC_ID", "", allowEmpty = true)
        text("env.GW_PRODUCT", "", allowEmpty = true)
        text("env.GW_PLATFORM", "", allowEmpty = true)
        text("env.GW_VERSION", "", allowEmpty = true)
        text("env.FILTER_PATH", "", allowEmpty = true)
        text("env.ROOT_MAP", "", allowEmpty = true)
        text("env.GIT_URL", "", allowEmpty = true)
        text("env.GIT_BRANCH", "", allowEmpty = true)
        text("env.PUBLISH_PATH", "", allowEmpty = true)
    }

    steps {
        script {
            name = "Build webhelp from DITA"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export WORKING_DIR=${'$'}(pwd)
                export INPUT_PATH="input"
                export OUTPUT_PATH="out"
                
                git clone --single-branch --branch %env.GIT_BRANCH% %env.GIT_URL% ${'$'}WORKING_DIR/${'$'}INPUT_PATH                
                
                SECONDS=0
                docker login -u '%env.ARTIFACTORY_USERNAME%' --password '%env.ARTIFACTORY_PASSWORD%' artifactory.guidewire.com
                docker pull artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest
                
                echo "Building webhelp for %env.GW_PRODUCT% %env.GW_PLATFORM% %env.GW_VERSION% using filter %env.FILTER_PATH%"
                docker run -i \
                  -v "${'$'}WORKING_DIR":/src artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest \
                  -i /src/"${'$'}INPUT_PATH"/"%env.ROOT_MAP%" \
                  -o /src/"${'$'}OUTPUT_PATH" \
                  -f webhelp_Guidewire \
                  --filter /src/"${'$'}INPUT_PATH"/"%env.FILTER_PATH%" \
                  --use-doc-portal-params yes \
                  --gw-product "%env.GW_PRODUCT%" \
                  --gw-platform "%env.GW_PLATFORM%" \
                  --gw-version "%env.GW_VERSION%" \
                  --create-index-redirect yes \
                  --webhelp.publication.toc.links all
                 
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
        }
    }

    features {
        sshAgent {
            teamcitySshKey = "sys-doc.rsa"
        }
    }
})

object UploadContentToS3 : BuildType({
    name = "Upload content to S3"

    params {
        text("env.DEPLOY_ENV", "", allowEmpty = true)
        text("env.PUBLISH_PATH", "", allowEmpty = true)
        text("env.S3_BUCKET_NAME", "tenant-doctools-%env.DEPLOY_ENV%-builds", allowEmpty = false)
    }

    steps {
        script {
            name = "Upload generated content to the S3 bucket"
            id = "UPLOAD_GENERATED_CONTENT"
            scriptContent = "aws s3 sync ./out s3://%env.S3_BUCKET_NAME%/%env.PUBLISH_PATH% --delete"
        }

    }
})

object CrawlDocumentAndUpdateSearchIndex : BuildType({
    name = "Update the search index"
    artifactRules = """
        **/*.log => logs
    """.trimIndent()


    params {
        text("env.DEPLOY_ENV", "", allowEmpty = true)
        text("env.DOC_ID", "", allowEmpty = true)
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
                
                curl %env.CONFIG_FILE_URL% > %teamcity.build.workingDir%/config.json
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"               

                cd apps/search_indexer
                make run-doc-crawler
            """.trimIndent()
            dockerImage = "python-runner"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }

        script {
            name = "Publish broken links report to S3"
            id = "PUBLISH_BROKEN_LINKS_REPORT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ %env.DEPLOY_ENV% != "prod" ]]; then
                    aws s3 sync ./apps/search_indexer/out s3://tenant-doctools-admin-builds/broken-links-reports/%env.DEPLOY_ENV%/%env.DOC_ID%
                fi
            """.trimIndent()
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

object ModularBuilds : Project({
    name = "Modular builds"

    buildType(BuildInsuranceSuiteGuide)
    buildType(GetDocParametersFromConfigFiles)
    buildType(TestExportFromXDocs)
    buildType(ExportFilesFromXDocsToBitbucket)
    buildType(BuildOutputFromDita)
    buildType(UploadContentToS3)
    buildType(CrawlDocumentAndUpdateSearchIndex)
})

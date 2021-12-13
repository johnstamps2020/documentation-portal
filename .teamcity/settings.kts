import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.*

version = "2021.2"

project {

    params.text("env.NAMESPACE", "doctools")

    GwVcsRoots.createGitVcsRootsFromConfigFiles().forEach {
        vcsRoot(it)
    }
    subProject(Docs.rootProject)
    subProject(Sources.rootProject)
    subProject(Recommendations.rootProject)
    subProject(Content.rootProject)
    subProject(BuildListeners.rootProject)
    subProject(Exports.rootProject)

    features.feature(GwProjectFeatures.GwOxygenWebhelpLicenseProjectFeature)
}

object Docs {
    val rootProject = createRootProjectForDocs()

    private fun createRootProjectForDocs(): Project {
        val mainProject = Project {
            name = "Docs"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            template(GwTemplates.BuildListenerTemplate)
        }

        for (buildConfig in Helpers.buildConfigs) {
            val srcId = buildConfig.getString("srcId")
            val docProject = createDocProject(buildConfig, srcId)
            mainProject.subProject(docProject)
        }

        return mainProject
    }

    private fun createYarnBuildTypes(
        env_names: List<Any>,
        doc_id: String,
        git_repo_id: String,
        git_branch: String,
        publish_path: String,
        working_dir: String,
        index_for_search: Boolean,
        build_command: String?,
        node_image_version: String?,
        gw_platforms: String,
        gw_products: String,
        gw_versions: String,
    ): List<BuildType> {
        val yarnBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val envName = env.toString()
            val docBuildType = createInitialDocBuildType(envName,
                doc_id,
                git_repo_id,
                git_branch,
                publish_path,
                working_dir,
                index_for_search)
            val yarnBuildStep = GwBuildSteps.createBuildYarnProjectStep(envName,
                publish_path,
                build_command,
                node_image_version,
                doc_id,
                gw_products,
                gw_platforms,
                gw_versions,
                working_dir)
            docBuildType.steps.step(yarnBuildStep)
            docBuildType.steps.stepsOrder.add(0, yarnBuildStep.id.toString())
            // FIXME: Reenable this line when the refactoring is done
//            docBuildType.triggers.vcs { BuildTriggers.createVcsTriggerForNonDitaBuilds(src_id) }
            yarnBuildTypes.add(docBuildType)
        }
        return yarnBuildTypes
    }

    private fun createDitaBuildTypes(
        env_names: List<Any>,
        doc_id: String,
        git_repo_id: String,
        git_url: String,
        git_branch: String,
        src_is_exported: Boolean,
        publish_path: String,
        working_dir: String,
        index_for_search: Boolean,
        root_map: String,
        index_redirect: Boolean,
        build_filter: String,
        gw_platforms: String,
        gw_products: String,
        gw_versions: String,
        resources_to_copy: JSONArray,
    ): List<BuildType> {
        val ditaBuildTypes = mutableListOf<BuildType>()
        val outputDir = "out"
        for (env in env_names) {
            val envName = env.toString()
            val docBuildType = createInitialDocBuildType(envName,
                doc_id,
                git_repo_id,
                git_branch,
                publish_path,
                working_dir,
                index_for_search)
            if (envName == "prod") {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                docBuildType.artifactRules = "${working_dir}/${outputDir}/build-data.json => json"
                docBuildType.features.feature(GwBuildFeatures.GwOxygenWebhelpLicenseBuildFeature)
                val buildDitaProjectStep: ScriptBuildStep
                if (envName == "staging") {
                    buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep("webhelp_with_pdf",
                        root_map,
                        index_redirect,
                        working_dir,
                        outputDir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        git_url,
                        git_branch)
                    if (gw_platforms.lowercase(Locale.getDefault()).contains("self-managed")) {
                        val localOutputDir = "${outputDir}/zip"
                        val buildDitaProjectForOfflineUseStep =
                            GwBuildSteps.createBuildDitaProjectForBuildsStep("webhelp",
                                root_map,
                                index_redirect,
                                working_dir,
                                localOutputDir,
                                for_offline_use = true)
                        docBuildType.steps.step(buildDitaProjectForOfflineUseStep)
                        docBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
                        val zipPackageStep = GwBuildSteps.createZipPackageStep("${working_dir}/${localOutputDir}",
                            "${working_dir}/${outputDir}")
                        docBuildType.steps.step(zipPackageStep)
                        docBuildType.steps.stepsOrder.add(1, zipPackageStep.id.toString())
                    }
                } else {
                    buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep("webhelp",
                        root_map,
                        index_redirect,
                        working_dir,
                        outputDir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        git_url,
                        git_branch)
                }
                docBuildType.steps.step(buildDitaProjectStep)
                docBuildType.steps.stepsOrder.add(0, buildDitaProjectStep.id.toString())
                if (!resources_to_copy.isEmpty) {
                    val copyResourcesSteps = mutableListOf<ScriptBuildStep>()
                    for (stepId in 0 until resources_to_copy.length()) {
                        val resourceObject = resources_to_copy.getJSONObject(stepId)
                        val resourceSrcDir = resourceObject.getString("sourceFolder")
                        val resourceSrcId = resourceObject.getString("srcId")
                        val resourceSrcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", resourceSrcId)
                        val resourceSrcUrl = resourceSrcConfig.getString("gitUrl")
                        val resourceSrcBranch = resourceSrcConfig.getString("branch")

                        val resourceTargetDir = resourceObject.getString("targetFolder")
                        val copyResourcesStep = GwBuildSteps.createCopyResourcesStep(stepId,
                            working_dir,
                            outputDir,
                            resourceSrcDir,
                            resourceTargetDir,
                            resourceSrcUrl,
                            resourceSrcBranch)
                        copyResourcesSteps.add(copyResourcesStep)
                    }
                    docBuildType.steps {
                        copyResourcesSteps.forEach { step(it) }
                        stepsOrder.addAll(stepsOrder.indexOf("UPLOAD_CONTENT_TO_S3_BUCKET"),
                            copyResourcesSteps.map { it.id.toString() })
                    }
                    docBuildType.features.feature(GwBuildFeatures.GwSshAgentBuildFeature)
                }
                // FIXME: Reenable this line when the refactoring is done
//                if (arrayOf("int", "staging").contains(envName) && src_is_exported) {
//                    docBuildType.triggers.vcs {
//                        GwBuildTriggers.createVcsTriggerForExportedVcsRoot(
//                            Helpers.resolveRelativeIdFromIdString(git_repo_id).toString()
//                        )
//                    }
//                }
            }

            ditaBuildTypes.add(docBuildType)
        }
        for (format in arrayListOf("webhelp", "pdf", "webhelp_with_pdf")) {
            val downloadableOutputBuildType = BuildType {
                name = "Build downloadable ${format.replace("_", " ")}"
                id = Helpers.resolveRelativeIdFromIdString("$doc_id$format")

                artifactRules = "${working_dir}/${outputDir} => /"

                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(git_repo_id))
                    branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch))
                    cleanCheckout = true
                }


                features {
                    feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                }
            }
            val localOutputDir = "${outputDir}/zip"
            val buildDitaProjectForOfflineUseStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(format,
                root_map,
                index_redirect,
                working_dir,
                localOutputDir,
                build_filter,
                for_offline_use = true)
            downloadableOutputBuildType.steps.step(buildDitaProjectForOfflineUseStep)
            downloadableOutputBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
            val zipPackageStep =
                GwBuildSteps.createZipPackageStep("${working_dir}/${localOutputDir}", "${working_dir}/${outputDir}")
            downloadableOutputBuildType.steps.step(zipPackageStep)
            downloadableOutputBuildType.steps.stepsOrder.add(1, zipPackageStep.id.toString())
            ditaBuildTypes.add(downloadableOutputBuildType)
        }
        return ditaBuildTypes
    }

    private fun createInitialDocBuildType(
        deploy_env: String,
        doc_id: String,
        git_repo_id: String,
        git_branch: String,
        publish_path: String,
        working_dir: String,
        index_for_search: Boolean,
    ): BuildType {
        return BuildType {
            name = "Publish to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString("$doc_id$deploy_env")

            if (arrayOf("int", "staging").contains(deploy_env)) {
                templates(GwTemplates.BuildListenerTemplate)
            }

            if (arrayOf("dev", "int", "staging").contains(deploy_env)) {
                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(git_repo_id))
                    branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch))
                    cleanCheckout = true
                }
                val uploadContentToS3BucketStep =
                    GwBuildSteps.createUploadContentToS3BucketStep(deploy_env, publish_path, working_dir)
                steps.step(uploadContentToS3BucketStep)
                steps.stepsOrder.add(uploadContentToS3BucketStep.id.toString())
            }

            if (index_for_search) {
                val configFile = "%teamcity.build.workingDir%/config.json"
                val configFileStep = GwBuildSteps.createGetConfigFileStep(deploy_env, configFile)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = GwBuildSteps.createCrawlDocStep(deploy_env, doc_id, configFile)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }

    }

    private fun createDocProject(build_config: JSONObject, src_id: String): Project {
        val gwBuildType = build_config.getString("buildType")
        val docId = build_config.getString("docId")
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val docEnvironmentsList = Helpers.convertJsonArrayWithStringsToList(docEnvironments)
        val workingDir = when (build_config.has("workingDir")) {
            false -> {
                "%teamcity.build.checkoutDir%"
            }
            true -> {
                "%teamcity.build.checkoutDir%/${build_config.getString("workingDir")}"
            }
        }
        val indexForSearch = if (docConfig.has("indexForSearch")) docConfig.getBoolean("indexForSearch") else true

        val metadata = docConfig.getJSONObject("metadata")
        val gwPlatforms = metadata.getJSONArray("platform")
        val gwProducts = metadata.getJSONArray("product")
        val gwVersions = metadata.getJSONArray("version")
        val gwPlatformsString = gwPlatforms.joinToString(",")
        val gwProductsString = gwProducts.joinToString(",")
        val gwVersionsString = gwVersions.joinToString(",")

        val publishPath = docConfig.getString("url")

        val (gitRepoConfig, src) = Helpers.getGitRepoAndSrcBySrcId(src_id)
        val gitRepoId = gitRepoConfig.getString("id").ifEmpty { "" }
        val gitUrl = gitRepoConfig.getString("gitUrl")
        val gitBranch = src.getString("branch")

        val docProjectBuildTypes = mutableListOf<BuildType>()
        if (gwBuildType == "yarn") {
            val nodeImageVersion =
                if (build_config.has("nodeImageVersion")) build_config.getString("nodeImageVersion") else null
            val buildCommand =
                if (build_config.has("yarnBuildCustomCommand")) build_config.getString("yarnBuildCustomCommand") else null
            docProjectBuildTypes += createYarnBuildTypes(docEnvironmentsList,
                docId,
                gitRepoId,
                gitBranch,
                publishPath,
                workingDir,
                indexForSearch,
                buildCommand,
                nodeImageVersion,
                gwPlatformsString,
                gwProductsString,
                gwVersionsString)
        } else if (gwBuildType == "dita") {
            val rootMap = build_config.getString("root")
            val indexRedirect = when (build_config.has("indexRedirect")) {
                true -> {
                    build_config.getBoolean("indexRedirect")
                }
                else -> {
                    false
                }

            }
            val buildFilter = when (build_config.has("filter")) {
                true -> {
                    build_config.getString("filter")
                }
                else -> {
                    ""
                }
            }
            val resourcesToCopy =
                if (build_config.has("resources")) build_config.getJSONArray("resources") else JSONArray()

            val srcIsExported = src.getBoolean("isExported")

            docProjectBuildTypes += createDitaBuildTypes(
                docEnvironmentsList,
                docId,
                gitRepoId,
                gitUrl,
                gitBranch,
                srcIsExported,
                publishPath,
                workingDir,
                indexForSearch,
                rootMap,
                indexRedirect,
                buildFilter,
                gwPlatformsString,
                gwProductsString,
                gwVersionsString,
                resourcesToCopy
            )

        }

        return Project {
            name = "$docTitle ($docId)"
            id = Helpers.resolveRelativeIdFromIdString(docId)

            docProjectBuildTypes.forEach {
                buildType(it)
            }
        }
    }

}

object Content {
    val rootProject = createRootProjectForContent()

    private fun createRootProjectForContent(): Project {
        val mainProject = Project {
            name = "Content"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
        }
        mainProject.buildType(GwBuildTypes.CleanUpIndexBuildType)
        mainProject.buildType(GwBuildTypes.UpdateSearchIndexBuildType)
        mainProject.buildType(GwBuildTypes.UploadPdfsForEscrowBuildType)

        return mainProject
    }
}

object Server

object Exports {
    val rootProject = createRootProjectForExports()

    private fun createRootProjectForExports(): Project {
        val mainProject = Project {
            name = "Exports"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
        }
        mainProject.vcsRoot(GwVcsRoots.xdocsClientGitVcsRoot)
        mainProject.buildType(GwBuildTypes.ExportFilesFromXDocsToBitbucketBuildType)
        createExportBuildTypes().forEach {
            mainProject.buildType(it)
        }

        return mainProject
    }

    private fun createExportBuildTypes(): List<BuildType> {
        val exportBuildTypes = mutableListOf<BuildType>()
        val exportServers = arrayOf("ORP-XDOCS-WDB03", "ORP-XDOCS-WDB04")
        var exportServerIndex = 0

        var scheduleHourDaily = 0
        var scheduleMinuteDaily = 0

        var scheduleHourWeekly = 12
        var scheduleMinuteWeekly = 0

        for (sourceConfig in Helpers.sourceConfigs) {
            if (sourceConfig.has("xdocsPathIds")) {
                val srcId = sourceConfig.getString("id")
                val srcTitle = sourceConfig.getString("title")
                val xdocsPathIds = sourceConfig.getJSONArray("xdocsPathIds").joinToString(" ")
                val gitUrl = sourceConfig.getString("gitUrl")
                val gitBranch = sourceConfig.getString("branch")
                val buildConfigsRelatedToSrc = Helpers.buildConfigs.filter {
                    it.getString("srcId") == srcId
                }
                val docConfigsRelatedToSrc = buildConfigsRelatedToSrc.map {
                    Helpers.getObjectById(Helpers.docConfigs, "id", it.getString("docId"))
                }

                val environmentsFromRelatedDocConfigs =
                    docConfigsRelatedToSrc.map { Helpers.convertJsonArrayWithStringsToLowercaseList(it.getJSONArray("environments")) }
                        .flatten().distinct()

                val exportFrequency = when (environmentsFromRelatedDocConfigs.contains("int")) {
                    true -> {
                        if (sourceConfig.has("exportFrequency")) sourceConfig.getString("exportFrequency") else "daily"
                    }
                    else -> ""
                }
                val exportServer = exportServers[exportServerIndex]

                var scheduleHour: Int
                var scheduleMinute: Int
                when (exportFrequency) {
                    "daily" -> {
                        scheduleHour = scheduleHourDaily
                        scheduleMinute = scheduleMinuteDaily
                        scheduleMinuteDaily += 2
                        if (scheduleMinuteDaily >= 60) {
                            scheduleHourDaily += 1
                            scheduleMinuteDaily = 0
                        }
                        if (scheduleHourDaily >= 24) {
                            scheduleHourDaily = 0
                        }
                        exportServerIndex = when (exportServerIndex + 1 == exportServers.size) {
                            true -> 0
                            else -> +1
                        }
                    }
                    "weekly" -> {
                        scheduleHour = scheduleHourWeekly
                        scheduleMinute = scheduleMinuteWeekly
                        scheduleMinuteWeekly += 10
                        if (scheduleMinuteWeekly >= 60) {
                            scheduleHourWeekly += 1
                            scheduleMinuteWeekly = 0
                        }
                        if (scheduleHourWeekly >= 24) {
                            scheduleHourWeekly = 0
                        }
                    }
                    else -> {
                        scheduleHour = 0
                        scheduleMinute = 0
                    }
                }

                exportBuildTypes.add(GwBuildTypes.createExportFilesFromXDocsToBitbucketCompositeBuildType(srcTitle,
                    xdocsPathIds,
                    gitUrl,
                    gitBranch,
                    srcId,
                    exportServer,
                    exportFrequency,
                    scheduleHour,
                    scheduleMinute))
            }
        }
        return exportBuildTypes
    }
}

object BuildListeners {
    val rootProject = createBuildListenersProject()

    private fun getSourcesForBuildListenerBuildTypes(): List<Pair<String, List<JSONObject>>> {
        val sourcesRequiringListeners = mutableListOf<Pair<String, List<JSONObject>>>()
        for (gitRepo in Helpers.gitNativeRepos) {
            val gitRepoSources = (gitRepo as JSONObject).getJSONArray("sources")
            val sourcesToMonitor = mutableListOf<JSONObject>()
            for (src in gitRepoSources) {
                val srcId = (src as JSONObject).getString("srcId")
                val ditaBuildsRelatedToSrc =
                    Helpers.buildConfigs.filter { it.getString("srcId") == srcId && it.getString("buildType") == "dita" }
                val uniqueEnvsFromAllDitaBuildsRelatedToSrc = ditaBuildsRelatedToSrc.map {
                    val buildDocId = it.getString("docId")
                    val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", buildDocId)
                    Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
                }.flatten().distinct()

                if (arrayListOf("int", "staging").any { uniqueEnvsFromAllDitaBuildsRelatedToSrc.contains(it) }) {
                    sourcesToMonitor.add(src)
                }
            }
            if (sourcesToMonitor.isNotEmpty()) {
                sourcesRequiringListeners.add(Pair(gitRepo.getString("id"), sourcesToMonitor))
            }
        }
        return sourcesRequiringListeners
    }

    private fun createBuildListenersProject(): Project {
        return Project {
            name = "Build listeners"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            val buildListenerGitRepos = getSourcesForBuildListenerBuildTypes()
            buildListenerGitRepos.forEach {
                val (gitRepoId, gitRepoSources) = it
                val uniqueGitRepoBranches = gitRepoSources.map { s -> s.getString("branch") }.distinct()
                buildType(GwBuildTypes.createListenerBuildType(gitRepoId,
                    uniqueGitRepoBranches,
                    Docs.rootProject.id.toString(),
                    GwTemplates.BuildListenerTemplate))
            }
        }
    }
}

object Sources {
    val rootProject = createRootProjectForSources()

    private fun createRootProjectForSources(): Project {
        val mainProject = Project {
            name = "Sources"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            template(GwTemplates.ValidationListenerTemplate)
        }

        for (gitRepo in Helpers.gitNativeRepos) {
            val gitRepoId = gitRepo.getString("id")
            val gitRepoUrl = gitRepo.getString("gitUrl")
            val gitRepoSourcesList = (gitRepo as JSONObject).getJSONArray("sources")
            for (src in gitRepoSourcesList) {
                val srcId = (src as JSONObject).getString("srcId")
                val ditaBuildsRelatedToSrc =
                    Helpers.buildConfigs.filter { it.getString("srcId") == srcId && it.getString("buildType") == "dita" }
                if (ditaBuildsRelatedToSrc.isNotEmpty()) {
                    val gitBranch = src.getString("branch")
                    val sourceValidationProject = createSourceValidationProject(srcId, gitRepoId, gitRepoUrl, gitBranch)
                    val validationBuildsProject =
                        createValidationBuildsProject(srcId, gitRepoId, gitBranch, ditaBuildsRelatedToSrc)
                    sourceValidationProject.subProject(validationBuildsProject)
                    mainProject.subProject(sourceValidationProject)
                }
            }
        }
        return mainProject
    }

    private fun createSourceValidationProject(
        src_id: String,
        git_repo_id: String,
        git_url: String,
        git_branch: String,
    ): Project {
        return Project {
            name = src_id
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            buildType(createCleanValidationResultsBuildType(src_id, git_repo_id, git_branch, git_url))
            val validationListenerBuildType = GwBuildTypes.createListenerBuildType(
                git_repo_id,
                listOf(git_branch),
                "Sources", // FIXME: Figure out how to get this name from the root project
                GwTemplates.ValidationListenerTemplate,
                git_branch
            )
            validationListenerBuildType.triggers.vcs {
                branchFilter = """
                    +:*
                    -:<default>
                    -:${Helpers.createFullGitBranchName(git_branch)}
                """.trimIndent()
            }

            validationListenerBuildType.features {
                feature(GwBuildFeatures.createGwCommitStatusPublisherBuildFeature(
                    Helpers.resolveRelativeIdFromIdString(git_repo_id).toString())
                )
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(
                    Helpers.resolveRelativeIdFromIdString(git_repo_id).toString(),
                    git_branch
                ))
            }
            buildType(validationListenerBuildType)
        }
    }

    private fun createValidationBuildsProject(
        src_id: String,
        git_repo_id: String,
        git_branch: String,
        dita_build_configs: List<JSONObject>,
    ): Project {

        return Project {
            name = "Validation builds"
            id = Helpers.resolveRelativeIdFromIdString("${src_id}${this.name}")

            dita_build_configs.map {
                buildType(createValidationBuildType(
                    src_id, git_repo_id, git_branch, it))
            }
        }
    }

    private fun createValidationBuildType(
        src_id: String,
        git_repo_id: String,
        git_branch: String,
        build_config: JSONObject,
    ): BuildType {
        val ditaOtLogsDir = "dita_ot_logs"
        val normalizedDitaDir = "normalized_dita_dir"
        val schematronReportsDir = "schematron_reports_dir"
        val docInfoFile = "doc-info.json"

        val docId = build_config.getString("docId")
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val workingDir = when (build_config.has("workingDir")) {
            false -> {
                "%teamcity.build.checkoutDir%"
            }
            true -> {
                "%teamcity.build.checkoutDir%/${build_config.getString("workingDir")}"
            }
        }
        val rootMap = build_config.getString("root")
        val indexRedirect = when (build_config.has("indexRedirect")) {
            true -> {
                build_config.getBoolean("indexRedirect")
            }
            else -> {
                false
            }

        }
        val buildFilter = when (build_config.has("filter")) {
            true -> {
                build_config.getString("filter")
            }
            else -> {
                ""
            }
        }

        val validationBuildType = BuildType {
            name = "Validate $docTitle ($docId)"
            id = Helpers.resolveRelativeIdFromIdString("${src_id}${this.name}")
            templates(GwTemplates.ValidationListenerTemplate)

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(git_repo_id))
                branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch,
                    Helpers.createFullGitBranchName("*/from", prefix = "refs/pull-requests/")))
                cleanCheckout = true
            }

            steps.step(GwBuildSteps.createGetDocumentDetailsStep(
                git_branch,
                src_id,
                docInfoFile,
                org.json.JSONObject()))
            steps.step(GwBuildSteps.createBuildDitaProjectForValidationsStep(
                "webhelp",
                rootMap,
                workingDir,
                ditaOtLogsDir,
                normalizedDitaDir,
                schematronReportsDir,
                buildFilter,
                indexRedirect))
            steps.step(GwBuildSteps.createUploadContentPreviewToS3BucketStep(docInfoFile,
                "${workingDir}/out/webhelp"))
            steps.step(GwBuildSteps.createBuildDitaProjectForValidationsStep(
                "dita",
                rootMap,
                workingDir,
                ditaOtLogsDir,
                normalizedDitaDir,
                schematronReportsDir
            ))
            steps.step(GwBuildSteps.createBuildDitaProjectForValidationsStep(
                "validate",
                rootMap,
                workingDir,
                ditaOtLogsDir,
                normalizedDitaDir,
                schematronReportsDir
            ))
            steps.step(GwBuildSteps.createRunDocValidatorStep(
                workingDir,
                ditaOtLogsDir,
                normalizedDitaDir,
                schematronReportsDir,
                docInfoFile
            ))
        }

        return validationBuildType
    }

    private fun createCleanValidationResultsBuildType(
        src_id: String,
        git_repo_id: String,
        git_branch: String,
        git_url: String,
    ): BuildType {
        return BuildType {
            name = "Clean validation results for $src_id"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(git_repo_id))
                branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch))
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Run the results cleaner"
                    id = "RUN_RESULTS_CLEANER"
                    executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        results_cleaner --elasticsearch-urls "https://docsearch-doctools.int.ccs.guidewire.net"  --git-source-id "$src_id" --git-source-url "$git_url" --s3-bucket-name "tenant-doctools-int-builds"
                    """.trimIndent()
                    dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-validator:latest"
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
// FIXME: Reenable this line when the refactoring is done
//            triggers.vcs { branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch)) }

        }
    }

}

object Recommendations {
    val rootProject = createRootProjectForRecommendations()

    private fun createRootProjectForRecommendations(): Project {
        val mainProject = Project {
            name = "Recommendations"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
        }
        val envsWithRecommendations = arrayListOf("int")

        for (env in envsWithRecommendations) {
            val recommendationProject = createRecommendationProject(env)
            mainProject.subProject(recommendationProject)
        }

        return mainProject
    }

    private fun createRecommendationProject(deploy_env: String): Project {
        val recommendationProjectBuildTypes = mutableListOf<BuildType>()
        val allPlatformProductVersionCombinations = generatePlatformProductVersionCombinationsForAllDocs(deploy_env)
        for (combination in allPlatformProductVersionCombinations) {
            val (platform, product, version) = combination
            val recommendationsForTopicsBuildTypeInt = GwBuildTypes.createRecommendationsForTopicsBuildType("int",
                platform,
                product,
                version,
                "GoogleNews-vectors-negative300.bin")
            recommendationProjectBuildTypes.add(recommendationsForTopicsBuildTypeInt)
        }
        return Project {
            name = "Recommendations for $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            recommendationProjectBuildTypes.forEach {
                buildType(it)
            }
        }
    }

    private fun generatePlatformProductVersionCombinationsForAllDocs(deploy_env: String): List<Triple<String, String, String>> {
        val result = mutableListOf<Triple<String, String, String>>()
        for (docConfig in Helpers.docConfigs) {
            val docEnvironmentsLowercaseList =
                Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
            if (docEnvironmentsLowercaseList.contains(deploy_env)) {
                val docMetadata = docConfig.getJSONObject("metadata")
                val docPlatforms = Helpers.convertJsonArrayWithStringsToList(docMetadata.getJSONArray("platform"))
                val docProducts = Helpers.convertJsonArrayWithStringsToList(docMetadata.getJSONArray("product"))
                val docVersions = Helpers.convertJsonArrayWithStringsToList(docMetadata.getJSONArray("version"))
                result += Helpers.generatePlatformProductVersionCombinations(docPlatforms, docProducts, docVersions)
            }
        }
        return result.distinct()
    }
}

object Helpers {
    fun convertJsonArrayWithStringsToList(json_array: JSONArray): List<String> {
        if (json_array.all { it is String }) {
            return json_array.joinToString(",").split(",")
        }
        throw Error("Cannot convert JSON Array to list. Not all array elements are of the String type.")
    }

    private fun convertListToLowercase(list_to_convert: List<String>): List<String> {
        return list_to_convert.map { it.lowercase(Locale.getDefault()) }
    }

    fun convertJsonArrayWithStringsToLowercaseList(json_array: JSONArray): List<String> {
        return convertListToLowercase(convertJsonArrayWithStringsToList(json_array))
    }

    fun generatePlatformProductVersionCombinations(
        gw_platforms: List<String>, gw_products: List<String>, gw_versions: List<String>,
    ): List<Triple<String, String, String>> {
        val result = mutableListOf<Triple<String, String, String>>()
        gw_platforms.forEach { a ->
            gw_products.forEach { b ->
                gw_versions.forEach { c ->
                    result.add(Triple(a, b, c))
                }
            }
        }
        return result
    }

    private fun getObjectsFromAllConfigFiles(src_dir: String, object_name: String): List<JSONObject> {
        val allConfigObjects = mutableListOf<JSONObject>()
        val jsonFiles = File(src_dir).walk().filter { File(it.toString()).extension == "json" }
        for (file in jsonFiles) {
            val configFileData = JSONObject(File(file.toString()).readText(Charsets.UTF_8))
            val configObjects = configFileData.getJSONArray(object_name)
            configObjects.forEach { allConfigObjects.add(it as JSONObject) }
        }
        return allConfigObjects
    }

    fun groupBuildSourceConfigsByGitUrl(): List<JSONObject> {
        val srcIds = buildConfigs.map { it.getString("srcId") }.distinct()
        val groupedSources = mutableListOf<JSONObject>()
        for (srcId in srcIds) {
            val srcConfig = getObjectById(sourceConfigs, "id", srcId)
            val gitUrl = srcConfig.getString("gitUrl")
            val id = createIdStringFromGitUrl(gitUrl)
            val gitBranch = srcConfig.getString("branch")
            val isExported = srcConfig.has("xdocsPathIds")

            val existingGroupedSource = groupedSources.find { it.getString("gitUrl") == gitUrl }
            if (existingGroupedSource == null) {
                groupedSources.add(JSONObject("""
                            {
                            "id": "$id",
                            "gitUrl": "$gitUrl",
                            "sources": [
                                    {
                                    "srcId": "$srcId",
                                    "branch": "$gitBranch",
                                    "isExported": "$isExported"
                                    }
                                ]
                            }
                        """.trimIndent()))
            } else {
                val existingGroupedSourceHasSrcId =
                    existingGroupedSource.getJSONArray("sources").any { (it as JSONObject).getString("srcId") == srcId }
                if (!existingGroupedSourceHasSrcId) {
                    existingGroupedSource.getJSONArray("sources").put(JSONObject("""
                                {
                                "srcId": "$srcId",
                                "branch": "$gitBranch",
                                "isExported": "$isExported"
                                }
                            """.trimIndent()))
                }
            }
        }
        return groupedSources
    }

    val docConfigs = getObjectsFromAllConfigFiles("config/docs", "docs")
    val sourceConfigs = getObjectsFromAllConfigFiles("config/sources", "sources")
    val buildConfigs = getObjectsFromAllConfigFiles("config/builds", "builds")
    val gitNativeRepos = groupBuildSourceConfigsByGitUrl().map {
        val filteredSources = it.getJSONArray("sources").filter { s ->
            !(s as JSONObject).getBoolean("isExported")
        }
        it.put("sources", filteredSources)
    }.filter { r -> !r.getJSONArray("sources").isEmpty }

    fun getObjectById(objectList: List<JSONObject>, id_name: String, id_value: String): JSONObject {
        return objectList.find { it.getString(id_name) == id_value } ?: JSONObject()
    }

    fun getGitRepoAndSrcBySrcId(src_id: String): Pair<JSONObject, JSONObject> {
        val gitRepoConfig = groupBuildSourceConfigsByGitUrl().find {
            it.getJSONArray("sources").any { s -> (s as JSONObject).getString("srcId") == src_id }
        }
        return if (gitRepoConfig == null) {
            Pair(JSONObject(), JSONObject())
        } else {
            val src =
                gitRepoConfig.getJSONArray("sources")
                    .find { (it as JSONObject).getString("srcId") == src_id } as JSONObject
            Pair(gitRepoConfig, src)
        }
    }

    private fun removeSpecialCharacters(string_to_clean: String): String {
        val re = Regex("[^A-Za-z0-9]")
        return re.replace(string_to_clean, "")
    }

    fun resolveRelativeIdFromIdString(id: String): RelativeId {
        return RelativeId(removeSpecialCharacters(id))
    }

    private fun createIdStringFromGitUrl(git_url: String): String {
        return removeSpecialCharacters(git_url.substringAfterLast("/"))
    }

    fun createFullGitBranchName(branch_name: String, prefix: String = "refs/heads/"): String {
        return if (branch_name.startsWith(prefix)) {
            branch_name
        } else {
            "${prefix}${branch_name}"
        }
    }


}

object GwBuildSteps {
    fun createCrawlDocStep(deploy_env: String, doc_id: String, config_file: String): ScriptBuildStep {
        val docS3Url: String = when (deploy_env) {
            "prod" -> {
                "https://ditaot.internal.us-east-2.service.guidewire.net"
            }
            "portal2" -> {
                "https://portal2.internal.us-east-2.service.guidewire.net"
            }
            else -> {
                "https://ditaot.internal.${deploy_env}.ccs.guidewire.net"
            }
        }
        val elasticsearchUrls: String
        val appBaseUrl: String
        if (arrayListOf("prod", "portal2").contains(deploy_env)) {
            elasticsearchUrls = "https://docsearch-doctools.internal.us-east-2.service.guidewire.net"
            appBaseUrl = "https://docs.guidewire.com"
        } else {
            elasticsearchUrls = "https://docsearch-doctools.${deploy_env}.ccs.guidewire.net"
            appBaseUrl = "https://docs.${deploy_env}.ccs.guidewire.net"
        }


        return ScriptBuildStep {
            name = "Crawl the document and update the index"
            id = "CRAWL_DOCUMENT_UPDATE_INDEX"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export INDEX_NAME="gw-docs"
                export CONFIG_FILE="$config_file"
                export DOC_ID="$doc_id"
                export DOC_S3_URL="$docS3Url"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                export APP_BASE_URL="$appBaseUrl"
                
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

    fun createGetConfigFileStep(deploy_env: String, config_file: String): ScriptBuildStep {

        val configFileUrl = if (arrayListOf("prod", "portal2").contains(deploy_env)) {
            "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json"
        } else {
            "https://ditaot.internal.${deploy_env}.ccs.guidewire.net/portal-config/config.json"
        }

        return ScriptBuildStep {
            name = "Get config file"
            id = "GET_CONFIG_FILE"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="$config_file"
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                export CONFIG_FILE_URL="$configFileUrl"
                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                
                if [[ "$deploy_env" == "prod" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > ${'$'}CONFIG_FILE                 
                elif [[ "$deploy_env" == "portal2" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc"))]}' > ${'$'}CONFIG_FILE
                else
                    cat ${'$'}TMP_CONFIG_FILE > ${'$'}CONFIG_FILE
                fi
            """.trimIndent()
        }
    }

    fun createGetDocumentDetailsStep(
        build_branch: String,
        src_id: String,
        doc_info_file: String,
        doc_config: JSONObject,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Get document details"
            id = "GET_DOCUMENT_DETAILS"

            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    
                    cat << EOF | jq '. += {"gitBuildBranch": "$build_branch", "gitSourceId": "$src_id"}' > "$doc_info_file" | jq .
                    $doc_config
                    EOF
                 
                    cat $doc_info_file
                """.trimIndent()
        }
    }

    fun createCopyFromStagingToProdStep(publish_path: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Copy from S3 on staging to S3 on Prod"
            id = "COPY_FROM_STAGING_TO_PROD"
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Copying from staging to Teamcity"
                    aws s3 sync s3://tenant-doctools-staging-builds/${publish_path} ${publish_path}/ --delete
                    
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    
                    echo "Uploading from Teamcity to prod"
                    aws s3 sync ${publish_path}/ s3://tenant-doctools-prod-builds/${publish_path} --delete
                """.trimIndent()
        }
    }

    fun createZipPackageStep(
        input_path: String, target_path: String,
    ): ScriptBuildStep {

        val zipPackageName = "docs.zip"

        return ScriptBuildStep {
            name = "Build a ZIP package"
            id = "BUILD_ZIP_PACKAGE"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Creating a ZIP package"
                cd "$input_path" || exit
                zip -r "${target_path}/${zipPackageName}" * &&
                rm -rf "$input_path"
            """.trimIndent()
        }
    }

    fun createUploadContentToS3BucketStep(
        deploy_env: String, publish_path: String, working_dir: String,
    ): ScriptBuildStep {
        val s3BucketName = "tenant-doctools-${deploy_env}-builds"
        return ScriptBuildStep {
            name = "Upload content to the S3 bucket"
            id = "UPLOAD_CONTENT_TO_S3_BUCKET"
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    if [[ -d "${working_dir}/out" ]]; then
                        export OUTPUT_PATH="out"
                    elif [[ -d "${working_dir}/dist" ]]; then
                        export OUTPUT_PATH="dist"
                    elif [[ -d "${working_dir}/build" ]]; then
                        export OUTPUT_PATH="build"
                    fi
                    
                    echo "Output path set to ${'$'}OUTPUT_PATH"

                    aws s3 sync ${working_dir}/${'$'}OUTPUT_PATH s3://${s3BucketName}/${publish_path} --delete
                """.trimIndent()
        }
    }

    fun createUploadContentPreviewToS3BucketStep(
        doc_info_file: String, src_dir: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Upload the content preview output to S3"
            id = "UPLOAD_CONTENT_PREVIEW_TO_S3"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export GIT_SOURCE_ID=${'$'}(jq -r .gitSourceId "$doc_info_file")
                export GIT_BUILD_BRANCH=${'$'}(jq -r .gitBuildBranch "$doc_info_file")
                export DOC_ID=${'$'}(jq -r .id "$doc_info_file"
                
                aws s3 sync "$src_dir" "s3://tenant-doctools-int-builds/preview/${'$'}GIT_SOURCE_ID/${'$'}GIT_BUILD_BRANCH/${'$'}DOC_ID" --delete
                echo "Output preview available at https://docs.int.ccs.guidewire.net/preview/${'$'}GIT_SOURCE_ID/${'$'}GIT_BUILD_BRANCH/${'$'}DOC_ID" > preview_url.txt
            """.trimIndent()
        }
    }

    fun createCopyResourcesStep(
        step_id: Int,
        working_dir: String,
        output_dir: String,
        resource_src_dir: String,
        resource_target_dir: String,
        resource_src_url: String,
        resource_src_branch: String,
    ): ScriptBuildStep {
        val resourcesRootDir = "resource$step_id"
        val fullTargetPath = "${working_dir}/${output_dir}/${resource_target_dir}"
        return ScriptBuildStep {
            name = "Copy resources from git to the doc output dir ($step_id)"
            id = "COPY_RESOURCES_FROM_GIT_TO_DOC_OUTPUT_DIR_${step_id}"
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                git clone --single-branch --branch $resource_src_branch $resource_src_url $resourcesRootDir
                        
                echo "Copying files to the doc output dir"
                mkdir -p $fullTargetPath
                cp -R ./${resourcesRootDir}/${resource_src_dir}/* $fullTargetPath
            """.trimIndent()
        }
    }

    fun createBuildDitaProjectForValidationsStep(
        output_format: String,
        root_map: String,
        working_dir: String,
        dita_ot_logs_dir: String,
        normalized_dita_dir: String,
        schematron_reports_dir: String,
        build_filter: String = "",
        index_redirect: Boolean = false,
    ): ScriptBuildStep {
        val logFile = "${output_format}_build.log"
        val outputDir = "out/${output_format}"
        var ditaBuildCommand =
            "dita -i \"${working_dir}/${root_map}\" -o \"${working_dir}/${outputDir}\" -l \"${working_dir}/${logFile}\""
        var resourcesCopyCommand = ""

        if (build_filter.isNotEmpty()) {
            ditaBuildCommand += " --filter \"${working_dir}/${build_filter}\""
        }

        when (output_format) {
            "webhelp" -> {
                ditaBuildCommand += " -f webhelp_Guidewire"
                if (index_redirect) {
                    ditaBuildCommand += " --create-index-redirect yes --webhelp.publication.toc.links all"
                }
            }
            "dita" -> {
                ditaBuildCommand += " -f gw_dita"
                resourcesCopyCommand =
                    "&& mkdir -p \"${working_dir}/${normalized_dita_dir}\" && cp -R \"${working_dir}/${outputDir}/*\" \"${working_dir}/${normalized_dita_dir}/\""
            }
            "validate" -> {
                val tempDir = "tmp/validate"
                ditaBuildCommand += " -f validate --clean.temp no --temp \"${working_dir}/${tempDir}\""
                resourcesCopyCommand =
                    "&& mkdir -p \"${working_dir}/${schematron_reports_dir}\" && cp \"${working_dir}/${tempDir}/validation-report.xml\" \"${working_dir}/${schematron_reports_dir}/\""
            }
        }

        return ScriptBuildStep {
            name = "Build the ${output_format.replace("_", "")} output"
            id = this.name.uppercase(Locale.getDefault()).replace(" ", "_")
            scriptContent = """
                #!/bin/bash
                set -xe
                                
                SECONDS=0

                echo "Building output"
                $ditaBuildCommand $resourcesCopyCommand || EXIT_CODE=${'$'}?
                cp "${working_dir}/${logFile}" ${working_dir}/${dita_ot_logs_dir}/ || EXIT_CODE=${'$'}?
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createBuildDitaProjectForBuildsStep(
        output_format: String,
        root_map: String,
        index_redirect: Boolean,
        working_dir: String,
        output_dir: String,
        build_filter: String = "",
        doc_id: String = "",
        gw_products: String = "",
        gw_platforms: String = "",
        gw_versions: String = "",
        git_url: String = "",
        git_branch: String = "",
        for_offline_use: Boolean = false,
    ): ScriptBuildStep {
        var ditaBuildCommand = if (for_offline_use) {
            "dita -i \"${working_dir}/${root_map}\" -o \"${working_dir}/${output_dir}\" --use-doc-portal-params no"
        } else {
            "dita -i \"${working_dir}/${root_map}\" -o \"${working_dir}/${output_dir}\" --use-doc-portal-params yes --gw-doc-id \"${doc_id}\" --gw-product \"$gw_products\" --gw-platform \"$gw_platforms\" --gw-version \"$gw_versions\" --generate.build.data yes"
        }

        ditaBuildCommand += " --git.url \"$git_url\" --git.branch \"$git_branch\""

        if (build_filter.isNotEmpty()) {
            ditaBuildCommand += " --filter \"${working_dir}/${build_filter}\""
        }

        when (output_format) {
            "webhelp" -> {
                ditaBuildCommand += if (for_offline_use) " -f webhelp_Guidewire" else " -f webhelp_Guidewire_validate"
            }
            "webhelp_with_pdf" -> {
                ditaBuildCommand += " -f wh-pdf --dita.ot.pdf.format pdf5_Guidewire\""
            }
            "pdf" -> {
                ditaBuildCommand += " -f pdf_Guidewire_remote"
            }
        }


        if (output_format.contains("webhelp") && index_redirect) {
            ditaBuildCommand += " --create-index-redirect yes --webhelp.publication.toc.links all"
        }

        return ScriptBuildStep {
            name = "Build the ${output_format.replace("_", "")} output"
            id = this.name.uppercase(Locale.getDefault()).replace(" ", "_")
            scriptContent = """
                #!/bin/bash
                set -xe
                                
                SECONDS=0

                echo "Building output"
                $ditaBuildCommand
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createBuildYarnProjectStep(
        deploy_env: String,
        publish_path: String,
        build_command: String?,
        node_image_version: String?,
        doc_id: String,
        gw_products: String,
        gw_platforms: String,
        gw_versions: String,
        working_dir: String,
    ): ScriptBuildStep {
        val nodeImageVersion = node_image_version ?: "12.14.1"
        val buildCommand = build_command ?: "build"
        val targetUrl =
            if (deploy_env == "prod") "https://docs.guidewire.com" else "https://docs.${deploy_env}.ccs.guidewire.net"

        return ScriptBuildStep {
            name = "Build the yarn project"
            id = "BUILD_YARN_PROJECT"
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export DEPLOY_ENV="$deploy_env"
                    export GW_DOC_ID="$doc_id"
                    export GW_PRODUCT="$gw_products"
                    export GW_PLATFORM="$gw_platforms"
                    export GW_VERSION="$gw_versions"
                    export TARGET_URL="$targetUrl"
                    
                    # legacy Jutro repos
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-npm-dev -s @jutro
                    npm config set @jutro:registry https://artifactory.guidewire.com/api/npm/jutro-npm-dev/
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/globalization-npm-release -s @gwre-g11n
                    npm config set @gwre-g11n:registry https://artifactory.guidewire.com/api/npm/globalization-npm-release/
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/elixir -s @elixir
                    npm config set @elixir:registry https://artifactory.guidewire.com/api/npm/elixir/
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev -s @gtui
                    npm config set @gtui:registry https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev/
                                        
                    # new Jutro proxy repo
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
                    npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/

                    # Doctools repo
                    npm-cli-login -u "${'$'}{ARTIFACTORY_USERNAME}" -p "${'$'}{ARTIFACTORY_PASSWORD}" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://artifactory.guidewire.com/api/npm/doctools-npm-dev/
                                        
                    export BASE_URL=/${publish_path}/
                    cd "$working_dir"
                    yarn
                    yarn $buildCommand
                """.trimIndent()
            dockerImage = "artifactory.guidewire.com/devex-docker-dev/node:${nodeImageVersion}"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "--user 1000:1000"
        }
    }

    fun createRunBuildManagerStep(
        teamcity_affected_project: String,
        teamcity_template: String,
        vcs_root_id: String,
        git_branch: String = "",
    ): ScriptBuildStep {
        val teamcityBuildBranch = "%teamcity.build.vcs.branch.${vcs_root_id}%"
        val gitBranch = git_branch.ifEmpty { teamcityBuildBranch }
        return ScriptBuildStep {
            name = "Run the build manager"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CHANGED_FILES_FILE="%system.teamcity.build.changedFiles.file%"
                export TEAMCITY_API_ROOT_URL="https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/" 
                export TEAMCITY_API_AUTH_TOKEN="credentialsJSON:202f4911-8170-40c3-bdc9-3d28603a1530"
                export TEAMCITY_RESOURCES_ARTIFACT_PATH="json/build-data.json"
                export TEAMCITY_AFFECTED_PROJECT="$teamcity_affected_project"
                export TEAMCITY_TEMPLATE="$teamcity_template"
                export GIT_URL="%vcsroot.${vcs_root_id}.url%"
                export GIT_BRANCH="$gitBranch"
                export TEAMCITY_BUILD_BRANCH="$teamcityBuildBranch"
                                                        
                build_manager
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/build-manager:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunDocValidatorStep(
        working_dir: String,
        dita_ot_logs_dir: String,
        normalized_dita_dir: String,
        schematron_reports_dir: String,
        doc_info_file: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the doc validator"
            id = "RUN_DOC_VALIDATOR"
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export ELASTICSEARCH_URLS="https://docsearch-doctools.int.ccs.guidewire.net"
                
                doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "${working_dir}/${doc_info_file}" validators "${working_dir}/${normalized_dita_dir}" dita \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$doc_info_file" validators "${working_dir}/${normalized_dita_dir}" images \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$doc_info_file" validators "${working_dir}/${normalized_dita_dir}" files \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$doc_info_file" extractors "${working_dir}/${dita_ot_logs_dir}" dita-ot-logs \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$doc_info_file" extractors "${working_dir}/${schematron_reports_dir}" schematron-reports
            """.trimIndent()
            dockerImage = "artifactory.guidewire.com/doctools-docker-dev/doc-validator:latest"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
}

object GwProjectFeatures {
    object GwOxygenWebhelpLicenseProjectFeature : ProjectFeature({
        type = "JetBrains.SharedResources"
        id = "OXYGEN_WEBHELP_LICENSE"
        param("quota", "3")
        param("name", "OxygenWebhelpLicense")
        param("type", "quoted")
    })
}

object GwBuildFeatures {
    object GwDockerSupportBuildFeature : DockerSupportFeature({
        id = "DockerSupport"
        loginToRegistry = on {
            dockerRegistryId = "PROJECT_EXT_155"
        }
    })

    object GwSshAgentBuildFeature : SshAgent({
        teamcitySshKey = "sys-doc.rsa"
    })

    object GwOxygenWebhelpLicenseBuildFeature : BuildFeature({
        id = "OXYGEN_WEBHELP_LICENSE_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "OxygenWebhelpLicense readLock")
    })

    fun createGwCommitStatusPublisherBuildFeature(vcs_root_it: String): CommitStatusPublisher {
        return CommitStatusPublisher {
            vcsRootExtId = vcs_root_it
            publisher = bitbucketServer {
                url = "https://stash.guidewire.com"
                userName = "%serviceAccountUsername%"
                password =
                    "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
            }
        }
    }

    fun createGwPullRequestsBuildFeature(vcs_root_id: String, target_git_branch: String): PullRequests {
        return PullRequests {
            vcsRootExtId = vcs_root_id
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = password {
                    username = "%serviceAccountUsername%"
                    password =
                        "credentialsJSON:b7b14424-8c90-42fa-9cb0-f957d89453ab"
                }
                filterTargetBranch = target_git_branch
            }
        }
    }
}

object GwBuildTriggers {

    fun createVcsTriggerForExportedVcsRoot(vcs_root_id: String): VcsTrigger {
        return VcsTrigger {
            triggerRules = """
                +:root=${vcs_root_id};comment=\[$vcs_root_id\]:**
                """.trimIndent()
        }
    }

    fun createVcsTriggerForNonDitaBuilds(vcs_root_id: String): VcsTrigger {
        return VcsTrigger {
            triggerRules = """
                +:root=${vcs_root_id}:**
                """.trimIndent()
        }
    }
}

object GwBuildTypes {

    object ExportFilesFromXDocsToBitbucketBuildType : BuildType({
        name = "Export files from XDocs to Bitbucket"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        maxRunningBuilds = 2

        params {
            text("EXPORT_PATH_IDS",
                "",
                description = "A list of space-separated path IDs from XDocs",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true)
            text("GIT_URL",
                "",
                description = "The URL of the Bitbucket repository where the files exported from XDocs are added",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true)
            text("GIT_BRANCH",
                "",
                description = "The branch of the Bitbucket repository where the files exported from XDocs are added",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true)
            text("XDOCS_EXPORT_DIR",
                "%system.teamcity.build.tempDir%/xdocs_export_dir",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false)
            text("SRC_ID",
                "",
                description = "The ID of the source",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false)
            text("EXPORT_SERVER",
                "",
                description = "The export server",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false)
        }

        vcs {
            root(GwVcsRoots.xdocsClientGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                name = "Export files from XDocs"
                workingDir = "LocalClient/sample/local/bin"
                scriptContent = """
                            #!/bin/bash
                            sed -i "s/ORP-XDOCS-WDB03/%EXPORT_SERVER%/" ../../../conf/LocClientConfig.xml
                            chmod 777 runExport.sh
                            for path in %EXPORT_PATH_IDS%; do ./runExport.sh "${'$'}path" %XDOCS_EXPORT_DIR%; done
                        """.trimIndent()
            }
            script {
                name = "Add exported files to Bitbucket"
                scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        export GIT_CLONE_DIR="git_clone_dir"
                        
                        git clone --single-branch --branch %GIT_BRANCH% %GIT_URL% ${'$'}GIT_CLONE_DIR
                        cp -R %XDOCS_EXPORT_DIR%/* ${'$'}GIT_CLONE_DIR/
                        
                        cd ${'$'}GIT_CLONE_DIR
                        git config --local user.email "doctools@guidewire.com"
                        git config --local user.name "%serviceAccountUsername%"
                        
                        git add -A
                        if git status | grep "Changes to be committed"
                        then
                          git commit -m "[TeamCity][%SRC_ID%] Add files exported from XDocs"
                          git pull
                          git push
                        else
                          echo "No changes to commit"
                        fi                
                    """.trimIndent()
            }
        }

        features.feature(GwBuildFeatures.GwSshAgentBuildFeature)

    })

    object CleanUpIndexBuildType : BuildType({
        name = "Clean up index"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        params {
            select("env.DEPLOY_ENV",
                "",
                label = "Deployment environment",
                description = "Select an environment on which you want clean up the index",
                display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod"))
            text("env.CONFIG_FILE_URL",
                "https://ditaot.internal.%env.DEPLOY_ENV%.ccs.guidewire.net/portal-config/config.json",
                allowEmpty = false)
            text("env.CONFIG_FILE_URL_PROD",
                "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json",
                allowEmpty = false)
            text("env.ELASTICSEARCH_URLS",
                "https://docsearch-doctools.%env.DEPLOY_ENV%.ccs.guidewire.net",
                allowEmpty = false)
            text("env.ELASTICSEARCH_URLS_PROD",
                "https://docsearch-doctools.internal.us-east-2.service.guidewire.net",
                allowEmpty = false)

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

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

    object UpdateSearchIndexBuildType : BuildType({
        name = "Update search index"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        params {
            select("DEPLOY_ENV",
                "",
                label = "Deployment environment",
                description = "The environment on which you want reindex documents",
                display = ParameterDisplay.PROMPT,
                options = listOf("dev", "int", "staging", "prod", "portal2"))
            text("DOC_ID",
                "",
                label = "Doc ID",
                description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true)
        }

        val configFile = "%teamcity.build.workingDir%/config.json"
        val configFileStep = GwBuildSteps.createGetConfigFileStep("%DEPLOY_ENV%", configFile)
        steps.step(configFileStep)
        steps.stepsOrder.add(configFileStep.id.toString())
        val crawlDocStep = GwBuildSteps.createCrawlDocStep("%DEPLOY_ENV%", "%DOC_ID%", configFile)
        steps.step(crawlDocStep)
        steps.stepsOrder.add(crawlDocStep.id.toString())

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

    object UploadPdfsForEscrowBuildType : BuildType({
        name = "Upload PDFs for Escrow"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        params {
            text("env.RELEASE_NAME",
                "",
                label = "Release name",
                description = "For example, Banff or Cortina",
                display = ParameterDisplay.PROMPT)
            text("env.RELEASE_NUMBER",
                "",
                label = "Release number",
                description = "Numeric representation of the release without dots or hyphens. For example, 202011 or 202104",
                display = ParameterDisplay.PROMPT)
        }

        vcs {
            root(DslContext.settingsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                id = "DOWNLOAD_AND_ZIP_PDFS"
                name = "Download and zip PDF files"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export TMP_DIR="%teamcity.build.checkoutDir%/ci/pdfs"
                    export ZIP_ARCHIVE_NAME="%env.RELEASE_NAME%_pdfs.zip"
                    
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_PROD_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_PROD_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_PROD_AWS_DEFAULT_REGION"
                    
                    cd %teamcity.build.checkoutDir%/ci
                    ./downloadPdfsForEscrow.sh
                """.trimIndent()
            }
            script {
                id = "UPLOAD_ZIP_TO_S3"
                name = "Upload the ZIP archive to S3"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Setting credentials to access int"
                    export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                    export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                    export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"                    
                    
                    echo "Uploading the ZIP archive to the S3 bucket"
                    aws s3 cp "%env.TMP_DIR%/%env.ZIP_ARCHIVE_NAME%" s3://tenant-doctools-int-builds/escrow/%env.RELEASE_NAME%/
            """.trimIndent()
            }
        }
    })

    //TODO: Create two separate functions for creating build listener and validation listener
    fun createListenerBuildType(
        git_repo_id: String,
        git_branches: List<String>,
        teamcity_affected_project_id: String,
        teamcity_template: Template,
        build_manager_git_branch: String = "",
    ): BuildType {
        return BuildType {
            name = "$git_repo_id ${teamcity_template.name.lowercase(Locale.getDefault())}"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${git_branches[0]}")

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(git_repo_id))
                branchFilter = GwVcsSettings.createBranchFilter(git_branches)
                cleanCheckout = true
            }
            steps.step(GwBuildSteps.createRunBuildManagerStep(teamcity_affected_project_id,
                teamcity_template.id.toString(),
                Helpers.resolveRelativeIdFromIdString(git_repo_id).toString(),
                build_manager_git_branch)
            )
// FIXME: Reenable this line when the refactoring is done
//            triggers.vcs { }
        }
    }

    fun createRecommendationsForTopicsBuildType(
        deploy_env: String,
        gw_platform: String,
        gw_product: String,
        gw_version: String,
        pretrained_model_file: String,
    ): BuildType {
        return BuildType {
            name = "Generate recommendations for $gw_product, $gw_platform, $gw_version"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                script {
                    name = "Download the pretrained model"
                    scriptContent = """
                            #!/bin/bash
                            set -xe
                            
                            echo "Setting credentials to access int"
                            export AWS_ACCESS_KEY_ID="${'$'}ATMOS_DEV_AWS_ACCESS_KEY_ID"
                            export AWS_SECRET_ACCESS_KEY="${'$'}ATMOS_DEV_AWS_SECRET_ACCESS_KEY"
                            export AWS_DEFAULT_REGION="${'$'}ATMOS_DEV_AWS_DEFAULT_REGION"                    
                            
                            echo "Downloading the pretrained model from the S3 bucket"
                            aws s3 cp s3://tenant-doctools-${deploy_env}-builds/recommendation-engine/${pretrained_model_file} %teamcity.build.workingDir%/
                        """.trimIndent()
                }
                script {
                    name = "Run the recommendation engine"
                    scriptContent = """
                            #!/bin/bash
                            set -xe
                            
                            export PLATFORM="$gw_platform"
                            export PRODUCT="$gw_product"
                            export VERSION="$gw_version"
                            export ELASTICSEARCH_URL="https://docsearch-doctools.${deploy_env}.ccs.guidewire.net"
                            export DOCS_INDEX_NAME="gw-docs"
                            export RECOMMENDATIONS_INDEX_NAME="gw-recommendations"
                            export PRETRAINED_MODEL_FILE="$pretrained_model_file"
                                                                    
                            recommendation_engine
                        """.trimIndent()
                    dockerImage = "artifactory.guidewire.com/doctools-docker-dev/recommendation-engine:latest"
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    fun createExportFilesFromXDocsToBitbucketCompositeBuildType(
        src_title: String,
        export_path_ids: String,
        git_url: String,
        git_branch: String,
        src_id: String,
        export_server: String,
        export_frequency: String,
        export_hour: Int,
        export_minute: Int,
    ): BuildType {
        return BuildType {
            name = "Export $src_title from XDocs and add to Bitbucket"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            type = BuildTypeSettings.Type.COMPOSITE

            params {
                text("reverse.dep.${ExportFilesFromXDocsToBitbucketBuildType.id}.EXPORT_PATH_IDS", export_path_ids)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucketBuildType.id}.GIT_URL", git_url)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucketBuildType.id}.GIT_BRANCH", git_branch)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucketBuildType.id}.SRC_ID", src_id)
                text("reverse.dep.${ExportFilesFromXDocsToBitbucketBuildType.id}.EXPORT_SERVER", export_server)
            }

            dependencies {
                snapshot(ExportFilesFromXDocsToBitbucketBuildType) {
                    reuseBuilds = ReuseBuilds.NO
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
            // FIXME: Reenable this line when the refactoring is done
//            when (export_frequency) {
//                "daily" -> {
//                    triggers.schedule {
//                        schedulingPolicy = daily {
//                            hour = export_hour
//                            minute = export_minute
//                        }
//
//                        triggerBuild = always()
//                        withPendingChangesOnly = false
//                    }
//                }
//                "weekly" -> {
//                    triggers.schedule {
//                        schedulingPolicy = weekly {
//                            dayOfWeek = ScheduleTrigger.DAY.Saturday
//                            hour = export_hour
//                            minute = export_minute
//                        }
//                        triggerBuild = always()
//                        withPendingChangesOnly = false
//                    }
//                }
//            }

        }
    }

}

object GwVcsRoots {
    val xdocsClientGitVcsRoot =
        createGitVcsRoot("XDocs Client", "ssh://git@stash.guidewire.com/doctools/xdocs-client.git", listOf("master"))

    private fun createGitVcsRoot(vcs_root_id: String, git_url: String, git_branches: List<String>): GitVcsRoot {
        val defaultBranch = git_branches[0]
        val monitoredBranches =
            if (git_branches.size > 1) git_branches.slice(1..git_branches.lastIndex) else emptyList()
        return GitVcsRoot {
            name = vcs_root_id
            id = Helpers.resolveRelativeIdFromIdString(vcs_root_id)
            url = git_url
            branch = Helpers.createFullGitBranchName(defaultBranch)
            authMethod = uploadedKey {
                uploadedKey = "sys-doc.rsa"
            }
            checkoutPolicy = GitVcsRoot.AgentCheckoutPolicy.USE_MIRRORS

            if (monitoredBranches.isEmpty()) {
                branchSpec = "+:*"
            } else {
                branchSpec = ""
                monitoredBranches.forEach {
                    branchSpec += "+:${Helpers.createFullGitBranchName(it)}\n"
                }
            }
        }
    }

    fun createGitVcsRootsFromConfigFiles(): List<GitVcsRoot> {
        return Helpers.groupBuildSourceConfigsByGitUrl().map {
            val gitUrl = it.getString("gitUrl")
            val id = it.getString("id")
            val gitBranches = it.getJSONArray("sources").map { b -> (b as JSONObject).getString("branch") }
            val mainBranch = gitBranches.find { b -> b.contains("main") }
            val masterBranch = gitBranches.find { b -> b.contains("master") }
            val releaseBranch = gitBranches.find { b -> b.contains("release") }
            val defaultBranch = if (!mainBranch.isNullOrEmpty()) {
                mainBranch
            } else if (!masterBranch.isNullOrEmpty()) {
                masterBranch
            } else if (!releaseBranch.isNullOrEmpty()) {
                releaseBranch
            } else {
                gitBranches[0]
            }
            createGitVcsRoot(id, gitUrl, listOf(defaultBranch))
        }
    }
}

object GwVcsSettings {
    fun createBranchFilter(git_branches: List<String>): String {
        var branchFilter = ""
        if (git_branches.isEmpty()) {
            branchFilter = "+:*"
        } else if (git_branches.size == 1) {
            branchFilter = "+:${Helpers.createFullGitBranchName(git_branches[0])}"
        } else {
            git_branches.forEach {
                branchFilter += "+:${Helpers.createFullGitBranchName(it)}\n"
            }
        }
        return branchFilter
    }
}

object GwTemplates {
    object BuildListenerTemplate : Template({
        name = "Build listener"
        description = "Empty template added to doc builds to make them discoverable by build listener builds"
        id = Helpers.resolveRelativeIdFromIdString(this.name)
    })

    object ValidationListenerTemplate : Template({
        name = "Validation listener"
        description =
            "Empty template added to validation builds to make them discoverable by validation listener builds"
        id = Helpers.resolveRelativeIdFromIdString(this.name)
    })
}


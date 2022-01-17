// TODO: When changes are merged, remove the teamcity access token from mskowron account
// TODO: When changes are merged, clean up AWS and ATMOS envs in the Documentation Tools project
import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.*
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.*

version = "2021.2"

project {

    GwVcsRoots.createGitVcsRootsFromConfigFiles().forEach {
        vcsRoot(it)
    }
    vcsRoot(GwVcsRoots.DocumentationPortalGitVcsRoot)
    subProject(Docs.rootProject)
    subProject(Sources.rootProject)
    subProject(Recommendations.rootProject)
    subProject(Content.rootProject)
    subProject(BuildListeners.rootProject)
    subProject(Exports.rootProject)
    subProject(Apps.rootProject)
    subProject(Server.rootProject)
    subProject(Frontend.rootProject)

    features.feature(GwProjectFeatures.GwOxygenWebhelpLicenseProjectFeature)
}

enum class GwDeployEnvs(val env_name: String) {
    DEV("dev"),
    INT("int"),
    STAGING("staging"),
    PROD("prod"),
    US_EAST_2("us-east-2"),
    PORTAL2("portal2")
}

enum class GwBuildTypes(val build_type_name: String) {
    DITA("dita"),
    YARN("yarn"),
    STORYBOOK("storybook"),
    SOURCE_ZIP("source-zip")
}

enum class GwDitaOutputFormats(val format_name: String) {
    WEBHELP("webhelp"),
    PDF("pdf"),
    WEBHELP_WITH_PDF("webhelp_with_pdf"),
    DITA("dita"),
    VALIDATE("validate")
}

enum class GwConfigParams(val param_value: String) {
    CONFIG_FILES_ROOT_DIR("%teamcity.build.checkoutDir%/.teamcity/config"),
    CONFIG_SCHEMA_FILE_PATH("${CONFIG_FILES_ROOT_DIR.param_value}/config-schema.json"),
    BUILDS_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/builds"),
    DOCS_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/docs"),
    SOURCES_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/sources"),
    MERGED_CONFIG_FILE("merge-all.json"),
    DOCS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/out/docs"),
    BUILDS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/out/builds"),
    SOURCES_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.param_value}/out/sources"),
    DITA_BUILD_OUT_DIR("out"),
    YARN_BUILD_OUT_DIR("build"),
    STORYBOOK_BUILD_OUT_DIR("dist"),
    SOURCE_ZIP_BUILD_OUT_DIR("out"),
    BUILD_DATA_DIR("json"),
    BUILD_DATA_FILE("build-data.json")
}

enum class GwDockerImages(val image_url: String) {
    DOC_PORTAL("artifactory.guidewire.com/doctools-docker-dev/docportal"),
    DITA_OT_LATEST("artifactory.guidewire.com/doctools-docker-dev/dita-ot:latest"),
    ATMOS_DEPLOY_0_12_24("artifactory.guidewire.com/devex-docker-dev/atmosdeploy:0.12.24"),
    CONFIG_DEPLOYER_LATEST("artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest"),
    DOC_CRAWLER_LATEST("artifactory.guidewire.com/doctools-docker-dev/doc-crawler:latest"),
    INDEX_CLEANER_LATEST("artifactory.guidewire.com/doctools-docker-dev/index-cleaner:latest"),
    BUILD_MANAGER_LATEST("artifactory.guidewire.com/doctools-docker-dev/build-manager:latest"),
    RECOMMENDATION_ENGINE_LATEST("artifactory.guidewire.com/doctools-docker-dev/recommendation-engine:latest"),
    FLAIL_SSG_LATEST("artifactory.guidewire.com/doctools-docker-dev/flail-ssg:latest"),
    LION_PKG_BUILDER_LATEST("artifactory.guidewire.com/doctools-docker-dev/lion-pkg-builder:latest"),
    LION_PAGE_BUILDER_LATEST("artifactory.guidewire.com/doctools-docker-dev/lion-page-builder:latest"),
    UPGRADE_DIFFS_PAGE_BUILDER_LATEST("artifactory.guidewire.com/doctools-docker-dev/upgradediffs-page-builder:latest"),
    SITEMAP_GENERATOR_LATEST("artifactory.guidewire.com/doctools-docker-dev/sitemap-generator:latest"),
    DOC_VALIDATOR_LATEST("artifactory.guidewire.com/doctools-docker-dev/doc-validator:latest"),
    PYTHON_3_9_SLIM_BUSTER("artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster"),
    NODE_14_ALPINE("artifactory.guidewire.com/hub-docker-remote/node:14-alpine"),
    GENERIC_14_14_0_YARN_CHROME("artifactory.guidewire.com/jutro-docker-dev/generic:14.14.0-yarn-chrome")
}

object Docs {
    val rootProject = createRootProjectForDocs()

    private fun createRootProjectForDocs(): Project {
        return Project {
            name = "Docs"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            template(GwTemplates.BuildListenerTemplate)

            for (buildConfig in Helpers.buildConfigs) {
                val srcId = buildConfig.getString("srcId")
                val docProject = createDocProject(buildConfig, srcId)
                subProject(docProject)
            }
        }
    }

    private fun createBuildAndPublishDockerImageWithGccContent(src_id: String): BuildType {
        return BuildType {
            name = "Build and publish Docker image with GCC content"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
            params {
                text(
                    "DOC_VERSION",
                    "",
                    label = "Doc version",
                    display = ParameterDisplay.PROMPT,
                    allowEmpty = false
                )
                text("env.GA4_ID", "G-6XJD083TC6", allowEmpty = false)
            }
            vcs {
                root(Helpers.resolveRelativeIdFromIdString(src_id))
            }
            steps {
                script {
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        ./build_standalone.sh
                        """.trimIndent()
                }
                script {
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        export PACKAGE_NAME="gccwebhelp"
                        export IMAGE_URL="artifactory.guidewire.com/doctools-docker-dev/${'$'}PACKAGE_NAME:%DOC_VERSION%"
                        
                        docker build -t ${'$'}PACKAGE_NAME .
                        docker tag ${'$'}PACKAGE_NAME ${'$'}IMAGE_URL
                        docker push ${'$'}IMAGE_URL
                        """.trimIndent()
                }
            }
        }
    }

    private fun createYarnBuildTypes(
        env_names: List<String>,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
        index_for_search: Boolean,
        build_command: String?,
        node_image_version: String?,
        gw_platforms: String,
        gw_products: String,
        gw_versions: String,
        custom_env: JSONArray?,
    ): List<BuildType> {
        val yarnBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.YARN.build_type_name,
                env,
                doc_id,
                src_id,
                publish_path,
                working_dir,
                output_dir,
                index_for_search
            )
            val yarnBuildStep = GwBuildSteps.createBuildYarnProjectStep(
                env,
                publish_path,
                build_command,
                node_image_version,
                doc_id,
                gw_products,
                gw_platforms,
                gw_versions,
                working_dir,
                custom_env
            )
            docBuildType.steps.step(yarnBuildStep)
            docBuildType.steps.stepsOrder.add(0, yarnBuildStep.id.toString())
            yarnBuildTypes.add(docBuildType)
        }
        return yarnBuildTypes
    }

    private fun createStorybookBuildTypes(
        env_names: List<String>,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
        index_for_search: Boolean,
        gw_platforms: String,
        gw_products: String,
        gw_versions: String,
        custom_env: JSONArray?,
    ): List<BuildType> {
        val storybookBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.STORYBOOK.build_type_name,
                env,
                doc_id,
                src_id,
                publish_path,
                working_dir,
                output_dir,
                index_for_search
            )
            val storybookBuildStep = GwBuildSteps.createBuildStorybookProjectStep(
                env,
                publish_path,
                doc_id,
                gw_products,
                gw_platforms,
                gw_versions,
                working_dir,
                custom_env
            )
            docBuildType.steps.step(storybookBuildStep)
            docBuildType.steps.stepsOrder.add(0, storybookBuildStep.id.toString())
            storybookBuildTypes.add(docBuildType)
        }
        return storybookBuildTypes
    }

    private fun createSourceZipBuildTypes(
        env_names: List<String>,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
        index_for_search: Boolean,
        zip_filename: String,
    ): List<BuildType> {
        val sourceZipBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.SOURCE_ZIP.build_type_name,
                env,
                doc_id,
                src_id,
                publish_path,
                working_dir,
                output_dir,
                index_for_search
            )
            val zipUpSourcesBuildStep = GwBuildSteps.createZipUpSourcesStep(
                working_dir,
                output_dir,
                zip_filename
            )
            docBuildType.steps.step(zipUpSourcesBuildStep)
            docBuildType.steps.stepsOrder.add(0, zipUpSourcesBuildStep.id.toString())
            sourceZipBuildTypes.add(docBuildType)
        }
        return sourceZipBuildTypes
    }


    private fun createDitaBuildTypes(
        env_names: List<String>,
        doc_id: String,
        src_id: String,
        git_url: String,
        git_branch: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
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
        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(src_id)
        for (env in env_names) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.DITA.build_type_name,
                env,
                doc_id,
                src_id,
                publish_path,
                working_dir,
                output_dir,
                index_for_search
            )
            if (env == GwDeployEnvs.PROD.env_name) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                docBuildType.artifactRules =
                    "${working_dir}/${output_dir}/${GwConfigParams.BUILD_DATA_FILE.param_value} => ${GwConfigParams.BUILD_DATA_DIR.param_value}"
                val buildDitaProjectStep: ScriptBuildStep
                if (env == GwDeployEnvs.STAGING.env_name) {
                    docBuildType.features.feature(GwBuildFeatures.GwOxygenWebhelpLicenseBuildFeature)
                    buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name,
                        root_map,
                        index_redirect,
                        working_dir,
                        output_dir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        git_url,
                        git_branch
                    )
                    if (gw_platforms.lowercase(Locale.getDefault()).contains("self-managed")) {
                        val localOutputDir = "${output_dir}/zip"
                        val buildDitaProjectForOfflineUseStep =
                            GwBuildSteps.createBuildDitaProjectForBuildsStep(
                                GwDitaOutputFormats.WEBHELP.format_name,
                                root_map,
                                index_redirect,
                                working_dir,
                                localOutputDir,
                                for_offline_use = true
                            )
                        docBuildType.steps.step(buildDitaProjectForOfflineUseStep)
                        docBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
                        val copyPdfToOfflineOutputStep = GwBuildSteps.createCopyPdfFromOnlineToOfflineOutputStep(
                            "${working_dir}/${output_dir}",
                            "${working_dir}/${localOutputDir}"
                        )
                        docBuildType.steps.step(copyPdfToOfflineOutputStep)
                        docBuildType.steps.stepsOrder.add(1, copyPdfToOfflineOutputStep.id.toString())
                        val zipPackageStep = GwBuildSteps.createZipPackageStep(
                            "${working_dir}/${localOutputDir}",
                            "${working_dir}/${output_dir}"
                        )
                        docBuildType.steps.step(zipPackageStep)
                        docBuildType.steps.stepsOrder.add(2, zipPackageStep.id.toString())
                    }
                } else {
                    buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        GwDitaOutputFormats.WEBHELP.format_name,
                        root_map,
                        index_redirect,
                        working_dir,
                        output_dir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        git_url,
                        git_branch
                    )
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
                        val copyResourcesStep = GwBuildSteps.createCopyResourcesStep(
                            stepId,
                            working_dir,
                            output_dir,
                            resourceSrcDir,
                            resourceTargetDir,
                            resourceSrcUrl,
                            resourceSrcBranch
                        )
                        copyResourcesSteps.add(copyResourcesStep)
                    }
                    docBuildType.steps {
                        copyResourcesSteps.forEach { step(it) }
                        stepsOrder.addAll(stepsOrder.indexOf("UPLOAD_CONTENT_TO_THE_S3_BUCKET"),
                            copyResourcesSteps.map { it.id.toString() })
                    }
                    docBuildType.features.feature(GwBuildFeatures.GwSshAgentBuildFeature)
                }
            }

            ditaBuildTypes.add(docBuildType)
        }
        for (format in arrayListOf(GwDitaOutputFormats.WEBHELP.format_name,
            GwDitaOutputFormats.PDF.format_name,
            GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name)) {
            val localOutputDir = "${output_dir}/zip"
            val downloadableOutputBuildType = BuildType {
                name = "Build downloadable ${format.replace("_", " ")}"
                id = Helpers.resolveRelativeIdFromIdString("${this.name}${doc_id}")

                artifactRules = "${working_dir}/${output_dir} => /"

                vcs {
                    root(teamcityGitRepoId)
                    cleanCheckout = true
                }

                steps {
                    step(GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        format,
                        root_map,
                        index_redirect,
                        working_dir,
                        localOutputDir,
                        build_filter,
                        git_url = git_url,
                        git_branch = git_branch,
                        for_offline_use = true
                    ))
                    step(GwBuildSteps.createZipPackageStep("${working_dir}/${localOutputDir}",
                        "${working_dir}/${output_dir}"))
                }

                features {
                    feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                }
            }
            ditaBuildTypes.add(downloadableOutputBuildType)
        }
        if (env_names.contains(GwDeployEnvs.STAGING.env_name)) {
            val stagingBuildTypeIdString =
                Helpers.resolveRelativeIdFromIdString("$doc_id${GwDeployEnvs.STAGING.env_name}").toString()
            val localizationPackageBuildType = BuildType {
                name = "Build localization package"
                id = Helpers.resolveRelativeIdFromIdString("${this.name}${doc_id}")

                artifactRules = """
                    ${working_dir}/${output_dir} => /
                """.trimIndent()

                vcs {
                    root(teamcityGitRepoId)
                    branchFilter = GwVcsSettings.createBranchFilter(listOf(git_branch))
                    cleanCheckout = true
                }

                steps.step(GwBuildSteps.createRunLionPkgBuilderStep(working_dir,
                    output_dir,
                    stagingBuildTypeIdString))

                features {
                    feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                }
            }
            ditaBuildTypes.add(localizationPackageBuildType)
        }
        return ditaBuildTypes
    }

    private fun createInitialDocBuildType(
        gw_build_type: String,
        deploy_env: String,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
        index_for_search: Boolean,
    ): BuildType {
        val srcIsExported = Helpers.getObjectById(Helpers.sourceConfigs, "id", src_id).has("xdocsPathIds")
        return BuildType {
            name = "Publish to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${doc_id}")

            if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name, GwDeployEnvs.STAGING.env_name).contains(
                    deploy_env)
            ) {
                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(src_id))
                    cleanCheckout = true
                }
                val uploadContentToS3BucketStep =
                    GwBuildSteps.createUploadContentToS3BucketStep(
                        deploy_env,
                        "${working_dir}/${output_dir}",
                        publish_path
                    )
                steps.step(uploadContentToS3BucketStep)
                steps.stepsOrder.add(uploadContentToS3BucketStep.id.toString())
            }

            if (index_for_search) {
                val configFile = "%teamcity.build.workingDir%/config.json"
                val configFileStep = GwBuildSteps.createGetConfigFileStep(deploy_env, configFile)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = GwBuildSteps.createRunDocCrawlerStep(deploy_env, doc_id, configFile)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }
// FIXME: Remove the src_id condition when the refactoring is done
            // Publishing builds for INT and STAGING are triggered automatically.
            // DITA publishing builds are triggered by build listener builds. Additionally, DITA publishing builds
            // that use sources exported from XDocs, use a regular TeamCity VCS trigger with a comment rule.
            // The reference to the build listener template is one of the criteria used by the build manager app
            // to identify builds that must be triggered.
            // Yarn validation builds are triggered by regular TeamCity VCS triggers.
            if (arrayOf(GwDeployEnvs.INT.env_name, GwDeployEnvs.STAGING.env_name).contains(deploy_env)) {
                when (gw_build_type) {
                    GwBuildTypes.DITA.build_type_name -> {
                        templates(GwTemplates.BuildListenerTemplate)
                        if (srcIsExported) {
                            triggers.vcs {
                                triggerRules = """
                                    +:comment=\[$src_id\]:**
                                    """.trimIndent()
                            }
                        }
                    }
                    else -> {
                        if (src_id == "srcjutro711") {
                            triggers.vcs {}
                        }
                    }
                }
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
        val outputDir = when (build_config.has("outputPath")) {
            true -> build_config.getString("outputPath")
            false -> {
                when (gwBuildType) {
                    GwBuildTypes.YARN.build_type_name -> GwConfigParams.YARN_BUILD_OUT_DIR.param_value
                    GwBuildTypes.STORYBOOK.build_type_name -> GwConfigParams.STORYBOOK_BUILD_OUT_DIR.param_value
                    GwBuildTypes.SOURCE_ZIP.build_type_name -> GwConfigParams.SOURCE_ZIP_BUILD_OUT_DIR.param_value
                    else -> GwConfigParams.DITA_BUILD_OUT_DIR.param_value
                }
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

        val srcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", src_id)
        val gitUrl = srcConfig.getString("gitUrl")
        val gitBranch = srcConfig.getString("branch")

        val docProjectBuildTypes = mutableListOf<BuildType>()
        val customEnv = if (build_config.has("customEnv")) build_config.getJSONArray("customEnv") else null

        when (gwBuildType) {
            GwBuildTypes.YARN.build_type_name -> {
                val nodeImageVersion =
                    if (build_config.has("nodeImageVersion")) build_config.getString("nodeImageVersion") else null
                val buildCommand =
                    if (build_config.has("yarnBuildCustomCommand")) build_config.getString("yarnBuildCustomCommand") else null
                docProjectBuildTypes += createYarnBuildTypes(
                    docEnvironmentsList,
                    docId,
                    src_id,
                    publishPath,
                    workingDir,
                    outputDir,
                    indexForSearch,
                    buildCommand,
                    nodeImageVersion,
                    gwPlatformsString,
                    gwProductsString,
                    gwVersionsString,
                    customEnv
                )
            }
            GwBuildTypes.STORYBOOK.build_type_name -> {
                docProjectBuildTypes += createStorybookBuildTypes(
                    docEnvironmentsList,
                    docId,
                    src_id,
                    publishPath,
                    workingDir,
                    outputDir,
                    indexForSearch,
                    gwPlatformsString,
                    gwProductsString,
                    gwVersionsString,
                    customEnv
                )
            }
            GwBuildTypes.DITA.build_type_name -> {
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

                docProjectBuildTypes += createDitaBuildTypes(
                    docEnvironmentsList,
                    docId,
                    src_id,
                    gitUrl,
                    gitBranch,
                    publishPath,
                    workingDir,
                    outputDir,
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
            GwBuildTypes.SOURCE_ZIP.build_type_name -> {
                val zipFilename = build_config.getString("zipFilename")
                docProjectBuildTypes += createSourceZipBuildTypes(
                    docEnvironmentsList,
                    docId,
                    src_id,
                    publishPath,
                    workingDir,
                    outputDir,
                    indexForSearch,
                    zipFilename
                )
            }
        }

        if (arrayOf("guidewirecloudconsolerootinsurerdev").contains(docId)) {
            docProjectBuildTypes.add(createBuildAndPublishDockerImageWithGccContent(src_id))
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
        return Project {
            name = "Content"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            subProject(createUpdateSearchIndexProject())
            subProject(createCleanUpSearchIndexProject())
            subProject(createGenerateSitemapProject())
            subProject(createDeployServerConfigProject())
            buildType(UploadPdfsForEscrowBuildType)
        }
    }

    private fun createGenerateSitemapProject(): Project {
        return Project {
            name = "Generate sitemap"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createGenerateSitemapBuildType(it.env_name))
            }
        }
    }

    private fun createGenerateSitemapBuildType(deploy_env: String): BuildType {
        val outputDir = "%teamcity.build.checkoutDir%/build"
        return BuildType {
            name = "Generate sitemap for $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.createRunSitemapGeneratorStep(deploy_env, outputDir))
                step(GwBuildSteps.createDeployFilesToPersistentVolumeStep(deploy_env, "sitemap", outputDir))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deploy_env == GwDeployEnvs.PROD.env_name) {
                triggers {
                    schedule {
                        schedulingPolicy = daily {
                            hour = 1
                            minute = 1
                        }
                        triggerBuild = always()
                    }
                }
            }
        }
    }

    private fun createCleanUpSearchIndexProject(): Project {
        return Project {
            name = "Clean up search index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createCleanUpSearchIndexBuildType(it.env_name))
            }
        }
    }

    private fun createCleanUpSearchIndexBuildType(deploy_env: String): BuildType {
        return BuildType {
            name = "Clean up search index on $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                step(GwBuildSteps.createRunIndexCleanerStep(deploy_env))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            triggers {
                schedule {
                    schedulingPolicy = daily {
                        hour = 1
                        minute = 1
                    }
                    triggerBuild = always()
                }
            }
        }
    }

    private fun createUpdateSearchIndexProject(): Project {
        return Project {
            name = "Update search index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD,
                GwDeployEnvs.PORTAL2).forEach {
                buildType(createUpdateSearchIndexBuildType(it.env_name))
            }
        }
    }

    private fun createUpdateSearchIndexBuildType(deploy_env: String): BuildType {
        val configFile = "%teamcity.build.workingDir%/config.json"
        return BuildType {
            name = "Update search index on $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            params {
                text(
                    "DOC_ID",
                    "",
                    label = "Doc ID",
                    description = "The ID of the document you want to reindex. Leave this field empty to reindex all documents included in the config file.",
                    display = ParameterDisplay.PROMPT,
                    allowEmpty = true
                )
            }

            steps {
                step(GwBuildSteps.createGetConfigFileStep(deploy_env, configFile))
                step(GwBuildSteps.createRunDocCrawlerStep(deploy_env, "%DOC_ID%", configFile))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    private fun createDeployServerConfigProject(): Project {
        return Project {
            name = "Deploy server config"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createDeployServerConfigBuildType(it.env_name))
            }
        }
    }

    private fun createDeployServerConfigBuildType(deploy_env: String): BuildType {
        return BuildType {
            name = "Deploy server config to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }
            steps {
                step(GwBuildSteps.createGenerateDocsConfigFilesForEnvStep(deploy_env))
                step(GwBuildSteps.createUploadContentToS3BucketStep(
                    deploy_env,
                    GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value,
                    "portal-config")
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    object UploadPdfsForEscrowBuildType : BuildType({
        name = "Upload PDFs for Escrow"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        params {
            text(
                "env.RELEASE_NAME",
                "",
                label = "Release name",
                description = "For example, Banff or Cortina",
                display = ParameterDisplay.PROMPT
            )
            text(
                "env.RELEASE_NUMBER",
                "",
                label = "Release number",
                description = "Numeric representation of the release without dots or hyphens. For example, 202011 or 202104",
                display = ParameterDisplay.PROMPT
            )
        }

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            branchFilter = "+:<default>"
            cleanCheckout = true
        }

        val tmpDir = "%teamcity.build.checkoutDir%/ci/pdfs"
        val zipArchiveName = "%env.RELEASE_NAME%_pdfs.zip"
        val (awsAccessKeyIdProd, awsSecretAccessKeyProd, awsDefaultRegionProd) = Helpers.getAwsSettings(GwDeployEnvs.PROD.env_name)
        val (awsAccessKeyIdInt, awsSecretAccessKeyInt, awsDefaultRegionInt) = Helpers.getAwsSettings(GwDeployEnvs.INT.env_name)

        steps {
            script {
                name = "Download and zip PDF files"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export TMP_DIR="$tmpDir"
                    export ZIP_ARCHIVE_NAME="$zipArchiveName"
                    
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="$awsAccessKeyIdProd"
                    export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKeyProd"
                    export AWS_DEFAULT_REGION="$awsDefaultRegionProd"
                    
                    cd %teamcity.build.checkoutDir%/ci
                    ./downloadPdfsForEscrow.sh
                """.trimIndent()
            }
            script {
                name = "Upload the ZIP archive to S3"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Setting credentials to access int"
                    export AWS_ACCESS_KEY_ID="$awsAccessKeyIdInt"
                    export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKeyInt"
                    export AWS_DEFAULT_REGION="$awsDefaultRegionInt"
                    
                    echo "Uploading the ZIP archive to the S3 bucket"
                    aws s3 cp "${tmpDir}/${zipArchiveName}" s3://tenant-doctools-int-builds/escrow/%env.RELEASE_NAME%/
            """.trimIndent()
            }
        }
    })
}

object Frontend {
    val rootProject = createRootProjectForFrontend()

    private fun createRootProjectForFrontend(): Project {
        return Project {
            name = "Frontend"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            subProject(createDeployLandingPagesProject())
            subProject(createDeployLocalizedPagesProject())
            subProject(createDeployUpgradeDiffsProject())
        }
    }

    private fun createDeployLandingPagesProject(): Project {
        return Project {
            name = "Deploy landing pages"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createDeployLandingPagesBuildType(it.env_name))
            }
        }
    }

    private fun createDeployLandingPagesBuildType(deploy_env: String): BuildType {
        val outputDir = "%teamcity.build.checkoutDir%/output"
        return BuildType {
            name = "Deploy landing pages to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.MergeDocsConfigFilesStep)
                step(
                    GwBuildSteps.createRunFlailSsgStep(
                        "%teamcity.build.checkoutDir%/frontend/pages",
                        outputDir,
                        deploy_env
                    )
                )
                step(GwBuildSteps.createDeployFilesToPersistentVolumeStep(deploy_env, "frontend", outputDir))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deploy_env == GwDeployEnvs.DEV.env_name) {
                triggers {
                    vcs {
                        triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:frontend/pages/**
                            -:user=doctools:**
                            """.trimIndent()
                    }
                }
            }
        }
    }

    private fun createDeployLocalizedPagesProject(): Project {
        return Project {
            name = "Deploy localized pages"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcsRoot(GwVcsRoots.LocalizedPdfsGitVcsRoot)
            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createDeployLocalizedPagesBuildType(it.env_name))
            }
        }
    }

    private fun createDeployLocalizedPagesBuildType(deploy_env: String): BuildType {
        val lionSourcesRoot = "pdf-src"
        val pagesDir = "%teamcity.build.checkoutDir%/build"
        val locDocsSrc = "%teamcity.build.checkoutDir%/${lionSourcesRoot}"
        val locDocsOut = "${pagesDir}/l10n"
        val outputDir = "%teamcity.build.checkoutDir%/output"
        return BuildType {
            name = "Deploy localized pages to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                root(GwVcsRoots.LocalizedPdfsGitVcsRoot, "+:. => $lionSourcesRoot")
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(
                    GwBuildSteps.createRunLionPageBuilderStep(
                        locDocsSrc,
                        locDocsOut
                    )
                )
                step(GwBuildSteps.createCopyLocalizedPdfsToS3BucketStep(deploy_env, locDocsSrc))
                step(GwBuildSteps.MergeDocsConfigFilesStep)
                step(
                    GwBuildSteps.createRunFlailSsgStep(
                        pagesDir,
                        outputDir,
                        deploy_env
                    )
                )
                step(GwBuildSteps.createDeployFilesToPersistentVolumeStep(deploy_env, "localizedPages", outputDir))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deploy_env == GwDeployEnvs.DEV.env_name) {
                triggers {
                    vcs {
                        triggerRules = """
                            +:root=${GwVcsRoots.LocalizedPdfsGitVcsRoot.id}:**
                            -:user=doctools:**
                            """.trimIndent()
                    }
                }
            }
        }
    }

    private fun createDeployUpgradeDiffsProject(): Project {
        return Project {
            name = "Deploy upgrade diffs"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcsRoot(GwVcsRoots.UpgradeDiffsGitVcsRoot)
            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createDeployUpgradeDiffsBuildType(it.env_name))
            }
        }
    }

    private fun createDeployUpgradeDiffsBuildType(deploy_env: String): BuildType {
        val upgradeDiffsSourcesRoot = "upgradediffs-src"
        val pagesDir = "%teamcity.build.checkoutDir%/build"
        val upgradeDiffsDocsSrc = "%teamcity.build.checkoutDir%/${upgradeDiffsSourcesRoot}/src"
        val upgradeDiffsDocsOut = "${pagesDir}/upgradediffs"
        val outputDir = "%teamcity.build.checkoutDir%/output"
        return BuildType {
            name = "Deploy upgrade diffs to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                root(GwVcsRoots.UpgradeDiffsGitVcsRoot, "+:. => $upgradeDiffsSourcesRoot")
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(
                    GwBuildSteps.createRunUpgradeDiffsPageBuilderStep(
                        deploy_env,
                        upgradeDiffsDocsSrc,
                        upgradeDiffsDocsOut
                    )
                )
                step(GwBuildSteps.createCopyUpgradeDiffsToS3BucketStep(deploy_env, upgradeDiffsDocsSrc))
                step(GwBuildSteps.MergeDocsConfigFilesStep)
                step(
                    GwBuildSteps.createRunFlailSsgStep(
                        pagesDir,
                        outputDir,
                        deploy_env
                    )
                )
                step(GwBuildSteps.createDeployFilesToPersistentVolumeStep(deploy_env, "upgradeDiffs", outputDir))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deploy_env == GwDeployEnvs.DEV.env_name) {
                triggers {
                    vcs {
                        triggerRules = """
                            +:root=${GwVcsRoots.UpgradeDiffsGitVcsRoot.id}:**
                            -:user=doctools:**
                            """.trimIndent()
                    }
                }
            }
        }
    }
}

object Server {
    val rootProject = createRootProjectForServer()

    private fun createRootProjectForServer(): Project {
        return Project {
            name = "Server"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            buildType(Checkmarx)
            buildType(TestDocSiteServerApp)
            buildType(TestConfig)
            buildType(TestSettingsKts)
            arrayOf(GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD).forEach {
                buildType(createDeployServerBuildType(it.env_name))
            }
            buildType(ReleaseNewVersion)
        }
    }

    private object Checkmarx : BuildType({
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
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }
// FIXME: Reenable this line when the refactoring is done
//        triggers {
//            vcs {
//            }
//        }
    })

    private object TestSettingsKts : BuildType({
        name = "Test settings.kts"

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            maven {
                goals = "teamcity-configs:generate"
                pomLocation = ".teamcity/pom.xml"
                workingDir = ""
            }
        }

        triggers.vcs {
            triggerRules = """
                +:.teamcity/settings.kts
                -:user=doctools:**
            """.trimIndent()
        }

        features.feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
    })

    private object TestDocSiteServerApp : BuildType({
        name = "Test doc site server app"

        params {
            text("env.TEST_ENVIRONMENT_DOCKER_NETWORK", "host", allowEmpty = false)
        }

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            dockerCompose {
                name = "Compose services"
                file = "apps/doc_crawler/tests/test_doc_crawler/resources/docker-compose.yml"
            }

            dockerCommand {
                name = "Build the doc crawler Docker image locally"
                commandType = build {
                    source = file {
                        path = "apps/doc_crawler/Dockerfile"
                    }
                    namesAndTags = "doc-crawler:local"
                    commandArgs = "--pull"
                }
                param("dockerImage.platform", "linux")
            }

            script {
                name = "Crawl the document and update the local index"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export APP_BASE_URL="http://localhost/"
                    export INDEX_NAME="gw-docs"
                    export ELASTICSEARCH_URLS="http://localhost:9200"
                    export DOC_S3_URL="http://localhost/"
                    export CONFIG_FILE="%teamcity.build.workingDir%/apps/doc_crawler/tests/test_doc_crawler/resources/input/config/gw-docs.json"
    
                    cat > scrapy.cfg <<- EOM
                    [settings]
                    default = doc_crawler.settings
                    EOM
    
                    doc_crawler
                """.trimIndent()
                dockerImage = "doc-crawler:local"
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }

            script {
                name = "Test the doc site server"
                workingDir = "server"
                scriptContent = """
                    #!/bin/sh
                    set -e
                    export APP_BASE_URL="http://localhost:8081"
                    export ELASTIC_SEARCH_URL="http://localhost:9200"
                    export DOC_S3_URL="http://localhost/"
                    
                    npm install
                    npm test
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_14_ALPINE.image_url
                dockerPull = true
            }
        }
// FIXME: Reenable this line when the refactoring is done
//        triggers {
//            vcs {
//                triggerRules = """
//                +:server/**
//                -:user=doctools:**
//            """.trimIndent()
//            }
//        }

        features {
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
        }
    })

    private object TestConfig : BuildType({
        name = "Test config files"

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                name = "Run tests for config files"
                scriptContent = """
                #!/bin/bash
                set -xe
                
                # Merge config files
                
                config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}"
                config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}"
                config_deployer merge "${GwConfigParams.BUILDS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.param_value}"
             
                # Test merged config files
                
                config_deployer test "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"
                config_deployer test "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"
                config_deployer test "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                --sources-path "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                --docs-path "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"  
            """.trimIndent()
                dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
        }

        triggers.vcs {
            triggerRules = """
                +:.teamcity/**/*.*
                -:user=doctools:**
            """.trimIndent()
        }

        features {
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            feature(GwBuildFeatures.GwSshAgentBuildFeature)
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    })

    object ReleaseNewVersion : BuildType({
        name = "Release new version"
        id = Helpers.resolveRelativeIdFromIdString(this.name)
        maxRunningBuilds = 1

        params {
            select(
                "semver-scope", "patch", label = "Version Scope", display = ParameterDisplay.PROMPT,
                options = listOf("Patch" to "patch", "Minor" to "minor", "Major" to "major")
            )
        }

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            branchFilter = "+:<default>"
            cleanCheckout = true
        }

        steps {
            script {
                name = "Bump and tag version"
                scriptContent = """
                set -xe
                git config --local user.email "doctools@guidewire.com"
                git config --local user.name "%env.SERVICE_ACCOUNT_USERNAME%"
                git fetch --tags

                cd server/
                export TAG_VERSION=${'$'}(npm version %semver-scope%)
                git add .
                git commit -m "push changes to ${'$'}{TAG_VERSION}"
                git tag -a ${'$'}{TAG_VERSION} -m "create new %semver-scope% version ${'$'}{TAG_VERSION}"
                git push
                git push --tags
                
                docker build -t ${GwDockerImages.DOC_PORTAL.image_url}:${'$'}{TAG_VERSION} . --build-arg tag_version=${'$'}{TAG_VERSION}
                docker push ${GwDockerImages.DOC_PORTAL.image_url}:${'$'}{TAG_VERSION}
            """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerPull = true
                dockerRunParameters =
                    "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
            }
        }

        features {
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.GwSshAgentBuildFeature)
        }
    })

    private fun createDeployServerBuildType(deploy_env: String): BuildType {
        val namespace = "doctools"
        val tagVersion = when (deploy_env) {
            GwDeployEnvs.DEV.env_name -> "latest"
            GwDeployEnvs.INT.env_name -> "latest-int"
            else -> "v%TAG_VERSION%"
        }
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(deploy_env)
        val partnersLoginUrl: String
        val customersLoginUrl: String
        if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name).contains(deploy_env)) {
            partnersLoginUrl = "https://qaint-guidewire.cs172.force.com/partners/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://qaint-guidewire.cs172.force.com/customers/idp/endpoint/HttpRedirect"
        } else if (deploy_env == GwDeployEnvs.STAGING.env_name) {
            partnersLoginUrl = "https://uat-guidewire.cs166.force.com/partners/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://uat-guidewire.cs166.force.com/customers/idp/endpoint/HttpRedirect"
        } else {
            partnersLoginUrl = "https://partner.guidewire.com/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://community.guidewire.com/idp/endpoint/HttpRedirect"
        }

        val deploymentFile: String
        val ingressFile: String
        if (deploy_env == GwDeployEnvs.PROD.env_name) {
            deploymentFile = "deployment-prod.yml"
            ingressFile = "ingress-prod.yml"
        } else {
            deploymentFile = "deployment.yml"
            ingressFile = "ingress.yml"
        }

        val serverBuildTypeDeployEnv =
            if (deploy_env == GwDeployEnvs.PROD.env_name) GwDeployEnvs.US_EAST_2.env_name else deploy_env
        val deployServerBuildType = BuildType {
            name = "Deploy to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                script {
                    name = "Deploy to Kubernetes"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash 
                        set -eux
                                              
                        export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                        export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                        export AWS_DEFAULT_REGION="$awsDefaultRegion"
                        
                        # Environment variables needed for Kubernetes config files
                        export PARTNERS_LOGIN_URL="$partnersLoginUrl"
                        export CUSTOMERS_LOGIN_URL="$customersLoginUrl"
                        export TAG_VERSION="$tagVersion"
                        export DEPLOY_ENV="$serverBuildTypeDeployEnv"
                        ###
                        
                        aws eks update-kubeconfig --name atmos-${serverBuildTypeDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${namespace})
                        
                        eval "echo \"${'$'}(cat server/kube/${deploymentFile})\"" > deployment.yml
                        eval "echo \"${'$'}(cat server/kube/${ingressFile})\"" > ingress.yml
                        eval "echo \"${'$'}(cat server/kube/service.yml)\"" > service.yml
                        
                        kubectl get secret artifactory-secret --output="jsonpath={.data.\.dockerconfigjson}" --namespace=${namespace} || \
                        kubectl create secret docker-registry artifactory-secret --docker-server=artifactory.guidewire.com --docker-username=%env.SERVICE_ACCOUNT_USERNAME% --docker-password=%env.ARTIFACTORY_API_KEY% --namespace=${namespace}
                        
                        sed -ie "s/BUILD_TIME/${'$'}(date)/g" deployment.yml
                        kubectl apply -f deployment.yml --namespace=${namespace}
                        kubectl apply -f service.yml --namespace=${namespace}
                        kubectl apply -f ingress.yml --namespace=${namespace}                    
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerPull = true
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                script {
                    name = "Check new Pods Status"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                        set -e
                        
                        export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                        export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                        export AWS_DEFAULT_REGION="$awsDefaultRegion"
                        
                        aws eks update-kubeconfig --name atmos-${serverBuildTypeDeployEnv}
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
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerPull = true
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }

                stepsOrder = this.items.map { it.id.toString() } as ArrayList<String>
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }

        if (arrayOf(GwDeployEnvs.STAGING.env_name, GwDeployEnvs.PROD.env_name).contains(deploy_env)) {
            deployServerBuildType.params.text(
                "TAG_VERSION",
                "",
                label = "Deploy Version",
                display = ParameterDisplay.PROMPT,
                regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""",
                validationMessage = "Invalid SemVer Format"
            )
            if (deploy_env == GwDeployEnvs.PROD.env_name) {
                val publishServerDockerImageToEcrStep =
                    GwBuildSteps.createPublishServerDockerImageToEcrStep(GwDockerImages.DOC_PORTAL.image_url,
                        tagVersion)
                deployServerBuildType.steps.step(publishServerDockerImageToEcrStep)
                deployServerBuildType.steps.stepsOrder.add(0, publishServerDockerImageToEcrStep.id.toString())
            }
        }

        if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name).contains(deploy_env)) {
            deployServerBuildType.vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }
            val buildAndPublishServerDockerImageStep =
                GwBuildSteps.createBuildAndPublishServerDockerImageStep(GwDockerImages.DOC_PORTAL.image_url, tagVersion)
            deployServerBuildType.steps.step(buildAndPublishServerDockerImageStep)
            deployServerBuildType.steps.stepsOrder.add(0, buildAndPublishServerDockerImageStep.id.toString())
            deployServerBuildType.dependencies {
                snapshot(Checkmarx) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestDocSiteServerApp) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestConfig) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
            if (deploy_env == GwDeployEnvs.DEV.env_name) {
// FIXME: Reenable this line when the refactoring is done
//                deployServerBuildType.triggers.finishBuildTrigger {
//                    id = "TRIGGER_1"
//                    buildType = "${TestDocPortalServer.id}"
//                    successfulOnly = true
//                }
            }
        }
        return deployServerBuildType
    }
}

object Exports {
    val rootProject = createRootProjectForExports()

    private fun createRootProjectForExports(): Project {
        return Project {
            name = "Exports"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcsRoot(GwVcsRoots.XdocsClientGitVcsRoot)
            buildType(ExportFilesFromXDocsToBitbucketBuildType)
            createExportBuildTypes().forEach {
                buildType(it)
            }
        }
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

                val exportFrequency = when (environmentsFromRelatedDocConfigs.contains(GwDeployEnvs.INT.env_name)) {
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

                exportBuildTypes.add(
                    createExportFilesFromXDocsToBitbucketCompositeBuildType(
                        srcTitle,
                        xdocsPathIds,
                        gitUrl,
                        gitBranch,
                        srcId,
                        exportServer,
                        exportFrequency,
                        scheduleHour,
                        scheduleMinute
                    )
                )
            }
        }
        return exportBuildTypes
    }

    private fun createExportFilesFromXDocsToBitbucketCompositeBuildType(
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

    private object ExportFilesFromXDocsToBitbucketBuildType : BuildType({
        name = "Export files from XDocs to Bitbucket"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        maxRunningBuilds = 2

        params {
            text(
                "EXPORT_PATH_IDS",
                "",
                description = "A list of space-separated path IDs from XDocs",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true
            )
            text(
                "GIT_URL",
                "",
                description = "The URL of the Bitbucket repository where the files exported from XDocs are added",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true
            )
            text(
                "GIT_BRANCH",
                "",
                description = "The branch of the Bitbucket repository where the files exported from XDocs are added",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true
            )
            text(
                "XDOCS_EXPORT_DIR",
                "%system.teamcity.build.tempDir%/xdocs_export_dir",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false
            )
            text(
                "SRC_ID",
                "",
                description = "The ID of the source",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false
            )
            text(
                "EXPORT_SERVER",
                "",
                description = "The export server",
                display = ParameterDisplay.HIDDEN,
                allowEmpty = false
            )
        }

        vcs {
            root(GwVcsRoots.XdocsClientGitVcsRoot)
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
                    git config --local user.name "%env.SERVICE_ACCOUNT_USERNAME%"
                        
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
}

object BuildListeners {
    val rootProject = createBuildListenersProject()

    private fun getSourcesForBuildListenerBuildTypes(): List<JSONObject> {
        val sourcesRequiringListeners = mutableListOf<JSONObject>()
        for (src in Helpers.gitNativeSources) {
            val srcId = src.getString("id")
            val ditaBuildsRelatedToSrc =
                Helpers.buildConfigs.filter { it.getString("srcId") == srcId && it.getString("buildType") == GwBuildTypes.DITA.build_type_name }
            val uniqueEnvsFromAllDitaBuildsRelatedToSrc = ditaBuildsRelatedToSrc.map {
                val buildDocId = it.getString("docId")
                val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", buildDocId)
                Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
            }.flatten().distinct()

            if (arrayListOf(GwDeployEnvs.INT.env_name,
                    GwDeployEnvs.STAGING.env_name).any { uniqueEnvsFromAllDitaBuildsRelatedToSrc.contains(it) }
            ) {
                sourcesRequiringListeners.add(src)
            }
        }
        return sourcesRequiringListeners
    }

    private fun createBuildListenersProject(): Project {
        return Project {
            name = "Build listeners"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            val buildListenerSources = getSourcesForBuildListenerBuildTypes()
            buildListenerSources.forEach {
                val srcId = it.getString("id")
                val gitUrl = it.getString("gitUrl")
                val gitBranch = Helpers.createFullGitBranchName(it.getString("branch"))
                buildType {
                    name = "$srcId builds listener"
                    id = Helpers.resolveRelativeIdFromIdString(this.name)

                    vcs {
                        root(Helpers.resolveRelativeIdFromIdString(srcId))
                        cleanCheckout = true
                    }
                    steps.step(
                        GwBuildSteps.createRunBuildManagerStep(
                            Docs.rootProject.id.toString(),
                            GwTemplates.BuildListenerTemplate.id.toString(),
                            gitUrl,
                            git_branch = gitBranch,
                            teamcity_build_branch = gitBranch
                        )
                    )
// FIXME: Reenable this line when the refactoring is done
                    if (arrayOf("writingwithgitsrc", "isupgradeguidesrc").contains(srcId)
                    ) {
                        triggers.vcs {}
                    }
                    features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                }
            }
        }
    }
}

object Sources {
    val rootProject = createRootProjectForSources()

    private fun createRootProjectForSources(): Project {
        return Project {
            name = "Sources"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            template(GwTemplates.ValidationListenerTemplate)
            createValidationProjectsForSources().forEach {
                subProject(it)
            }
        }
    }

    private fun createValidationProjectsForSources(): List<Project> {
        val validationProjects = mutableListOf<Project>()
        for (src in Helpers.gitNativeSources) {
            val srcId = src.getString("id")
            val gitUrl = src.getString("gitUrl")
            val buildsRelatedToSrc =
                Helpers.buildConfigs.filter { it.getString("srcId") == srcId }
            if (buildsRelatedToSrc.isNotEmpty()) {
                val gitBranch = src.getString("branch")
                val validationProject = createValidationProject(
                    srcId,
                    gitUrl,
                    gitBranch,
                    buildsRelatedToSrc
                )
                validationProjects.add(validationProject)
            }
        }
        return validationProjects
    }

    private fun createValidationProject(
        src_id: String,
        git_url: String,
        git_branch: String,
        build_configs: List<JSONObject>,
    ): Project {
        val uniqueGwBuildTypesForAllBuilds = build_configs.map { it.getString("buildType") }.distinct()
        return Project {
            name = src_id
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            val validationBuildsSubProject = Project {
                name = "Validation builds"
                id = Helpers.resolveRelativeIdFromIdString("${src_id}${this.name}")
            }

            buildType(createCleanValidationResultsBuildType(src_id, git_url))

            if (uniqueGwBuildTypesForAllBuilds.contains(GwBuildTypes.DITA.build_type_name)) {
                validationBuildsSubProject.buildType(
                    createValidationListenerBuildType(src_id,
                        git_url,
                        git_branch,
                        this.id.toString())
                )
            }
            build_configs.forEach {
                validationBuildsSubProject.buildType(
                    createValidationBuildType(src_id,
                        git_branch,
                        it,
                        it.getString("buildType"))
                )
            }
            subProject(validationBuildsSubProject)


        }
    }


    private fun createValidationListenerBuildType(
        src_id: String,
        git_url: String,
        git_branch: String,
        teamcity_affected_project_id: String,
    ): BuildType {
        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(src_id)
        return BuildType {
            name = "$src_id validation listener"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }
            steps.step(
                GwBuildSteps.createRunBuildManagerStep(
                    teamcity_affected_project_id,
                    GwTemplates.ValidationListenerTemplate.id.toString(),
                    git_url,
                    Helpers.createFullGitBranchName(git_branch),
                    "%teamcity.build.branch%"
                )
            )
// FIXME: Remove the src_id condition when the refactoring is done
            if (arrayOf("writingwithgitsrc", "isupgradeguidesrc").contains(src_id)) {
                triggers.vcs {}
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(Helpers.createFullGitBranchName(git_branch)))
            }
        }
    }

    private fun createValidationBuildType(
        src_id: String,
        git_branch: String,
        build_config: JSONObject,
        gw_build_type: String,
    ): BuildType {
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
        val outputDir = when (build_config.has("outputPath")) {
            true -> build_config.getString("outputPath")
            false -> {
                when (gw_build_type) {
                    GwBuildTypes.YARN.build_type_name -> GwConfigParams.YARN_BUILD_OUT_DIR.param_value
                    GwBuildTypes.STORYBOOK.build_type_name -> GwConfigParams.STORYBOOK_BUILD_OUT_DIR.param_value
                    GwBuildTypes.SOURCE_ZIP.build_type_name -> GwConfigParams.SOURCE_ZIP_BUILD_OUT_DIR.param_value
                    else -> GwConfigParams.DITA_BUILD_OUT_DIR.param_value
                }
            }
        }

        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(src_id)
        // For the preview URL and doc validator data uploaded to Elasticsearch, we cannot use the teamcity.build.branch
        // variable because for the default branch it resolves to "<default>". We need the full branch name so we use
        // the teamcity.build.vcs.branch.<VCS_root_ID> variable. For validation listeners and builds, we use
        // the teamcity.build.branch variable because it's more flexible (we don't need to provide the VCS Root ID).
        val teamcityBuildBranch = "%teamcity.build.vcs.branch.${teamcityGitRepoId}%"
        val publishPath = "preview/${src_id}/${teamcityBuildBranch}/${docId}"
        val previewUrlFile = "preview_url.txt"

        val validationBuildType = BuildType {
            name = "Validate $docTitle ($docId)"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${src_id}")

            artifactRules = "$previewUrlFile\n"

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            features.feature(GwBuildFeatures.createGwPullRequestsBuildFeature(Helpers.createFullGitBranchName(git_branch)))
        }

        if (gw_build_type == GwBuildTypes.DITA.build_type_name) {
            val ditaOtLogsDir = "dita_ot_logs"
            val normalizedDitaDir = "normalized_dita_dir"
            val schematronReportsDir = "schematron_reports_dir"
            val docInfoFile = "doc-info.json"
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

            validationBuildType.artifactRules += """
                ${workingDir}/${ditaOtLogsDir} => logs
                ${workingDir}/${outputDir}/${GwDitaOutputFormats.WEBHELP.format_name}/${GwConfigParams.BUILD_DATA_FILE.param_value} => ${GwConfigParams.BUILD_DATA_DIR.param_value}
            """.trimIndent()

            validationBuildType.steps {
                step(
                    GwBuildSteps.createGetDocumentDetailsStep(
                        teamcityBuildBranch,
                        src_id,
                        docInfoFile,
                        docConfig
                    )
                )
                step(
                    GwBuildSteps.createBuildDitaProjectForValidationsStep(
                        GwDitaOutputFormats.WEBHELP.format_name,
                        rootMap,
                        workingDir,
                        outputDir,
                        ditaOtLogsDir,
                        normalizedDitaDir,
                        schematronReportsDir,
                        buildFilter,
                        indexRedirect
                    )
                )
                step(
                    GwBuildSteps.createUploadContentToS3BucketStep(
                        GwDeployEnvs.INT.env_name,
                        "${workingDir}/${outputDir}/${GwDitaOutputFormats.WEBHELP.format_name}",
                        publishPath,
                    )
                )
                step(
                    GwBuildSteps.createPreviewUrlFile(
                        publishPath,
                        previewUrlFile
                    )
                )
                step(
                    GwBuildSteps.createBuildDitaProjectForValidationsStep(
                        GwDitaOutputFormats.DITA.format_name,
                        rootMap,
                        workingDir,
                        outputDir,
                        ditaOtLogsDir,
                        normalizedDitaDir,
                        schematronReportsDir
                    )
                )
                step(
                    GwBuildSteps.createBuildDitaProjectForValidationsStep(
                        GwDitaOutputFormats.VALIDATE.format_name,
                        rootMap,
                        workingDir,
                        outputDir,
                        ditaOtLogsDir,
                        normalizedDitaDir,
                        schematronReportsDir
                    )
                )
                step(
                    GwBuildSteps.createRunDocValidatorStep(
                        workingDir,
                        ditaOtLogsDir,
                        normalizedDitaDir,
                        schematronReportsDir,
                        docInfoFile
                    )
                )
            }
        } else if (gw_build_type == GwBuildTypes.YARN.build_type_name) {
            val metadata = docConfig.getJSONObject("metadata")
            val gwPlatforms = metadata.getJSONArray("platform")
            val gwProducts = metadata.getJSONArray("product")
            val gwVersions = metadata.getJSONArray("version")
            val gwPlatformsString = gwPlatforms.joinToString(",")
            val gwProductsString = gwProducts.joinToString(",")
            val gwVersionsString = gwVersions.joinToString(",")
            val nodeImageVersion =
                if (build_config.has("nodeImageVersion")) build_config.getString("nodeImageVersion") else null
            val buildCommand =
                if (build_config.has("yarnBuildCustomCommand")) build_config.getString("yarnBuildCustomCommand") else null
            val customEnv = if (build_config.has("customEnv")) build_config.getJSONArray("customEnv") else null
            validationBuildType.steps {
                step(
                    GwBuildSteps.createBuildYarnProjectStep(
                        GwDeployEnvs.INT.env_name,
                        publishPath,
                        buildCommand,
                        nodeImageVersion,
                        docId,
                        gwProductsString,
                        gwPlatformsString,
                        gwVersionsString,
                        workingDir,
                        customEnv
                    )
                )
                step(
                    GwBuildSteps.createUploadContentToS3BucketStep(
                        GwDeployEnvs.INT.env_name,
                        "${workingDir}/${outputDir}",
                        publishPath,
                    )
                )
                step(
                    GwBuildSteps.createPreviewUrlFile(
                        publishPath,
                        previewUrlFile
                    )
                )

            }

            validationBuildType.features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            }

        }

        // FIXME: Remove the src_id condition when the refactoring is done
        // DITA validation builds are triggered by validation listener builds.
        // The reference to the validation listener template is one of the criteria used by the build manager app
        // to identify builds that must be triggered.
        // Yarn validation builds are triggered by regular TeamCity VCS triggers.
        when (gw_build_type) {
            GwBuildTypes.DITA.build_type_name -> {
                validationBuildType.templates(GwTemplates.ValidationListenerTemplate)
            }
            GwBuildTypes.YARN.build_type_name -> {
                if (src_id == "srcjutro711") {
                    validationBuildType.triggers.vcs {}
                }
            }
        }

        return validationBuildType
    }

    private fun createCleanValidationResultsBuildType(
        src_id: String,
        git_url: String,
    ): BuildType {
        return BuildType {
            name = "Clean validation results for $src_id"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(src_id))
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Run the results cleaner"
                    id = Helpers.createIdStringFromName(this.name)
                    executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        results_cleaner --elasticsearch-urls "https://docsearch-doctools.int.ccs.guidewire.net"  --git-source-id "$src_id" --git-source-url "$git_url" --s3-bucket-name "tenant-doctools-int-builds"
                    """.trimIndent()
                    dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
// FIXME: Reenable this line when the refactoring is done
            if (arrayOf("writingwithgitsrc", "isupgradeguidesrc", "srcjutro711").contains(src_id)) {
                triggers.vcs {}
            }
        }
    }

}

object Recommendations {
    val rootProject = createRootProjectForRecommendations()

    private fun createRootProjectForRecommendations(): Project {
        return Project {
            name = "Recommendations"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            for (env in arrayOf(GwDeployEnvs.INT)) {
                val recommendationProject = createRecommendationProject(env.env_name)
                subProject(recommendationProject)
            }
        }
    }

    private fun createRecommendationProject(deploy_env: String): Project {
        val recommendationProjectBuildTypes = mutableListOf<BuildType>()
        val allPlatformProductVersionCombinations = generatePlatformProductVersionCombinationsForAllDocs(deploy_env)
        for (combination in allPlatformProductVersionCombinations) {
            val (platform, product, version) = combination
            val recommendationsForTopicsBuildTypeInt = createRecommendationsForTopicsBuildType(
                GwDeployEnvs.INT.env_name,
                platform,
                product,
                version

            )
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

    private fun createRecommendationsForTopicsBuildType(
        deploy_env: String,
        gw_platform: String,
        gw_product: String,
        gw_version: String,
    ): BuildType {
        val pretrainedModelFile = "GoogleNews-vectors-negative300.bin"
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(deploy_env)

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
                            export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                            export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                            export AWS_DEFAULT_REGION="$awsDefaultRegion"
                            
                            echo "Downloading the pretrained model from the S3 bucket"
                            aws s3 cp s3://tenant-doctools-${deploy_env}-builds/recommendation-engine/${pretrainedModelFile} %teamcity.build.workingDir%/
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
                            export PRETRAINED_MODEL_FILE="$pretrainedModelFile"
                                                                    
                            recommendation_engine
                        """.trimIndent()
                    dockerImage = GwDockerImages.RECOMMENDATION_ENGINE_LATEST.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }
}

object Apps {
    val rootProject = createRootProjectForApps()

    private fun createRootProjectForApps(): Project {
        return Project {
            name = "Apps"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            createAppProjects().forEach {
                subProject(it)
            }
        }
    }

    // TODO: Test these builds after merge to master
    private fun createAppProjects(): List<Project> {
        return arrayOf(
            Triple("Flail SSG", "frontend/flail_ssg/", true),
            Triple("Config deployer", "apps/config_deployer", true),
            Triple("Doc crawler", "apps/doc_crawler", true),
            Triple("Index cleaner", "apps/index_cleaner", false),
            Triple("Build manager", "apps/build_manager", true),
            Triple("Recommendation engine", "apps/recommendation_engine", false),
            Triple("Lion pkg builder", "apps/lion_pkg_builder", false),
            Triple("Lion page builder", "apps/lion_page_builder", false),
            Triple("Upgrade diffs page builder", "apps/upgradediffs_page_builder", false),
            Triple("Sitemap generator", "apps/sitemap_generator", false)
        ).map {
            val appName = it.first
            val appDir = it.second
            val createTestBuild = it.third
            Project {
                name = appName
                id = Helpers.resolveRelativeIdFromIdString(this.name)

                if (createTestBuild) {
                    val testAppBuildType = createTestAppBuildType(appName, appDir)
                    val publishAppDockerImageBuildType =
                        createPublishAppDockerImageBuildType(appName, appDir, testAppBuildType)
                    buildType(publishAppDockerImageBuildType)
                    buildType(testAppBuildType)
                } else {
                    buildType(createPublishAppDockerImageBuildType(appName, appDir))
                }
            }
        }
    }

    private fun createPublishAppDockerImageBuildType(
        app_name: String,
        app_dir: String,
        dependent_build_type: BuildType? = null,
    ): BuildType {
        return BuildType {
            name = "Publish Docker image for $app_name"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Publish Docker image to Artifactory"
                    scriptContent = """
                        #!/bin/bash                        
                        set -xe
                        
                        cd $app_dir
                        ./publish_docker.sh latest       
                    """.trimIndent()
                }
            }
// FIXME: Reenable this line when the refactoring is done
//            triggers {
//                vcs {
//                    triggerRules = """
//                        +:${app_dir}/**
//                        -:user=doctools:**
//                    """.trimIndent()
//                }
//            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (dependent_build_type != null) {
                dependencies {
                    snapshot(dependent_build_type) {
                        reuseBuilds = ReuseBuilds.SUCCESSFUL
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }

    private fun createTestAppBuildType(app_name: String, app_dir: String): BuildType {
        return BuildType {
            name = "Test $app_name"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Run tests"
                    scriptContent = """
                        #!/bin/bash
                        set -xe

                        cd $app_dir
                        ./run_tests.sh
                    """.trimIndent()
                    dockerImage = GwDockerImages.PYTHON_3_9_SLIM_BUSTER.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }

            }
// FIXME: Reenable this line when the refactoring is done
//            triggers {
//                vcs {
//                    triggerRules = """
//                        +:${app_dir}/**
//                        -:user=doctools:**
//                    """.trimIndent()
//                }
//            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
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

    fun getBuildSourceConfigs(): List<JSONObject> {
        val srcIds = buildConfigs.map { it.getString("srcId") }.distinct()
        return srcIds.map { getObjectById(sourceConfigs, "id", it) }
    }

    val docConfigs = getObjectsFromAllConfigFiles("config/docs", "docs")
    val sourceConfigs = getObjectsFromAllConfigFiles("config/sources", "sources")
    val buildConfigs = getObjectsFromAllConfigFiles("config/builds", "builds")
    val gitNativeSources = getBuildSourceConfigs().filter {
        !it.has("xdocsPathIds")
    }

    fun getObjectById(objectList: List<JSONObject>, id_name: String, id_value: String): JSONObject {
        return objectList.find { it.getString(id_name) == id_value } ?: JSONObject()
    }

    fun removeSpecialCharacters(string_to_clean: String): String {
        val re = Regex("[^A-Za-z0-9]")
        return re.replace(string_to_clean, "")
    }

    fun resolveRelativeIdFromIdString(id: String): RelativeId {
        return RelativeId(removeSpecialCharacters(id))
    }

    fun createIdStringFromName(name: String): String {
        return name.uppercase(Locale.getDefault()).replace(" ", "_")
    }

    fun createFullGitBranchName(branch_name: String): String {
        return if (branch_name.contains("refs/")) {
            branch_name
        } else {
            "refs/heads/${branch_name}"
        }
    }

    fun getAwsSettings(deploy_env: String): Triple<String, String, String> {
        return when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> Triple(
                "%env.ATMOS_PROD_AWS_ACCESS_KEY_ID%",
                "%env.ATMOS_PROD_AWS_SECRET_ACCESS_KEY%",
                "%env.ATMOS_PROD_AWS_DEFAULT_REGION%"
            )
            else -> Triple(
                "%env.ATMOS_DEV_AWS_ACCESS_KEY_ID%",
                "%env.ATMOS_DEV_AWS_SECRET_ACCESS_KEY%",
                "%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
            )
        }
    }

    fun getS3BucketName(deploy_env: String): String {
        return "tenant-doctools-${deploy_env}-builds"
    }

    fun getAppBaseAndElasticsearchUrls(deploy_env: String): Pair<String, String> {
        return if (arrayOf(GwDeployEnvs.PROD.env_name, GwDeployEnvs.PORTAL2.env_name).contains(deploy_env)) {
            Pair("https://docs.guidewire.com", "https://docsearch-doctools.internal.us-east-2.service.guidewire.net")
        } else {
            Pair("https://docs.${deploy_env}.ccs.guidewire.net",
                "https://docsearch-doctools.${deploy_env}.ccs.guidewire.net")
        }
    }

}

object GwBuildSteps {
    object MergeDocsConfigFilesStep : ScriptBuildStep({
        name = "Merge docs config files"
        id = Helpers.createIdStringFromName(this.name)
        scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}"
            """.trimIndent()
        dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.image_url
        dockerImagePlatform = ImagePlatform.Linux
    })

    fun createGenerateDocsConfigFilesForEnvStep(deploy_env: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Generate config file for $deploy_env"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer deploy "${GwConfigParams.DOCS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}" --deploy-env $deploy_env
            """.trimIndent()
            dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunFlailSsgStep(
        pages_dir: String,
        output_dir: String,
        deploy_env: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run Flail SSG"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export PAGES_DIR="$pages_dir"
                export OUTPUT_DIR="$output_dir"
                export DOCS_CONFIG_FILE="${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}"
                export DEPLOY_ENV="$deploy_env"
                export SEND_BOUNCER_HOME="no"
                                
                flail_ssg
            """.trimIndent()
            dockerImage = GwDockerImages.FLAIL_SSG_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunLionPageBuilderStep(loc_docs_src: String, loc_docs_out: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the lion page builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export LOC_DOCS_SRC="$loc_docs_src"
                export LOC_DOCS_OUT="$loc_docs_out"
                
                lion_page_builder
            """.trimIndent()
            dockerImage = GwDockerImages.LION_PAGE_BUILDER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createCopyLocalizedPdfsToS3BucketStep(deploy_env: String, loc_docs_src: String): ScriptBuildStep {
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(deploy_env)
        return ScriptBuildStep {
            name = "Copy localized PDFs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                export AWS_DEFAULT_REGION="$awsDefaultRegion"
                        
                aws s3 sync "$loc_docs_src" s3://tenant-doctools-${deploy_env}-builds/l10n --exclude ".git/*" --delete
            """.trimIndent()
        }
    }

    fun createRunLionPkgBuilderStep(
        working_dir: String,
        output_dir: String,
        tc_build_type_id: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the lion pkg builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export TEAMCITY_API_ROOT_URL="https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/" 
                export TEAMCITY_API_AUTH_TOKEN="%env.TEAMCITY_API_ACCESS_TOKEN%"
                export TEAMCITY_RESOURCES_ARTIFACT_PATH="${GwConfigParams.BUILD_DATA_DIR.param_value}/${GwConfigParams.BUILD_DATA_FILE.param_value}"
                export ZIP_SRC_DIR="zip"
                export OUTPUT_PATH="$output_dir"
                export WORKING_DIR="$working_dir"
                export TC_BUILD_TYPE_ID="$tc_build_type_id"
                
                lion_pkg_builder
            """.trimIndent()
            dockerImage = GwDockerImages.LION_PKG_BUILDER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunUpgradeDiffsPageBuilderStep(
        deploy_env: String,
        upgrade_diffs_docs_src: String,
        upgrade_diffs_docs_out: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the upgrade diffs page builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export UPGRADEDIFFS_DOCS_SRC="$upgrade_diffs_docs_src"
                export UPGRADEDIFFS_DOCS_OUT="$upgrade_diffs_docs_out"
                export DEPLOY_ENV="$deploy_env"
                
                upgradediffs_page_builder
            """.trimIndent()
            dockerImage = GwDockerImages.UPGRADE_DIFFS_PAGE_BUILDER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createCopyUpgradeDiffsToS3BucketStep(deploy_env: String, upgrade_diffs_docs_src: String): ScriptBuildStep {
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(deploy_env)
        var awsS3SyncCommand =
            "aws s3 sync \"${upgrade_diffs_docs_src}\" s3://tenant-doctools-${deploy_env}-builds/upgradediffs --delete"
        if (arrayOf(GwDeployEnvs.STAGING.env_name, GwDeployEnvs.PROD.env_name).contains(deploy_env)) {
            awsS3SyncCommand += " --exclude \"*/*-rc/*\""
        }
        return ScriptBuildStep {
            name = "Copy upgrade diffs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                export AWS_DEFAULT_REGION="$awsDefaultRegion"
                        
                $awsS3SyncCommand
            """.trimIndent()
        }
    }

    fun createRunSitemapGeneratorStep(deploy_env: String, output_dir: String): ScriptBuildStep {
        val (appBaseUrl, elasticsearchUrls) = Helpers.getAppBaseAndElasticsearchUrls(deploy_env)
        return ScriptBuildStep {
            name = "Run the sitemap generator"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export OUTPUT_DIR="$output_dir"
                export APP_BASE_URL="$appBaseUrl"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                
                sitemap_generator
            """.trimIndent()
            dockerImage = GwDockerImages.SITEMAP_GENERATOR_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunIndexCleanerStep(deploy_env: String): ScriptBuildStep {
        val (_, elasticsearchUrls) = Helpers.getAppBaseAndElasticsearchUrls(deploy_env)
        val configFileUrl = when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json"
            else -> "https://ditaot.internal.${deploy_env}.ccs.guidewire.net/portal-config/config.json"
        }
        return ScriptBuildStep {
            name = "Run the index cleaner"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                export CONFIG_FILE_URL="$configFileUrl"
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"                
                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}CONFIG_FILE

                index_cleaner
            """.trimIndent()
            dockerImage = GwDockerImages.INDEX_CLEANER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createPublishServerDockerImageToEcrStep(package_name: String, tag_version: String): ScriptBuildStep {
        val ecrPackageName = "710503867599.dkr.ecr.us-east-2.amazonaws.com/tenant-doctools-docportal"
        return ScriptBuildStep {
            name = "Publish server Docker Image to ECR"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                set -xe
                
                docker pull ${package_name}:${tag_version}
                docker tag ${package_name}:${tag_version} ${ecrPackageName}:${tag_version}
                eval ${'$'}(aws ecr get-login --no-include-email | sed 's|https://||')
                docker push ${ecrPackageName}:${tag_version}
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
    }

    fun createBuildAndPublishServerDockerImageStep(
        package_name: String,
        tag_version: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Build and publish server Docker Image"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash 
                set -xe
                
                docker build -t ${package_name}:${tag_version} ./server --build-arg tag_version=${tag_version}
                docker push ${package_name}:${tag_version}
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
    }

    fun createRunDocCrawlerStep(deploy_env: String, doc_id: String, config_file: String): ScriptBuildStep {
        val docS3Url: String = when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> {
                "https://ditaot.internal.us-east-2.service.guidewire.net"
            }
            GwDeployEnvs.PORTAL2.env_name -> {
                "https://portal2.internal.us-east-2.service.guidewire.net"
            }
            else -> {
                "https://ditaot.internal.${deploy_env}.ccs.guidewire.net"
            }
        }
        val (appBaseUrl, elasticsearchUrls) = Helpers.getAppBaseAndElasticsearchUrls(deploy_env)

        return ScriptBuildStep {
            name = "Run the doc crawler"
            id = Helpers.createIdStringFromName(this.name)
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
            dockerImage = GwDockerImages.DOC_CRAWLER_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createGetConfigFileStep(deploy_env: String, config_file: String): ScriptBuildStep {

        val configFileUrl =
            if (arrayListOf(GwDeployEnvs.PROD.env_name, GwDeployEnvs.PORTAL2.env_name).contains(deploy_env)) {
                "https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json"
            } else {
                "https://ditaot.internal.${deploy_env}.ccs.guidewire.net/portal-config/config.json"
            }

        return ScriptBuildStep {
            name = "Get config file"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="$config_file"
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                export CONFIG_FILE_URL="$configFileUrl"
                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                
                if [[ "$deploy_env" == "${GwDeployEnvs.PROD.env_name}" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > ${'$'}CONFIG_FILE                 
                elif [[ "$deploy_env" == "${GwDeployEnvs.PORTAL2.env_name}" ]]; then
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
            id = Helpers.createIdStringFromName(this.name)

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
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(GwDeployEnvs.PROD.env_name)
        return ScriptBuildStep {
            name = "Copy from S3 on staging to S3 on Prod"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Copying from staging to Teamcity"
                    aws s3 sync s3://tenant-doctools-staging-builds/${publish_path} ${publish_path}/ --delete
                    
                    echo "Setting credentials to access prod"
                    export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                    export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                    export AWS_DEFAULT_REGION="$awsDefaultRegion"
                    
                    echo "Uploading from Teamcity to prod"
                    aws s3 sync ${publish_path}/ s3://tenant-doctools-prod-builds/${publish_path} --delete
                """.trimIndent()
        }
    }

    fun createCopyPdfFromOnlineToOfflineOutputStep(
        online_output_path: String,
        offline_output_path: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Copy PDF from online to offline output"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                cp -avR "${online_output_path}/pdf" "$offline_output_path"
                """.trimIndent()
        }
    }

    fun createZipPackageStep(
        input_path: String, target_path: String,
    ): ScriptBuildStep {
        val zipPackageName = "docs.zip"

        return ScriptBuildStep {
            name = "Build a ZIP package"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Creating a ZIP package"
                cd "$input_path"
                zip -r "${target_path}/${zipPackageName}" * &&
                rm -rf "$input_path"
            """.trimIndent()
        }
    }

    fun createUploadContentToS3BucketStep(
        deploy_env: String, output_path: String, publish_path: String,
    ): ScriptBuildStep {
        val s3BucketName = "tenant-doctools-${deploy_env}-builds"
        return ScriptBuildStep {
            name = "Upload content to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    aws s3 sync "$output_path" s3://${s3BucketName}/${publish_path} --delete
                """.trimIndent()
        }
    }

    fun createPreviewUrlFile(
        publish_path: String, preview_url_file: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Create preview URL file"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Output preview available at https://docs.int.ccs.guidewire.net/${publish_path}" > $preview_url_file
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
            id = Helpers.createIdStringFromName(this.name)
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
        output_dir: String,
        dita_ot_logs_dir: String,
        normalized_dita_dir: String,
        schematron_reports_dir: String,
        build_filter: String = "",
        index_redirect: Boolean = false,
    ): ScriptBuildStep {
        val logFile = "${output_format}_build.log"
        val fullOutputPath = "${output_dir}/${output_format}"
        var ditaBuildCommand =
            "dita -i \"${working_dir}/${root_map}\" -o \"${working_dir}/${fullOutputPath}\" -l \"${working_dir}/${logFile}\""
        var resourcesCopyCommand = ""

        if (build_filter.isNotEmpty()) {
            ditaBuildCommand += " --filter \"${working_dir}/${build_filter}\""
        }

        when (output_format) {
            // --git-url and --git-branch are required by the DITA OT plugin to generate build data.
            // There are not needed in this build, so they have fake values
            GwDitaOutputFormats.WEBHELP.format_name -> {
                ditaBuildCommand += " -f webhelp_Guidewire --generate.build.data yes --git.url gitUrl --git.branch gitBranch"
                if (index_redirect) {
                    ditaBuildCommand += " --create-index-redirect yes --webhelp.publication.toc.links all"
                }
            }
            GwDitaOutputFormats.DITA.format_name -> {
                ditaBuildCommand += " -f gw_dita"
                resourcesCopyCommand =
                    "&& mkdir -p \"${working_dir}/${normalized_dita_dir}\" && cp -R \"${working_dir}/${fullOutputPath}/\"* \"${working_dir}/${normalized_dita_dir}/\""
            }
            GwDitaOutputFormats.VALIDATE.format_name -> {
                val tempDir = "tmp/${output_format}"
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
                export EXIT_CODE=0
                $ditaBuildCommand $resourcesCopyCommand || EXIT_CODE=${'$'}?
                mkdir -p "${working_dir}/${dita_ot_logs_dir}" || EXIT_CODE=${'$'}?
                cp "${working_dir}/${logFile}" "${working_dir}/${dita_ot_logs_dir}/" || EXIT_CODE=${'$'}?
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = GwDockerImages.DITA_OT_LATEST.image_url
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
            GwDitaOutputFormats.WEBHELP.format_name -> {
                ditaBuildCommand += if (for_offline_use) " -f webhelp_Guidewire" else " -f webhelp_Guidewire_validate"
            }
            GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name -> {
                ditaBuildCommand += " -f wh-pdf --dita.ot.pdf.format pdf5_Guidewire"
            }
            GwDitaOutputFormats.PDF.format_name -> {
                ditaBuildCommand += " -f pdf_Guidewire_remote"
            }
        }


        if (arrayOf(GwDitaOutputFormats.WEBHELP.format_name, GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name).contains(
                output_format) && index_redirect
        ) {
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
            dockerImage = GwDockerImages.DITA_OT_LATEST.image_url
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
        custom_env: JSONArray?,
    ): ScriptBuildStep {
        val nodeImageVersion = node_image_version ?: "12.14.1"
        val buildCommand = build_command ?: "build"
        val targetUrl =
            if (deploy_env == GwDeployEnvs.PROD.env_name) "https://docs.guidewire.com" else "https://docs.${deploy_env}.ccs.guidewire.net"

        var customEnvExportVars = ""
        custom_env?.forEach {
            it as JSONObject
            customEnvExportVars += "export ${it.getString("name")}=\"${it.getString("value")}\" # Custom env from the build config file\n"
        }

        return ScriptBuildStep {
            name = "Build the yarn project"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export DEPLOY_ENV="$deploy_env"
                    export GW_DOC_ID="$doc_id"
                    export GW_PRODUCT="$gw_products"
                    export GW_PLATFORM="$gw_platforms"
                    export GW_VERSION="$gw_versions"
                    export TARGET_URL="$targetUrl"
                    export BASE_URL="/${publish_path}/"
                    $customEnvExportVars
                    
                    # legacy Jutro repos
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-npm-dev -s @jutro
                    npm config set @jutro:registry https://artifactory.guidewire.com/api/npm/jutro-npm-dev/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/globalization-npm-release -s @gwre-g11n
                    npm config set @gwre-g11n:registry https://artifactory.guidewire.com/api/npm/globalization-npm-release/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/elixir -s @elixir
                    npm config set @elixir:registry https://artifactory.guidewire.com/api/npm/elixir/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev -s @gtui
                    npm config set @gtui:registry https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev/
                                        
                    # new Jutro proxy repo
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
                    npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/

                    # Doctools repo
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://artifactory.guidewire.com/api/npm/doctools-npm-dev/
                                        
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

    fun createBuildStorybookProjectStep(
        deploy_env: String,
        publish_path: String,
        doc_id: String,
        gw_products: String,
        gw_platforms: String,
        gw_versions: String,
        working_dir: String,
        custom_env: JSONArray?,
    ): ScriptBuildStep {
        val targetUrl =
            if (deploy_env == GwDeployEnvs.PROD.env_name) "https://docs.guidewire.com" else "https://docs.${deploy_env}.ccs.guidewire.net"

        var customEnvExportVars = ""
        custom_env?.forEach {
            it as JSONObject
            customEnvExportVars += "export ${it.getString("name")}=\"${it.getString("value")}\" # Custom env from the build config file\n"
        }

        return ScriptBuildStep {
            name = "Build the Storybook project"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export DEPLOY_ENV="$deploy_env"
                    export GW_DOC_ID="$doc_id"
                    export GW_PRODUCT="$gw_products"
                    export GW_PLATFORM="$gw_platforms"
                    export JUTRO_VERSION="$gw_versions"
                    export TARGET_URL="$targetUrl"
                    export BASE_URL="/${publish_path}/"
                    $customEnvExportVars
                    
                    # legacy Jutro repos
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-npm-dev -s @jutro
                    npm config set @jutro:registry https://artifactory.guidewire.com/api/npm/jutro-npm-dev/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/globalization-npm-release -s @gwre-g11n
                    npm config set @gwre-g11n:registry https://artifactory.guidewire.com/api/npm/globalization-npm-release/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/elixir -s @elixir
                    npm config set @elixir:registry https://artifactory.guidewire.com/api/npm/elixir/
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev -s @gtui
                    npm config set @gtui:registry https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev/
                                        
                    # new Jutro proxy repo
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
                    npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/

                    # Doctools repo
                    npm-cli-login -u "%env.SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://artifactory.guidewire.com/api/npm/doctools-npm-dev/
                                        
                    cd "$working_dir"
                    yarn
                    NODE_OPTIONS=--max_old_space_size=4096 CI=true yarn build
                """.trimIndent()
            dockerImage = GwDockerImages.GENERIC_14_14_0_YARN_CHROME.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
        }
    }

    fun createZipUpSourcesStep(input_path: String, output_dir: String, zip_filename: String): ScriptBuildStep {
        val zipPackageName = "${zip_filename}.zip"
        return ScriptBuildStep {
            name = "Zip up sources"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                cd "$input_path"
                zip -r "$zipPackageName" . -x '*.git*'
                zip -r "$zipPackageName" .gitignore
                mkdir "$output_dir"
                mv "$zipPackageName" "$output_dir/${zipPackageName}"
            """.trimIndent()
        }
    }

    fun createRunBuildManagerStep(
        teamcity_affected_project: String,
        teamcity_template: String,
        git_url: String,
        git_branch: String,
        teamcity_build_branch: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the build manager"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CHANGED_FILES_FILE="%system.teamcity.build.changedFiles.file%"
                export TEAMCITY_API_ROOT_URL="https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/" 
                export TEAMCITY_API_AUTH_TOKEN="%env.TEAMCITY_API_ACCESS_TOKEN%"
                export TEAMCITY_RESOURCES_ARTIFACT_PATH="${GwConfigParams.BUILD_DATA_DIR.param_value}/${GwConfigParams.BUILD_DATA_FILE.param_value}"
                export TEAMCITY_AFFECTED_PROJECT="$teamcity_affected_project"
                export TEAMCITY_TEMPLATE="$teamcity_template"
                export GIT_URL="$git_url"
                export GIT_BRANCH="$git_branch"
                export TEAMCITY_BUILD_BRANCH="$teamcity_build_branch"
                                                        
                build_manager
            """.trimIndent()
            dockerImage = GwDockerImages.BUILD_MANAGER_LATEST.image_url
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
        val docInfoFileFullPath = "${working_dir}/${doc_info_file}"
        return ScriptBuildStep {
            name = "Run the doc validator"
            id = Helpers.createIdStringFromName(this.name)
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export ELASTICSEARCH_URLS="https://docsearch-doctools.int.ccs.guidewire.net"
                
                doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$docInfoFileFullPath" validators "${working_dir}/${normalized_dita_dir}" dita \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$docInfoFileFullPath" validators "${working_dir}/${normalized_dita_dir}" images \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$docInfoFileFullPath" validators "${working_dir}/${normalized_dita_dir}" files \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$docInfoFileFullPath" extractors "${working_dir}/${dita_ot_logs_dir}" dita-ot-logs \
                  && doc_validator --elasticsearch-urls "${'$'}ELASTICSEARCH_URLS" --doc-info "$docInfoFileFullPath" extractors "${working_dir}/${schematron_reports_dir}" schematron-reports
            """.trimIndent()
            dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createDeployFilesToPersistentVolumeStep(
        deploy_env: String,
        deployment_mode: String,
        output_dir: String,
    ): ScriptBuildStep {
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = Helpers.getAwsSettings(deploy_env)
        return ScriptBuildStep {
            name = "Deploy files to persistent volume"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash 
                set -xe
                
                export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
                export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
                export AWS_DEFAULT_REGION="$awsDefaultRegion"
                export DEPLOY_ENV="$deploy_env"
                
                sh %teamcity.build.workingDir%/ci/deployFilesToPersistentVolume.sh $deployment_mode "$output_dir"
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_0_12_24.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerPull = true
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }
}

object GwProjectFeatures {
    object GwOxygenWebhelpLicenseProjectFeature : ProjectFeature({
        type = "JetBrains.SharedResources"
        id = "GW_OXYGEN_WEBHELP_LICENSE"
        param("quota", "3")
        param("name", "OxygenWebhelpLicense")
        param("type", "quoted")
    })
}

object GwBuildFeatures {
    object GwDockerSupportBuildFeature : DockerSupportFeature({
        id = "GW_DOCKER_SUPPORT"
        loginToRegistry = on {
            dockerRegistryId = "PROJECT_EXT_155"
        }
    })

    object GwSshAgentBuildFeature : SshAgent({
        teamcitySshKey = "sys-doc.rsa"
    })

    object GwOxygenWebhelpLicenseBuildFeature : BuildFeature({
        id = "GW_OXYGEN_WEBHELP_LICENSE_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "OxygenWebhelpLicense readLock")
    })

    object GwCommitStatusPublisherBuildFeature : CommitStatusPublisher({
        publisher = bitbucketServer {
            url = "https://stash.guidewire.com"
            userName = "%env.SERVICE_ACCOUNT_USERNAME%"
            password =
                "%env.BITBUCKET_ACCESS_TOKEN%"
        }
    })

    fun createGwPullRequestsBuildFeature(target_git_branch: String): PullRequests {
        return PullRequests {
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = password {
                    username = "%env.SERVICE_ACCOUNT_USERNAME%"
                    password =
                        "%env.BITBUCKET_ACCESS_TOKEN%"
                }
                filterTargetBranch = "+:${target_git_branch}"
            }
        }
    }
}

object GwVcsRoots {
    val DocumentationPortalGitVcsRoot =
        createGitVcsRoot(
            Helpers.resolveRelativeIdFromIdString("Documentation Portal"),
            "ssh://git@stash.guidewire.com/doctools/documentation-portal.git",
            "master",
            listOf("(refs/heads/*)")

        )

    val XdocsClientGitVcsRoot =
        createGitVcsRoot(
            Helpers.resolveRelativeIdFromIdString("XDocs Client"),
            "ssh://git@stash.guidewire.com/doctools/xdocs-client.git",
            "master"
        )

    val LocalizedPdfsGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("Localized PDFs"),
        "ssh://git@stash.guidewire.com/docsources/localization-pdfs.git",
        "main"
    )

    val UpgradeDiffsGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("Upgrade diffs"),
        "ssh://git@stash.guidewire.com/docsources/upgradediffs.git",
        "main",
    )

    private fun createGitVcsRoot(
        vcs_root_id: RelativeId,
        git_url: String,
        default_branch: String,
        monitored_branches: List<String> = emptyList(),
    ): GitVcsRoot {
        return GitVcsRoot {
            name = vcs_root_id.toString()
            id = vcs_root_id
            url = git_url
            branch = Helpers.createFullGitBranchName(default_branch)
            authMethod = uploadedKey {
                uploadedKey = "sys-doc.rsa"
            }
            checkoutPolicy = GitVcsRoot.AgentCheckoutPolicy.USE_MIRRORS

            if (monitored_branches.isNotEmpty()) {
                branchSpec = ""
                monitored_branches.forEach {
                    branchSpec += "+:${Helpers.createFullGitBranchName(it)}\n"
                }
            }
        }
    }

    fun createGitVcsRootsFromConfigFiles(): List<GitVcsRoot> {
        return Helpers.getBuildSourceConfigs().map {
            val gitUrl = it.getString("gitUrl")
            val defaultBranch = it.getString("branch")
            val vcsRootId = Helpers.resolveRelativeIdFromIdString(it.getString("id"))
            createGitVcsRoot(vcsRootId, gitUrl, defaultBranch)
        }
    }
}

object GwVcsSettings {
    fun createBranchFilter(git_branches: List<String>, add_default_branch: Boolean = true): String {
        val gitBranchesEntries = mutableListOf<String>()
        if (add_default_branch) gitBranchesEntries.add("+:<default>")
        git_branches.forEach {
            gitBranchesEntries.add("+:${Helpers.createFullGitBranchName(it)}")
        }
        return gitBranchesEntries.joinToString("\n")
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


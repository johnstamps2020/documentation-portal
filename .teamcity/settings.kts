import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.buildSteps.*
import jetbrains.buildServer.configs.kotlin.triggers.ScheduleTrigger
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import jetbrains.buildServer.configs.kotlin.ui.add
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.*

version = "2022.04"

project {

    GwVcsRoots.createGitVcsRootsFromConfigFiles().forEach {
        vcsRoot(it)
    }
    vcsRoot(GwVcsRoots.DocumentationPortalGitVcsRoot)
    subProject(Runners.rootProject)
    subProject(Docs.rootProject)
    subProject(Sources.rootProject)
    subProject(Recommendations.rootProject)
    subProject(Content.rootProject)
    subProject(BuildListeners.rootProject)
    subProject(Exports.rootProject)
    subProject(Apps.rootProject)
    subProject(Server.rootProject)
    subProject(Frontend.rootProject)
    subProject(Custom.rootProject)

    features.feature(GwProjectFeatures.GwOxygenWebhelpLicenseProjectFeature)
    features.feature(GwProjectFeatures.GwAntennaHouseFormatterServerProjectFeature)
    features.feature(GwProjectFeatures.GwBuildListenerLimitProjectFeature)
}

enum class GwDeployEnvs(val env_name: String) {
    DEV("dev"),
    INT("int"),
    STAGING("staging"),
    PROD("prod"),
    OMEGA2_ANDROMEDA("omega2-andromeda"),
    PORTAL2("portal2")
}

enum class GwBuildTypes(val build_type_name: String) {
    DITA("dita"),
    YARN("yarn"),
    STORYBOOK("storybook"),
    SOURCE_ZIP("source-zip"),
    JUST_COPY("just-copy")
}

enum class GwValidationModules(val validation_name: String) {
    VALIDATORS_DITA("validators_dita"),
    VALIDATORS_FILES("validators_files"),
    VALIDATORS_IMAGES("validators_images"),
    EXTRACTORS_DITA_OT_LOGS("extractors_dita_ot_logs"),
    EXTRACTORS_SCHEMATRON_REPORTS("extractors_schematron_reports")
}

enum class GwDitaOutputFormats(val format_name: String) {
    WEBHELP("webhelp"),
    PDF("pdf"),
    WEBHELP_WITH_PDF("webhelp_with_pdf"),
    SINGLEHTML("singlehtml"),
    DITA("dita"),
    HTML5("html5")
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
    BUILD_DATA_FILE("build-data.json"),
    COMMON_GW_DITAVALS_DIR("common_gw_ditavals"),
    BITBUCKET_SSH_KEY("svc-doc-bitbucket"),
    ECR_HOST("627188849628.dkr.ecr.us-west-2.amazonaws.com"),
    ECR_HOST_PROD("954920275956.dkr.ecr.us-east-1.amazonaws.com"),
    ARTIFACTORY_HOST("artifactory.guidewire.com")
}

enum class GwDockerImages(val image_url: String) {
    DOC_PORTAL("${GwConfigParams.ECR_HOST.param_value}/tenant-doctools-docportal"),
    DOC_PORTAL_PROD("${GwConfigParams.ECR_HOST_PROD.param_value}/tenant-doctools-docportal"),
    DITA_OT_3_4_1("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/dita-ot:3.4.1"),
    DITA_OT_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/dita-ot:latest"),
    ATMOS_DEPLOY_2_6_0("${GwConfigParams.ARTIFACTORY_HOST.param_value}/devex-docker-dev/atmosdeploy:2.6.0"),
    CONFIG_DEPLOYER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/config-deployer:latest"),
    DOC_CRAWLER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/doc-crawler:latest"),
    INDEX_CLEANER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/index-cleaner:latest"),
    BUILD_MANAGER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/build-manager:latest"),
    RECOMMENDATION_ENGINE_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/recommendation-engine:latest"),
    FLAIL_SSG_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/flail-ssg:latest"),
    LION_PKG_BUILDER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/lion-pkg-builder:latest"),
    LION_PAGE_BUILDER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/lion-page-builder:latest"),
    UPGRADE_DIFFS_PAGE_BUILDER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/upgradediffs-page-builder:latest"),
    SITEMAP_GENERATOR_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/sitemap-generator:latest"),
    DOC_VALIDATOR_LATEST("${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/doc-validator:latest"),
    PYTHON_3_9_SLIM_BUSTER("${GwConfigParams.ARTIFACTORY_HOST.param_value}/hub-docker-remote/python:3.9-slim-buster"),
    NODE_REMOTE_BASE("${GwConfigParams.ARTIFACTORY_HOST.param_value}/hub-docker-remote/node"),
    NODE_16_14_2("${GwConfigParams.ARTIFACTORY_HOST.param_value}/hub-docker-remote/node:16.14.2"),
    GENERIC_14_14_0_YARN_CHROME("${GwConfigParams.ARTIFACTORY_HOST.param_value}/jutro-docker-dev/generic:14.14.0-yarn-chrome")
}

enum class GwExportFrequencies(val param_value: String) {
    DAILY("daily"),
    WEEKLY("weekly")
}

enum class GwStaticFilesModes(val mode_name: String) {
    LANDING_PAGES("landing_pages"),
    LOCALIZED_PAGES("localized_pages"),
    UPGRADE_DIFFS("upgrade_diffs"),
    SITEMAP("sitemap"),
    HTML5("html5")
}

enum class GwConfigTypes(val type_name: String) {
    DOCS("docs"),
    SOURCES("sources"),
    BUILDS("builds")
}

object Runners {
    val rootProject = createRootProjectForRunners()

    private fun getDocConfigsFromBuildConfigsForEnv(deploy_env: String): List<JSONObject> {
        val docConfigsForEnv = mutableListOf<JSONObject>()
        Helpers.buildConfigs.forEach {
            val docId = it.getString("docId")
            val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
            val docEnvironments = docConfig.getJSONArray("environments")
            if (docEnvironments.contains(deploy_env)) {
                docConfigsForEnv.add(docConfig)
            }
        }
        return docConfigsForEnv
    }

    private fun getDocIdsForProductAndVersion(
        doc_configs: List<JSONObject>,
        gw_product: String,
        gw_version: String,
    ): List<String> {
        val matchingDocIds = mutableListOf<String>()
        doc_configs.forEach {
            val docId = it.getString("id")
            val metadata = it.getJSONObject("metadata")
            val gwProducts = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("product"))
            val gwVersions = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("version"))
            val docConfigMatchesProductAndVersion =
                gwProducts.any { p -> p == gw_product } && gwVersions.any { v -> v == gw_version }
            if (docConfigMatchesProductAndVersion) {
                matchingDocIds.add(docId)
            }
        }
        return matchingDocIds
    }


    private fun createRootProjectForRunners(): Project {
        return Project {
            name = "Runners"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV.env_name,
                GwDeployEnvs.INT.env_name,
                GwDeployEnvs.STAGING.env_name,
                GwDeployEnvs.PROD.env_name
            ).map {
                subProject(createRunnersProjectForEnv(it))
            }
        }
    }

    private fun createRunnersProjectForEnv(deploy_env: String): Project {
        val docConfigsForEnv = getDocConfigsFromBuildConfigsForEnv(deploy_env)
        val productProjects = generateProductProjects(deploy_env, docConfigsForEnv)
        return Project {
            name = "Runners for $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            productProjects.forEach { pp ->
                pp.subProjects.forEach { vp ->
                    val gwProduct = pp.name
                    val gwVersion = vp.name
                    val matchingDocIds = getDocIdsForProductAndVersion(docConfigsForEnv, gwProduct, gwVersion)
                    if (matchingDocIds.size > 1) {
                        val publishAllDocsBuildType = createRunnerBuildType(
                            deploy_env,
                            matchingDocIds, "Publish all docs",
                            gwProduct,
                            gwVersion
                        )
                        vp.buildType(publishAllDocsBuildType)
                    }
                }
                subProject(pp)
            }
        }
    }

    private fun generateProductProjects(deploy_env: String, doc_configs: List<JSONObject>): List<Project> {
        val productProjects = mutableListOf<Project>()
        for (docConfig in doc_configs) {
            val docId = docConfig.getString("id")
            val docTitle = docConfig.getString("title")
            val metadata = docConfig.getJSONObject("metadata")
            val gwProducts = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("product"))
            val gwVersions = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("version"))
            for (gwProduct in gwProducts) {
                val existingProductProject = productProjects.find { it.name == gwProduct }
                if (existingProductProject == null) {
                    productProjects.add(Project {
                        name = gwProduct
                        id = Helpers.resolveRelativeIdFromIdString("${this.name}${deploy_env}")

                        gwVersions.forEach {
                            subProject {
                                name = it
                                id = Helpers.resolveRelativeIdFromIdString("${this.name}${gwProduct}${deploy_env}")

                                buildType(createRunnerBuildType(deploy_env, listOf(docId), docTitle, gwProduct, it))
                            }
                        }
                    })
                } else {
                    for (gwVersion in gwVersions) {
                        val runnerBuildType =
                            createRunnerBuildType(deploy_env, listOf(docId), docTitle, gwProduct, gwVersion)
                        val existingVersionSubproject =
                            existingProductProject.subProjects.find { it.name == gwVersion }
                        if (existingVersionSubproject == null) {
                            existingProductProject.subProject {
                                name = gwVersion
                                id = Helpers.resolveRelativeIdFromIdString("${this.name}${gwProduct}${deploy_env}")

                                buildType(runnerBuildType)
                            }
                        } else {
                            existingVersionSubproject.buildType(runnerBuildType)
                        }
                    }
                }
            }
        }
        return productProjects
    }

    private fun createRunnerBuildType(
        deploy_env: String,
        doc_ids: List<String>,
        doc_title: String,
        gw_product: String,
        gw_version: String,
    ): BuildType {
        return BuildType {
            name = doc_title
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${deploy_env}${gw_product}${gw_version}")

            type = BuildTypeSettings.Type.COMPOSITE

            dependencies {
                doc_ids.forEach {
                    snapshot(Helpers.resolveRelativeIdFromIdString("Publish to ${deploy_env}${it}")) {
                        // Build runners reuse doc builds to avoid unnecessary build runs.
                        // This feature can't be used in runners for prod doc builds because the prod doc builds
                        // don’t use a VCS Root - they only copy from staging to prod.
                        // Therefore, runners can’t discover any changes in the VCS Root from which the staging output
                        // was built and as a result they don’t trigger the dependent doc build for prod.
                        if (deploy_env == GwDeployEnvs.PROD.env_name) {
                            reuseBuilds = ReuseBuilds.NO
                        }
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }

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
                    name = "Build standalone output"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        ./build_standalone.sh
                        """.trimIndent()
                }
                script {
                    name = "Run the post-build yarn script"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                    
                        cd "postbuilder"
                        yarn install
                        export EXIT_CODE=0
                        yarn build || EXIT_CODE=${'$'}?
                        exit ${'$'}EXIT_CODE
                    """.trimIndent()
                    dockerImage = "${GwDockerImages.NODE_REMOTE_BASE.image_url}:17.6.0"
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "--user 1000:1000"
                }
                script {
                    name = "Build and publish Docker image"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                        set -xe
                        
                        export PACKAGE_NAME="gccwebhelp"
                        export IMAGE_URL="${GwConfigParams.ARTIFACTORY_HOST.param_value}/doctools-docker-dev/${'$'}PACKAGE_NAME:%DOC_VERSION%"
                        
                        docker build -t ${'$'}PACKAGE_NAME .
                        docker tag ${'$'}PACKAGE_NAME ${'$'}IMAGE_URL
                        docker push ${'$'}IMAGE_URL
                        """.trimIndent()
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
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
            if (env == GwDeployEnvs.PROD.env_name) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
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
            }
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
            if (env == GwDeployEnvs.PROD.env_name) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
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
            }
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

            if (env == GwDeployEnvs.PROD.env_name) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                val zipUpSourcesBuildStep = GwBuildSteps.createZipUpSourcesStep(
                    working_dir,
                    output_dir,
                    zip_filename
                )
                docBuildType.steps.step(zipUpSourcesBuildStep)
                docBuildType.steps.stepsOrder.add(0, zipUpSourcesBuildStep.id.toString())
            }
            sourceZipBuildTypes.add(docBuildType)
        }
        return sourceZipBuildTypes
    }

    private fun createJustCopyBuildTypes(
        env_names: List<String>, doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        output_dir: String,
    ): List<BuildType> {
        val justCopyBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publish_path)
            if (env == GwDeployEnvs.PROD.env_name) {
                val docBuildType = createInitialDocBuildType(
                    GwBuildTypes.JUST_COPY.build_type_name,
                    env,
                    doc_id,
                    src_id,
                    publish_path,
                    working_dir,
                    output_dir,
                    false
                )
                docBuildType.steps.step(copyFromStagingToProdStep)
                justCopyBuildTypes.add(docBuildType)
            }
        }

        return justCopyBuildTypes
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
        doc_title: String,
        index_for_search: Boolean,
        root_map: String,
        index_redirect: Boolean,
        build_filter: String?,
        gw_platforms: String,
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
                val buildPdfs = when (env) {
                    GwDeployEnvs.STAGING.env_name -> true
                    else -> false
                }
                val buildOutputForOfflineUse =
                    env == GwDeployEnvs.STAGING.env_name && gw_platforms.lowercase(Locale.getDefault())
                        .contains("self-managed")
                // Limit the number of HTML5 builds on staging not to overwhelm the PDF server
                if (env == GwDeployEnvs.STAGING.env_name) {
                    docBuildType.features.feature(GwBuildFeatures.GwAntennaHouseFormatterServerBuildFeature)
                }
                buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                    GwDitaOutputFormats.HTML5.format_name,
                    root_map,
                    index_redirect,
                    working_dir,
                    output_dir,
                    publish_path,
                    build_filter = build_filter,
                    doc_id = doc_id,
                    doc_title = doc_title,
                    git_url = git_url,
                    git_branch = git_branch,
                    build_pdfs = buildPdfs
                )
                if (buildOutputForOfflineUse) {
                    docBuildType.features.feature(GwBuildFeatures.GwOxygenWebhelpLicenseBuildFeature)
                    val localOutputDir = "${output_dir}/zip"
                    val buildDitaProjectForOfflineUseStep =
                        GwBuildSteps.createBuildDitaProjectForBuildsStep(
                            GwDitaOutputFormats.WEBHELP.format_name,
                            root_map,
                            index_redirect,
                            working_dir,
                            localOutputDir,
                            publish_path,
                            build_filter = build_filter,
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

        val localOutputDir = "${output_dir}/zip"
        val downloadableOutputBuildType = BuildType {
            name = "Build downloadable output"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${doc_id}")

            params {
                select(
                    "OUTPUT_FORMAT",
                    "",
                    "Output format",
                    options = listOf(
                        "Webhelp" to GwDitaOutputFormats.WEBHELP.format_name,
                        "PDF" to GwDitaOutputFormats.PDF.format_name,
                        "Webhelp with PDF" to GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name,
                        "Single-page HTML" to GwDitaOutputFormats.SINGLEHTML.format_name
                    ),
                    display = ParameterDisplay.PROMPT,
                )
            }

            artifactRules = "${working_dir}/${output_dir} => /"

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }

            steps {
                for (format in arrayListOf(
                    GwDitaOutputFormats.WEBHELP.format_name,
                    GwDitaOutputFormats.PDF.format_name,
                    GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name,
                    GwDitaOutputFormats.SINGLEHTML.format_name
                )) {
                    val step = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        format,
                        root_map,
                        index_redirect,
                        working_dir,
                        localOutputDir,
                        publish_path = "",
                        build_filter = build_filter,
                        git_url = git_url,
                        git_branch = git_branch,
                        for_offline_use = true
                    )
                    step.conditions {
                        equals("OUTPUT_FORMAT", format)
                    }
                    step(step)
                }
                step(
                    GwBuildSteps.createZipPackageStep(
                        "${working_dir}/${localOutputDir}",
                        "${working_dir}/${output_dir}"
                    )
                )
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
        ditaBuildTypes.add(downloadableOutputBuildType)


        if (env_names.contains(GwDeployEnvs.STAGING.env_name)) {
            val stagingBuildTypeIdString =
                Helpers.resolveRelativeIdFromIdString("Publish to ${GwDeployEnvs.STAGING.env_name}${doc_id}").toString()
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

                steps {
                    step(
                        GwBuildSteps.createRunLionPkgBuilderStep(
                            working_dir,
                            output_dir,
                            stagingBuildTypeIdString
                        )
                    )
                    script {
                        name = "Add build data"
                        scriptContent = """
                            #!/bin/bash
                            set -xe

                            mkdir _builds
                            jq -n '{"root": "$root_map", "filter": "$build_filter"}' > _builds/$doc_id.json
                            zip -ur $working_dir/$output_dir/l10n_package.zip _builds 
                        """.trimIndent()
                        dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    }
                }

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
            maxRunningBuilds = 1

            if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name, GwDeployEnvs.STAGING.env_name).contains(
                    deploy_env
                )
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
                artifactRules = """
                    %teamcity.build.workingDir%/*.log => build_logs
                """.trimIndent()
                val configFile = "%teamcity.build.workingDir%/config.json"
                val configFileStep = GwBuildSteps.createGetConfigFileStep(deploy_env, configFile)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = GwBuildSteps.createRunDocCrawlerStep(deploy_env, doc_id, configFile)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }

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
                        triggers.vcs {
                            triggerRules = Helpers.getNonDitaTriggerRules(working_dir)
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
        val workingDir = Helpers.getWorkingDir(build_config)
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
                        null
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
                    docTitle,
                    indexForSearch,
                    rootMap,
                    indexRedirect,
                    buildFilter,
                    gwPlatformsString,
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

            GwBuildTypes.JUST_COPY.build_type_name -> {
                docProjectBuildTypes += createJustCopyBuildTypes(
                    docEnvironmentsList,
                    docId,
                    src_id,
                    publishPath,
                    workingDir,
                    outputDir
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

object Custom {
    val rootProject = createRootProjectForCustom()

    private fun createRootProjectForCustom(): Project {
        return Project {
            name = "Custom"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            buildType(BuildCustomDitaOutputBuildType)
        }
    }

    object BuildCustomDitaOutputBuildType : BuildType({
        name = "Build custom DITA output"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        params {
            text(
                "env.GIT_URL",
                "",
                label = "Git repo URL",
                display = ParameterDisplay.PROMPT
            )
            text(
                "env.GIT_BRANCH",
                "",
                label = "Git branch name",
                display = ParameterDisplay.PROMPT
            )
            text(
                "env.DOC_IDS",
                "",
                label = "Document ids",
                description = "An optional space-separated list of document ids. Each id must have a corresponding <docID>.json file in the __builds folder of the target repo and branch.",
                display = ParameterDisplay.PROMPT,
                allowEmpty = true
            )
            text(
                "env.BUILDS_FILE_PARSED",
                "builds.txt",
                display = ParameterDisplay.HIDDEN
            )
        }

        val localOutputDir = "out"

        artifactRules = "*.zip => /"

        steps {
            script {
                name = "Get the builds configuration"
                scriptContent = """
                    #!/bin/bash
                    set -xe
                                      
                    export FULL_REPO_NAME=${'$'}{GIT_URL##*/}
                    export REPO_NAME=${'$'}{FULL_REPO_NAME%.*}
                    export BUILDS_FILE="builds.json"
                    export BUILDS_DIR="_builds"
                    export GIT_CLONE_DIR="git_clone_dir"
                    
                    if [ -f ${'$'}BUILDS_FILE_PARSED ]; then rm -f ${'$'}BUILDS_FILE_PARSED 2> /dev/null || true; fi
                    if [ -f %teamcity.build.workingDir%/*.zip ]; then rm -f %teamcity.build.workingDir%/*.zip 2> /dev/null || true; fi
                    if [ -d %teamcity.build.workingDir%/$localOutputDir ]; then rm -rf %teamcity.build.workingDir%/$localOutputDir/* 2> /dev/null || true; fi
                    if [ -d %teamcity.build.workingDir%/${'$'}GIT_CLONE_DIR ]; then rm -rf %teamcity.build.workingDir%/${'$'}GIT_CLONE_DIR/{*,.*} 2> /dev/null || true; fi

                    git clone --single-branch --branch %env.GIT_BRANCH% %env.GIT_URL% ${'$'}GIT_CLONE_DIR

                    if [ ! -z "%env.DOC_IDS%" ]
                        then 
                            echo "DOC_IDS specified. Checking for corresponding build files."
                            IFS=' '
                            for id in %env.DOC_IDS%; do
                                FILE="${'$'}GIT_CLONE_DIR/${'$'}BUILDS_DIR/${'$'}id.json"
                                if [ -f ${'$'}FILE ]
                                    then echo "Found build file ${'$'}FILE"
                                        root=$(echo "${'$'}builds_json" | jq -r .root ${'$'}FILE);
                                        filter=$(echo "${'$'}builds_json" | jq -r .filter ${'$'}FILE);
                                        echo ${'$'}root:${'$'}filter >> %env.BUILDS_FILE_PARSED%
                                    else echo "Could not locate build file ${'$'}FILE. Skipping Doc ID ${'$'}id"
                                fi
                            done
                        else
                            if [ -f ${'$'}GIT_CLONE_DIR/${'$'}BUILDS_FILE ]
                                then echo "${'$'}BUILDS_FILE found"
                                    declare -a BUILDS
                                    while IFS= read -r -d ${'$'}'\n' builds_json; do
                                    root=${'$'}(echo "${'$'}builds_json" | jq -r .root)
                                    filter=$(echo "${'$'}builds_json" | jq -r .filter)
                                    echo "${'$'}root:${'$'}filter" >> %env.BUILDS_FILE_PARSED%
                                    done < <(jq -c '.builds[]' ${'$'}GIT_CLONE_DIR/${'$'}BUILDS_FILE)
                                else
                                    echo "${'$'}BUILDS_FILE not found, checking for ${'$'}BUILDS_DIR directory"
                                    if [ -d "${'$'}GIT_CLONE_DIR/${'$'}BUILDS_DIR" ]
                                        then echo "${'$'}BUILDS_DIR found"
                                            for FILE in ${'$'}GIT_CLONE_DIR/${'$'}BUILDS_DIR/*; do 
                                            root=${'$'}(echo "${'$'}builds_json" | jq -r .root ${'$'}FILE);
                                            filter=${'$'}(echo "${'$'}builds_json" | jq -r .filter ${'$'}FILE);
                                            echo ${'$'}root:${'$'}filter >> %env.BUILDS_FILE_PARSED%
                                            done;
                                        else echo "ERROR: Did not find a ${'$'}BUILDS_FILE or ${'$'}BUILDS_DIR directory."
                                    fi
                            fi
                    fi
                """.trimIndent()
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
            script {
                name = "Build custom DITA output"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash
                    set -xe
                                                                                           
                    declare -a BUILDS
                    while read line; do
                      IFS=':' read -r input filter <<< "${'$'}line"
                      echo ${'$'}input ${'$'}filter
                      INPUT_NAME=${'$'}{input%.*}
                      FILTER_NAME=${'$'}{filter%.*}
                      OUTPUT_SUBDIR="${'$'}{INPUT_NAME}_${'$'}FILTER_NAME"
                      curl -O https://stash.guidewire.com/rest/api/1.0/projects/DOCSOURCES/repos/common-gw/raw/ditavals/${'$'}filter \
                        -H "Accept: application/json" \
                        -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%"
                      dita -i "${'$'}input" --filter "${'$'}filter" -f pdf_Guidewire_remote -o "$localOutputDir/${'$'}OUTPUT_SUBDIR" --git.url %env.GIT_URL% --git.branch %env.GIT_BRANCH%
                      n=${'$'}((n+1))
                    done < %env.BUILDS_FILE_PARSED%
                """.trimIndent()
                dockerImage = GwDockerImages.DITA_OT_LATEST.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
            step(
                GwBuildSteps.createZipPackageStep(
                    "%teamcity.build.workingDir%/$localOutputDir",
                    "%teamcity.build.workingDir%"
                )
            )
            script {
                name = "Clean up agent"
                scriptContent = """
                    #!/bin/bash
                    set -xe

                    export GIT_CLONE_DIR="git_clone_dir"                                    
                    
                    if [ -f ${'$'}BUILDS_FILE_PARSED ]; then rm -f ${'$'}BUILDS_FILE_PARSED 2> /dev/null || true; fi
                    if [ -d %teamcity.build.workingDir%/$localOutputDir ]; then rm -rf %teamcity.build.workingDir%/$localOutputDir/* 2> /dev/null || true; fi
                    if [ -d %teamcity.build.workingDir%/${'$'}GIT_CLONE_DIR ]; then rm -rf %teamcity.build.workingDir%/${'$'}GIT_CLONE_DIR/{*,.*} 2> /dev/null || true; fi
                """.trimIndent()
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
        }

        features {
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.GwSshAgentBuildFeature)
        }

        cleanup {
            add {
                keepRule {
                    id = "KEEP_RULE_CUSTOM_DITA_BUILDS"
                    keepAtLeast = builds(100)
                    dataToKeep = everything()
                    preserveArtifactsDependencies = true
                }
            }
        }
    })

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
            subProject(createDeploySearchServiceProject())
            buildType(UploadPdfsForEscrowBuildType)
        }
    }

    private fun createGenerateSitemapProject(): Project {
        return Project {
            name = "Generate sitemap"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
                buildType(createGenerateSitemapBuildType(it.env_name))
            }
        }
    }

    private fun createGenerateSitemapBuildType(deploy_env: String): BuildType {
        val outputDir = "%teamcity.build.checkoutDir%/build"
        return BuildType {
            name = "Generate sitemap for $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                step(GwBuildSteps.createRunSitemapGeneratorStep(deploy_env, outputDir))
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deploy_env,
                        GwStaticFilesModes.SITEMAP.mode_name,
                        outputDir
                    )
                )
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
                        withPendingChangesOnly = false
                    }
                }
            }
        }
    }

    private fun createCleanUpSearchIndexProject(): Project {
        return Project {
            name = "Clean up search index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
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
                    withPendingChangesOnly = false
                }
            }
        }
    }

    private fun createUpdateSearchIndexProject(): Project {
        return Project {
            name = "Update search index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD,
                GwDeployEnvs.PORTAL2
            ).forEach {
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

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
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
                step(
                    GwBuildSteps.createUploadContentToS3BucketStep(
                        deploy_env,
                        GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value,
                        "portal-config"
                    )
                )
                step(GwBuildSteps.createRefreshConfigBuildStep(deploy_env))
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:.teamcity/config/**
                        -:user=doctools:**
                        """.trimIndent()
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    private fun createDeploySearchServiceProject(): Project {
        return Project {
            name = "Deploy search service"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
                buildType(createDeploySearchServiceBuildType(it.env_name))
            }
        }
    }

    private fun createDeploySearchServiceBuildType(deploy_env: String): BuildType {
        val namespace = "doctools"
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        val searchServiceDeployEnvVars = Helpers.setSearchServiceDeployEnvVars(deploy_env)
        return BuildType {
            name = "Deploy search service to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }
            steps {
                script {
                    name = "Deploy to Kubernetes"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash 
                        set -eux
                                              
                        # Set AWS credentials
                        $awsEnvVars
                        
                        # Set environment variables needed for Kubernetes config files
                        $searchServiceDeployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${namespace})
                        
                        eval "echo \"${'$'}(cat apps/doc_crawler/kube/deployment.yml)\"" > ${'$'}TMP_DEPLOYMENT_FILE
                                                
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${namespace}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:apps/doc_crawler/kube/deployment.yml
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:apps/doc_crawler/kube/deployment-prod.yml
                        -:user=doctools:**
                        """.trimIndent()
                }
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
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.env_name)
        val awsEnvVarsInt = Helpers.setAwsEnvVars(GwDeployEnvs.INT.env_name)

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
                    $awsEnvVarsProd
                    
                    cd %teamcity.build.checkoutDir%/ci
                    ./downloadPdfsForEscrow.sh
                """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            }
            script {
                name = "Upload the ZIP archive to S3"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Setting credentials to access int"
                    $awsEnvVarsInt
                    
                    echo "Uploading the ZIP archive to the S3 bucket"
                    aws s3 cp "${tmpDir}/${zipArchiveName}" s3://tenant-doctools-int-builds/escrow/%env.RELEASE_NAME%/
            """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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
            subProject(createDeployHtml5DependenciesProject())
        }
    }

    private fun createDeployHtml5DependenciesProject(): Project {
        return Project {
            name = "Deploy HTML5 dependencies"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
                buildType(createDeployHtml5DependenciesBuildType(it.env_name))
            }
        }
    }

    private fun createDeployLandingPagesProject(): Project {
        return Project {
            name = "Deploy landing pages"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
                buildType(createDeployLandingPagesBuildType(it.env_name))
            }
        }
    }

    private fun createDeployHtml5DependenciesBuildType(deploy_env: String): BuildType {
        return BuildType {
            name = "Deploy HTML5 dependencies to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            // It is the output path defined in webpack.config.js
            val outputDir = "%teamcity.build.checkoutDir%/server/static/html5"

            steps {
                step(GwBuildSteps.createBuildHtml5DependenciesStep())
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deploy_env,
                        GwStaticFilesModes.HTML5.mode_name,
                        outputDir
                    )
                )
            }

            triggers {
                vcs {
                    triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/public/scripts/**
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/public/stylesheets/**
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/public/fonts/**
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/src/html5home/**
                            -:user=doctools:**
                            """.trimIndent()
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
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
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deploy_env,
                        GwStaticFilesModes.LANDING_PAGES.mode_name,
                        outputDir
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deploy_env == GwDeployEnvs.DEV.env_name) {
                triggers {
                    vcs {
                        triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:frontend/pages/**
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:.teamcity/config/**
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
            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
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
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deploy_env,
                        GwStaticFilesModes.LOCALIZED_PAGES.mode_name,
                        outputDir
                    )
                )
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
            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
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
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deploy_env,
                        GwStaticFilesModes.UPGRADE_DIFFS.mode_name,
                        outputDir
                    )
                )
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
    private val TestConfigDocs = createTestConfigBuildType(GwConfigTypes.DOCS.type_name)
    private val TestConfigSources = createTestConfigBuildType(GwConfigTypes.SOURCES.type_name)
    private val TestConfigBuilds = createTestConfigBuildType(GwConfigTypes.BUILDS.type_name)

    val rootProject = createRootProjectForServer()

    private fun createRootProjectForServer(): Project {
        return Project {
            name = "Server"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            buildType(Checkmarx)
            buildType(TestDocSiteServerApp)
            buildType(TestConfigDocs)
            buildType(TestConfigSources)
            buildType(TestConfigBuilds)
            buildType(TestSettingsKts)
            buildType(AuditNpmPackages)
            arrayOf(
                GwDeployEnvs.DEV,
                GwDeployEnvs.INT,
                GwDeployEnvs.STAGING,
                GwDeployEnvs.PROD
            ).forEach {
                buildType(createDeployServerBuildType(it.env_name))
            }
            buildType(ReleaseNewVersion)
        }
    }

    private object Checkmarx : BuildType({
        templates(AbsoluteId("CheckmarxSastScan"))
        name = "Checkmarx"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

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

        triggers {
            vcs {
                triggerRules = """
                    +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/**
                    -:user=doctools:**
                    """.trimIndent()
            }
        }
    })

    private object TestSettingsKts : BuildType({
        name = "Test settings.kts"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

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
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:.teamcity/settings.kts
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:.teamcity/config/**
                -:user=doctools:**
            """.trimIndent()
        }

        features.feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
    })

    private object AuditNpmPackages : BuildType({
        name = "Audit npm packages"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            nodeJS {
                id = "Run yarn npm audit"
                shellScript = """
                    cd server && yarn npm audit --severity high --all --recursive
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_16_14_2.image_url
            }
        }

        triggers.vcs {
            triggerRules = """
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/package.json
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/yarn.lock
                -:user=doctools:**
            """.trimIndent()
        }

        features.feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
    })

    private object TestDocSiteServerApp : BuildType({
        name = "Test doc site server app"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                name = "Test the doc site server"
                id = Helpers.createIdStringFromName(this.name)
                workingDir = "server"
                scriptContent = """
                    #!/bin/sh
                    set -e
                    export AWS_ROLE="arn:aws:iam::627188849628:role/aws_gwre-ccs-dev_tenant_doctools_developer"
                    export AWS_ECR_REPO="627188849628.dkr.ecr.us-west-2.amazonaws.com/tenant-doctools-docportal"
                    export OKTA_DOMAIN=https://guidewire-hub.oktapreview.com
                    export OKTA_CLIENT_ID=mock
                    export OKTA_CLIENT_SECRET=mock
                    export OKTA_IDP="0oamwriqo1E1dOdd70h7"
                    export GW_COMMUNITY_PARTNER_IDP="0oapv9i36yEMFLjxS0h7"
                    export GW_COMMUNITY_CUSTOMER_IDP="0oau503zlhhFLwTqF0h7"
                    export OKTA_ACCESS_TOKEN_ISSUER=https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7
                    export OKTA_ACCESS_TOKEN_ISSUER_APAC="issuerNotConfigured"
                    export OKTA_ACCESS_TOKEN_ISSUER_EMEA="issuerNotConfigured"
                    export OKTA_ACCESS_TOKEN_SCOPES=mock
                    export OKTA_ACCESS_TOKEN_AUDIENCE=mock
                    export TAG_VERSION="latest-int"
                    export APP_BASE_URL=http://localhost:8081
                    export SESSION_KEY=mock
                    export DOC_S3_URL="https://docportal-content.int.ccs.guidewire.net"
                    export PORTAL2_S3_URL="https://portal2-content.omega2-andromeda.guidewire.net"
                    export ELASTIC_SEARCH_URL=https://docsearch-doctools.int.ccs.guidewire.net
                    export DEPLOY_ENV=int
                    export LOCAL_CONFIG=yes
                    export ENABLE_AUTH=no
                    export PRETEND_TO_BE_EXTERNAL=no
                    export ALLOW_PUBLIC_DOCS=yes
                    export LOCALHOST_SESSION_SETTINGS=yes
                    export PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="https://docs.int.ccs.guidewire.net/partners-login"
                    export PARTNERS_LOGIN_URL="https://guidewire--qaint.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
                    export PARTNERS_LOGIN_CERT=mock
                    export CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="https://docs.int.ccs.guidewire.net/customers-login"
                    export CUSTOMERS_LOGIN_URL="https://guidewire--qaint.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
                    export CUSTOMERS_LOGIN_CERT=mock
                    export REQUESTS_MEMORY="4G"
                    export REQUESTS_CPU="1"
                    export LIMITS_MEMORY="8G"
                    export LIMITS_CPU="2"
                    
                    yarn
                    yarn test
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_16_14_2.image_url
            }
        }

        triggers {
            vcs {
                triggerRules = """
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/**
                -:user=doctools:**
            """.trimIndent()
            }
        }

        features {
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
        }
    })

    private fun createTestConfigBuildType(config_type: String): BuildType {
        val scriptStepContent = when (config_type) {
            GwConfigTypes.DOCS.type_name -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}"
                 
                    # Test merged config files
                    config_deployer test "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"
                """.trimIndent()

            GwConfigTypes.SOURCES.type_name -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}"
                 
                    # Test merged config files
                    config_deployer test "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"
                """.trimIndent()

            GwConfigTypes.BUILDS.type_name -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}"
                    config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}"
                    config_deployer merge "${GwConfigParams.BUILDS_CONFIG_FILES_DIR.param_value}" -o "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.param_value}"
                 
                    # Test merged config files                            
                    config_deployer test "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                    --sources-path "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                    --docs-path "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.param_value}"  
                """.trimIndent()

            else -> "echo Nothing to test here"
        }
        val vcsTriggerPath = when (config_type) {
            GwConfigTypes.BUILDS.type_name -> ".teamcity/config/**"
            else -> ".teamcity/config/${config_type}/**"
        }
        return BuildType {
            name = "Test $config_type config files"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Run tests for config files"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = scriptStepContent

                    dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            triggers.vcs {
                triggerRules = """
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${vcsTriggerPath}
                -:user=doctools:**
            """.trimIndent()
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
    }

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

        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.env_name)
        steps {
            script {
                name = "Bump and tag version"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                set -xe
                git config --local user.email "doctools@guidewire.com"
                git config --local user.name "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
                git fetch --tags

                cd server/
                export TAG_VERSION=${'$'}(npm version %semver-scope%)
                git add .
                git commit -m "push changes to ${'$'}{TAG_VERSION}"
                git tag -a ${'$'}{TAG_VERSION} -m "create new %semver-scope% version ${'$'}{TAG_VERSION}"
                git push
                git push --tags
                
                # Log into the dev ECR, build and push the image
                $awsEnvVars

                set +x
                docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST.param_value}
                set -x
                docker build -t ${GwDockerImages.DOC_PORTAL.image_url}:${'$'}{TAG_VERSION} . --build-arg tag_version=${'$'}{TAG_VERSION}
                docker push ${GwDockerImages.DOC_PORTAL.image_url}:${'$'}{TAG_VERSION}
            """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val gatewayConfigFile = when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> "gateway-config-prod.yml"
            else -> "gateway-config.yml"
        }

        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        val serverDeployEnvVars = Helpers.setServerDeployEnvVars(deploy_env, tagVersion)
        val deployServerBuildType = BuildType {
            name = "Deploy to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Deploy to Kubernetes"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash 
                        set -eux
                                
                        # Set AWS credentials
                        $awsEnvVars
                        
                        # Set environment variables needed for Kubernetes config files
                        $serverDeployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        export TMP_GATEWAY_CONFIG_FILE="tmp-gateway-config.yml"
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${namespace})
                        
                        eval "echo \"${'$'}(cat server/kube/deployment.yml)\"" > ${'$'}TMP_DEPLOYMENT_FILE
                        eval "echo \"${'$'}(cat server/kube/${gatewayConfigFile})\"" > ${'$'}TMP_GATEWAY_CONFIG_FILE
                                                
                        sed -ie "s/BUILD_TIME/${'$'}(date)/g" ${'$'}TMP_DEPLOYMENT_FILE
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${namespace}
                        kubectl apply -f ${'$'}TMP_GATEWAY_CONFIG_FILE --namespace=${namespace}                    
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                script {
                    name = "Check new Pods Status"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                        set -e
                        
                        # Set AWS credentials
                        $awsEnvVars
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
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
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }

                stepsOrder = this.items.map { it.id.toString() } as ArrayList<String>
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }

        if (arrayOf(
                GwDeployEnvs.STAGING.env_name,
                GwDeployEnvs.PROD.env_name
            ).contains(deploy_env)
        ) {
            deployServerBuildType.vcs.branchFilter = "+:<default>"
            deployServerBuildType.params.text(
                "TAG_VERSION",
                "",
                label = "Deploy Version",
                display = ParameterDisplay.PROMPT,
                regex = """^([0-9]+\.[0-9]+\.[0-9]+)${'$'}""",
                validationMessage = "Invalid SemVer Format"
            )
            if (arrayOf(GwDeployEnvs.PROD.env_name).contains(deploy_env)) {
                val publishServerDockerImageToEcrStep =
                    GwBuildSteps.createPublishServerDockerImageToProdEcrStep(tagVersion)
                deployServerBuildType.steps.step(publishServerDockerImageToEcrStep)
                deployServerBuildType.steps.stepsOrder.add(0, publishServerDockerImageToEcrStep.id.toString())
            }
        }

        if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name).contains(deploy_env)) {
            val buildAndPublishServerDockerImageStep =
                GwBuildSteps.createBuildAndPublishServerDockerImageToDevEcrStep(tagVersion)
            deployServerBuildType.steps.step(buildAndPublishServerDockerImageStep)
            deployServerBuildType.steps.stepsOrder.add(0, buildAndPublishServerDockerImageStep.id.toString())
            deployServerBuildType.dependencies {
                snapshot(Checkmarx) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestDocSiteServerApp) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestConfigDocs) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestConfigSources) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(TestConfigBuilds) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
            if (deploy_env == GwDeployEnvs.DEV.env_name) {
                deployServerBuildType.triggers.finishBuildTrigger {
                    buildType = "${TestDocSiteServerApp.id}"
                    successfulOnly = true
                }
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
                        if (sourceConfig.has("exportFrequency")) sourceConfig.getString("exportFrequency") else GwExportFrequencies.DAILY.param_value
                    }

                    else -> ""
                }
                val exportServer = exportServers[exportServerIndex]

                var scheduleHour: Int
                var scheduleMinute: Int
                when (exportFrequency) {
                    GwExportFrequencies.DAILY.param_value -> {
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

                    GwExportFrequencies.WEEKLY.param_value -> {
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

            when (export_frequency) {
                GwExportFrequencies.DAILY.param_value -> {
                    triggers.schedule {
                        schedulingPolicy = daily {
                            hour = export_hour
                            minute = export_minute
                        }

                        triggerBuild = always()
                        withPendingChangesOnly = false
                    }
                }

                GwExportFrequencies.WEEKLY.param_value -> {
                    triggers.schedule {
                        schedulingPolicy = weekly {
                            dayOfWeek = ScheduleTrigger.DAY.Saturday
                            hour = export_hour
                            minute = export_minute
                        }
                        triggerBuild = always()
                        withPendingChangesOnly = false
                    }
                }
            }

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
                id = Helpers.createIdStringFromName(this.name)
                workingDir = "LocalClient/sample/local/bin"
                scriptContent = """
                    #!/bin/bash
                    sed -i "s/ORP-XDOCS-WDB03/%EXPORT_SERVER%/" ../../../conf/LocClientConfig.xml
                    chmod 777 runExport.sh
                    export EXIT_CODE=0                    
                    
                    for path in %EXPORT_PATH_IDS%; do ./runExport.sh "${'$'}path" %XDOCS_EXPORT_DIR% || EXIT_CODE=${'$'}?; done
                    
                    exit ${'$'}EXIT_CODE
                    """.trimIndent()
            }
            script {
                name = "Add exported files to Bitbucket"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export GIT_CLONE_DIR="git_clone_dir"
                    git clone --single-branch --branch %GIT_BRANCH% %GIT_URL% ${'$'}GIT_CLONE_DIR
                    cp -R %XDOCS_EXPORT_DIR%/* ${'$'}GIT_CLONE_DIR/
                        
                    cd ${'$'}GIT_CLONE_DIR
                    git config --local user.email "doctools@guidewire.com"
                    git config --local user.name "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
                        
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
                Helpers.buildConfigs.filter {
                    it.getString("srcId") == srcId && (it.getString("buildType") == GwBuildTypes.DITA.build_type_name)
                }
            val uniqueEnvsFromAllDitaBuildsRelatedToSrc = ditaBuildsRelatedToSrc.map {
                val buildDocId = it.getString("docId")
                val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", buildDocId)
                Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
            }.flatten().distinct()

            if (arrayListOf(
                    GwDeployEnvs.INT.env_name,
                    GwDeployEnvs.STAGING.env_name
                ).any { uniqueEnvsFromAllDitaBuildsRelatedToSrc.contains(it) }
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

                    triggers.vcs {}

                    features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                    features.feature(GwBuildFeatures.GwBuildListenerLimitBuildFeature)
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
                    createValidationListenerBuildType(
                        src_id,
                        git_url,
                        git_branch,
                        this.id.toString()
                    )
                )
            }
            build_configs.forEach {
                validationBuildsSubProject.buildType(
                    createValidationBuildType(
                        src_id,
                        git_branch,
                        it,
                        it.getString("buildType")
                    )
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

            triggers.vcs {}

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(Helpers.createFullGitBranchName(git_branch)))
                feature(GwBuildFeatures.GwBuildListenerLimitBuildFeature)
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

        val workingDir = Helpers.getWorkingDir(build_config)
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

        when (gw_build_type) {
            GwBuildTypes.DITA.build_type_name -> {
                val ditaOtLogsDir = "dita_ot_logs"
                val docValidatorLogs = "doc_validator_logs"
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
                        null
                    }
                }

                validationBuildType.params {
                    select(
                        "env.ENABLE_DEBUG_MODE",
                        "",
                        label = "Enable debug mode",
                        options = listOf("Yes" to "--debug", "No" to "")
                    )
                }

                validationBuildType.artifactRules += """
                    ${workingDir}/${docValidatorLogs} => build_logs
                    ${workingDir}/${ditaOtLogsDir} => admin_logs
                    ${workingDir}/${outputDir}/${GwDitaOutputFormats.HTML5.format_name}/${GwConfigParams.BUILD_DATA_FILE.param_value} => ${GwConfigParams.BUILD_DATA_DIR.param_value}
                """.trimIndent()

                validationBuildType.steps {
                    step(
                        GwBuildSteps.createBuildDitaProjectForValidationsStep(
                            GwDitaOutputFormats.HTML5.format_name,
                            rootMap,
                            workingDir,
                            outputDir,
                            publishPath,
                            ditaOtLogsDir,
                            normalizedDitaDir,
                            schematronReportsDir,
                            indexRedirect,
                            buildFilter
                        )
                    )
                    step(
                        GwBuildSteps.createUploadContentToS3BucketStep(
                            GwDeployEnvs.INT.env_name,
                            "${workingDir}/${outputDir}/${GwDitaOutputFormats.HTML5.format_name}",
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
                            publishPath,
                            ditaOtLogsDir,
                            normalizedDitaDir,
                            schematronReportsDir,
                            indexRedirect,
                            buildFilter
                        )
                    )
                    step(
                        GwBuildSteps.createGetDocumentDetailsStep(
                            workingDir,
                            teamcityBuildBranch,
                            src_id,
                            docInfoFile,
                            docConfig
                        )
                    )
                    // For now, image validations are disabled.
                    // These validations need improvements.
                    arrayOf(
                        GwValidationModules.VALIDATORS_DITA.validation_name,
                        GwValidationModules.VALIDATORS_FILES.validation_name,
                        GwValidationModules.EXTRACTORS_DITA_OT_LOGS.validation_name,
                        GwValidationModules.EXTRACTORS_SCHEMATRON_REPORTS.validation_name,
                    ).forEach {
                        this.step(
                            GwBuildSteps.createRunDocValidatorStep(
                                it,
                                workingDir,
                                ditaOtLogsDir,
                                normalizedDitaDir,
                                schematronReportsDir,
                                docInfoFile
                            )
                        )
                    }
                }
            }

            GwBuildTypes.YARN.build_type_name -> {
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

                validationBuildType.artifactRules += """
                    ${workingDir}/*.log => build_logs
                """.trimIndent()


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
                            customEnv,
                            validation_mode = true
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
        }

        // DITA validation builds are triggered by validation listener builds.
        // The reference to the validation listener template is one of the criteria used by the build manager app
        // to identify builds that must be triggered.
        // Yarn validation builds are triggered by regular TeamCity VCS triggers.
        when (gw_build_type) {
            GwBuildTypes.DITA.build_type_name -> {
                validationBuildType.templates(GwTemplates.ValidationListenerTemplate)
            }

            GwBuildTypes.YARN.build_type_name -> {
                validationBuildType.triggers.vcs {
                    triggerRules = Helpers.getNonDitaTriggerRules(workingDir)
                }
            }
        }

        return validationBuildType
    }

    private fun createCleanValidationResultsBuildType(
        src_id: String,
        git_url: String,
    ): BuildType {
        val elasticsearchUrl = Helpers.getElasticsearchUrl(GwDeployEnvs.INT.env_name)
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.INT.env_name)
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
                        
                        $awsEnvVars
                        
                        results_cleaner --elasticsearch-urls "$elasticsearchUrl"  --git-source-id "$src_id" --git-source-url "$git_url" --s3-bucket-name "tenant-doctools-int-builds"
                    """.trimIndent()
                    dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            triggers.vcs {}
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
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        val elasticsearchUrl = Helpers.getElasticsearchUrl(deploy_env)

        return BuildType {
            name = "Generate recommendations for $gw_product, $gw_platform, $gw_version"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                script {
                    name = "Download the pretrained model"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                            #!/bin/bash
                            set -xe
                            
                            echo "Setting credentials to access int"
                            $awsEnvVars
                            
                            echo "Downloading the pretrained model from the S3 bucket"
                            aws s3 cp s3://tenant-doctools-${atmosDeployEnv}-builds/recommendation-engine/${pretrainedModelFile} %teamcity.build.workingDir%/
                        """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                script {
                    name = "Run the recommendation engine"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                            #!/bin/bash
                            set -xe
                            
                            export PLATFORM="$gw_platform"
                            export PRODUCT="$gw_product"
                            export VERSION="$gw_version"
                            export ELASTICSEARCH_URL="$elasticsearchUrl"
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

    private fun createAppProjects(): List<Project> {
        return arrayOf(
            Triple("Flail SSG", "frontend/flail_ssg", true),
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
                    var testAppBuildType = createTestAppBuildType(appName, appDir)
                    when (appName) {
                        "Doc crawler" -> {
                            testAppBuildType.params.text(
                                "env.TEST_ENVIRONMENT_DOCKER_NETWORK",
                                "host",
                                allowEmpty = false
                            )
                            val composeElasticsearchAndHttpServerStep =
                                GwBuildSteps.ComposeElasticsearchAndHttpServerStep
                            testAppBuildType.steps.step(composeElasticsearchAndHttpServerStep)
                            testAppBuildType.steps.stepsOrder.add(
                                0,
                                composeElasticsearchAndHttpServerStep.id.toString()
                            )
                        }

                        "Flail SSG" -> {
                            testAppBuildType = createTestAppBuildType(appName, appDir, "frontend")
                            testAppBuildType.params.text(
                                "env.DOCS_CONFIG_FILE",
                                "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.param_value}/${GwConfigParams.MERGED_CONFIG_FILE.param_value}",
                                display = ParameterDisplay.HIDDEN
                            )
                            val mergeDocsConfigFilesStep = GwBuildSteps.MergeDocsConfigFilesStep
                            testAppBuildType.steps.step(mergeDocsConfigFilesStep)
                            testAppBuildType.steps.stepsOrder.add(0, mergeDocsConfigFilesStep.id.toString())
                        }
                    }
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
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash                        
                        set -xe
                        
                        cd $app_dir
                        ./publish_docker.sh latest       
                    """.trimIndent()
                }
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${app_dir}/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

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

    private fun createTestAppBuildType(app_name: String, app_dir: String, vcs_trigger_dir: String = ""): BuildType {
        val vcsTriggerDir = vcs_trigger_dir.ifEmpty { app_dir }
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
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash
                        set -xe

                        cd $app_dir
                        ./run_tests.sh
                    """.trimIndent()
                    dockerImage = GwDockerImages.PYTHON_3_9_SLIM_BUSTER.image_url
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                }
                stepsOrder.add(this.items[0].id.toString())
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${vcsTriggerDir}/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
    }
}

object Helpers {
    fun getWorkingDir(build_config: JSONObject): String {
        return when (build_config.has("workingDir")) {
            false -> {
                "%teamcity.build.checkoutDir%"
            }

            true -> {
                "%teamcity.build.checkoutDir%/${build_config.getString("workingDir")}"
            }
        }
    }

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

    private fun removeSpecialCharacters(string_to_clean: String): String {
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

    fun getConfigFileUrl(deploy_env: String): String {
        return if (arrayListOf(GwDeployEnvs.PROD.env_name, GwDeployEnvs.PORTAL2.env_name).contains(deploy_env)) {
            "https://docportal-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}.guidewire.net/portal-config/config.json"
        } else {
            "https://docportal-content.${deploy_env}.ccs.guidewire.net/portal-config/config.json"
        }
    }

    fun setAwsEnvVars(deploy_env: String): String {
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> Triple(
                "%env.ATMOS_ORANGE_PROD_AWS_ACCESS_KEY_ID%",
                "%env.ATMOS_ORANGE_PROD_AWS_SECRET_ACCESS_KEY%",
                "%env.ATMOS_ORANGE_PROD_AWS_DEFAULT_REGION%"
            )

            else -> Triple(
                "%env.ATMOS_DEV_AWS_ACCESS_KEY_ID%",
                "%env.ATMOS_DEV_AWS_SECRET_ACCESS_KEY%",
                "%env.ATMOS_DEV_AWS_DEFAULT_REGION%"
            )
        }
        return """
            export AWS_ACCESS_KEY_ID="$awsAccessKeyId"
            export AWS_SECRET_ACCESS_KEY="$awsSecretAccessKey"
            export AWS_DEFAULT_REGION="$awsDefaultRegion"
        """.trimIndent()
    }

    fun getTargetUrl(deploy_env: String): String {
        return if (arrayOf(
                GwDeployEnvs.PROD.env_name,
                GwDeployEnvs.PORTAL2.env_name
            ).contains(deploy_env)
        ) {
            "https://docs.guidewire.com"
        } else {
            "https://docs.${deploy_env}.ccs.guidewire.net"
        }
    }

    fun getElasticsearchUrl(deploy_env: String): String {
        return if (arrayOf(GwDeployEnvs.PROD.env_name, GwDeployEnvs.PORTAL2.env_name).contains(deploy_env)) {
            "https://docsearch-doctools.${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}.guidewire.net"
        } else {
            "https://docsearch-doctools.${deploy_env}.ccs.guidewire.net"
        }
    }

    fun getS3BucketUrl(deploy_env: String): String {
        return when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> "https://docportal-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}.guidewire.net"
            GwDeployEnvs.PORTAL2.env_name -> "https://portal2-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}.guidewire.net"
            else -> "https://docportal-content.${deploy_env}.ccs.guidewire.net"
        }
    }

    fun getAtmosDeployEnv(deploy_env: String): String {
        return when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> GwDeployEnvs.OMEGA2_ANDROMEDA.env_name
            else -> deploy_env
        }
    }

    private fun getGwCommunityUrls(deploy_env: String): Pair<String, String> {
        val partnersLoginUrl: String
        val customersLoginUrl: String
        if (arrayOf(GwDeployEnvs.DEV.env_name, GwDeployEnvs.INT.env_name).contains(deploy_env)) {
            partnersLoginUrl = "https://guidewire--qaint.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://guidewire--qaint.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
        } else if (deploy_env == GwDeployEnvs.STAGING.env_name) {
            partnersLoginUrl = "https://guidewire--uat.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://guidewire--uat.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
        } else {
            partnersLoginUrl = "https://partner.guidewire.com/idp/endpoint/HttpRedirect"
            customersLoginUrl = "https://community.guidewire.com/idp/endpoint/HttpRedirect"
        }
        return Pair(partnersLoginUrl, customersLoginUrl)
    }

    fun setServerDeployEnvVars(deploy_env: String, tag_version: String): String {
        val (partnersLoginUrl, customersLoginUrl) = getGwCommunityUrls(deploy_env)
        val appBaseUrl = getTargetUrl(deploy_env)
        return when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> """
                export AWS_ROLE="arn:aws:iam::954920275956:role/aws_orange-prod_tenant_doctools_developer"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL_PROD.image_url}"
                export PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/partners-login"
                export PARTNERS_LOGIN_URL="$partnersLoginUrl"
                export GW_COMMUNITY_PARTNER_IDP="0oa6c4yaoikrU91Hw357"
                export CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/customers-login"
                export CUSTOMERS_LOGIN_URL="$customersLoginUrl"
                export GW_COMMUNITY_CUSTOMER_IDP="0oa6c4x5z3fYXUWoE357"
                export TAG_VERSION="$tag_version"
                export DEPLOY_ENV="${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}"
                export OKTA_ACCESS_TOKEN_ISSUER="https://guidewire-hub.okta.com/oauth2/aus11vix3uKEpIfSI357"
                export OKTA_ACCESS_TOKEN_ISSUER_APAC="https://guidewire-hub-apac.okta.com/oauth2/ausbg05gfcTZQ7bpH3l6"
                export OKTA_ACCESS_TOKEN_ISSUER_EMEA="https://guidewire-hub-eu.okta.com/oauth2/ausc2q01c40dNZII0416"
                export OKTA_DOMAIN="https://guidewire-hub.okta.com"
                export OKTA_IDP="0oa25tk18zhGOqMfj357"
                export APP_BASE_URL="$appBaseUrl"
                export ELASTIC_SEARCH_URL="http://docsearch-${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}.doctools:9200"
                export DOC_S3_URL="${getS3BucketUrl(deploy_env)}"
                export PORTAL2_S3_URL="${getS3BucketUrl(GwDeployEnvs.PORTAL2.env_name)}"
                export REQUESTS_MEMORY="8G"
                export REQUESTS_CPU="2"
                export LIMITS_MEMORY="16G"
                export LIMITS_CPU="4"
            """.trimIndent()

            else -> """
                export AWS_ROLE="arn:aws:iam::627188849628:role/aws_gwre-ccs-dev_tenant_doctools_developer"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL.image_url}"
                export PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/partners-login"
                export PARTNERS_LOGIN_URL="$partnersLoginUrl"
                export GW_COMMUNITY_PARTNER_IDP="0oapv9i36yEMFLjxS0h7"
                export CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/customers-login"
                export CUSTOMERS_LOGIN_URL="$customersLoginUrl"
                export GW_COMMUNITY_CUSTOMER_IDP="0oau503zlhhFLwTqF0h7"
                export TAG_VERSION="$tag_version"
                export DEPLOY_ENV="$deploy_env"
                export OKTA_ACCESS_TOKEN_ISSUER="https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7"
                export OKTA_ACCESS_TOKEN_ISSUER_APAC="issuerNotConfigured"
                export OKTA_ACCESS_TOKEN_ISSUER_EMEA="issuerNotConfigured"
                export OKTA_DOMAIN="https://guidewire-hub.oktapreview.com"
                export OKTA_IDP="0oamwriqo1E1dOdd70h7"
                export APP_BASE_URL="$appBaseUrl"
                export ELASTIC_SEARCH_URL="http://docsearch-${deploy_env}.doctools:9200"
                export DOC_S3_URL="${getS3BucketUrl(deploy_env)}"
                export PORTAL2_S3_URL="${getS3BucketUrl(GwDeployEnvs.PORTAL2.env_name)}"
                export REQUESTS_MEMORY="4G"
                export REQUESTS_CPU="1"
                export LIMITS_MEMORY="8G"
                export LIMITS_CPU="2"
            """.trimIndent()
        }
    }

    fun setSearchServiceDeployEnvVars(deploy_env: String): String {
        return when (deploy_env) {
            GwDeployEnvs.PROD.env_name -> """
                export DEPLOY_ENV="${GwDeployEnvs.OMEGA2_ANDROMEDA.env_name}"
                export REQUESTS_MEMORY="4G"
                export REQUESTS_CPU="1"
                export LIMITS_MEMORY="8G"
                export LIMITS_CPU="2"
            """.trimIndent()

            else -> """
                export DEPLOY_ENV="$deploy_env"
                export REQUESTS_MEMORY="1G"
                export REQUESTS_CPU="0.5"
                export LIMITS_MEMORY="2G"
                export LIMITS_CPU="1"
            """.trimIndent()
        }
    }

    fun getNonDitaTriggerRules(workingDir: String): String {

        return when (workingDir) {
            "%teamcity.build.checkoutDir%" -> {
                """
                    -:user=doctools:**
                """.trimIndent()
            }

            else -> {
                """
                    +:${workingDir.replace("%teamcity.build.checkoutDir%/", "")}/**
                    -:user=doctools:**
                """.trimIndent()
            }
        }
    }

    fun getCommandString(command: String, params: List<Pair<String, String?>>): String {
        val commandStringBuilder = StringBuilder()
        commandStringBuilder.append(command)
        val commandIterator = params.iterator()
        while (commandIterator.hasNext()) {
            val nextPair = commandIterator.next()
            val param = nextPair.first
            val value = nextPair.second
            if (value != null) {
                if (value.isEmpty()) {
                    commandStringBuilder.append(" $param")
                } else {
                    commandStringBuilder.append(" $param \"$value\"")
                }
            }
        }

        return commandStringBuilder.toString()
    }

    fun createGetDitavalCommandString(
        working_dir: String,
        build_filter: String?,
    ): String {
        return if (build_filter != null) {
            """
                echo "Downloading the ditaval file from common-gw submodule"
                                    
                export COMMON_GW_DITAVALS_DIR="${working_dir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.param_value}"
                mkdir -p ${'$'}COMMON_GW_DITAVALS_DIR && cd ${'$'}COMMON_GW_DITAVALS_DIR 
                curl -O https://stash.guidewire.com/rest/api/1.0/projects/DOCSOURCES/repos/common-gw/raw/ditavals/${build_filter} \
                    -H "Accept: application/json" \
                    -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%"
            """.trimIndent()
        } else {
            "echo \"This build does not use a ditaval file. Skipping download from the common-gw submodule...\""
        }
    }

}

object GwBuildSteps {
    object ComposeElasticsearchAndHttpServerStep : DockerComposeStep({
        name = "Compose Elasticsearch and HTTP server"
        id = Helpers.createIdStringFromName(this.name)
        file = "apps/doc_crawler/tests/test_doc_crawler/resources/docker-compose.yml"
    })

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

    fun createRefreshConfigBuildStep(deploy_env: String): ScriptBuildStep {
        val url = Helpers.getTargetUrl(deploy_env)
        return ScriptBuildStep {
            name = "Refresh config for $deploy_env"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                curl $url/safeConfig/refreshConfig
            """.trimIndent()
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
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        return ScriptBuildStep {
            name = "Copy localized PDFs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                $awsEnvVars
                        
                aws s3 sync "$loc_docs_src" s3://tenant-doctools-${atmosDeployEnv}-builds/l10n --exclude ".git/*" --delete
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        var awsS3SyncCommand =
            "aws s3 sync \"${upgrade_diffs_docs_src}\" s3://tenant-doctools-${atmosDeployEnv}-builds/upgradediffs --delete"
        if (arrayOf(GwDeployEnvs.STAGING.env_name, GwDeployEnvs.PROD.env_name).contains(deploy_env)) {
            awsS3SyncCommand += " --exclude \"*/*-rc/*\""
        }
        return ScriptBuildStep {
            name = "Copy upgrade diffs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                $awsEnvVars
                        
                $awsS3SyncCommand
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createRunSitemapGeneratorStep(deploy_env: String, output_dir: String): ScriptBuildStep {
        val appBaseUrl = Helpers.getTargetUrl(deploy_env)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deploy_env)
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
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deploy_env)
        val configFileUrl = Helpers.getConfigFileUrl(deploy_env)
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

    fun createPublishServerDockerImageToProdEcrStep(
        tag_version: String,
    ): ScriptBuildStep {
        val awsEnvVarsDev = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.env_name)
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.env_name)
        return ScriptBuildStep {
            name = "Publish server Docker Image to PROD ECR"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                set -xe
                
                # Log into the dev ECR, download the image and tag it
                $awsEnvVarsDev

                set +x
                docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST.param_value}
                set -x
                docker pull ${GwDockerImages.DOC_PORTAL.image_url}:${tag_version}
                docker tag ${GwDockerImages.DOC_PORTAL.image_url}:${tag_version} ${GwDockerImages.DOC_PORTAL_PROD.image_url}:${tag_version}
                
                # Log into the prod ECR and push the image
                $awsEnvVarsProd
                
                set +x
                docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST_PROD.param_value}
                set -x
                docker push ${GwDockerImages.DOC_PORTAL_PROD.image_url}:${tag_version}
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
    }

    fun createBuildAndPublishServerDockerImageToDevEcrStep(
        tag_version: String,
    ): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.env_name)
        return ScriptBuildStep {
            name = "Build and publish server Docker Image to DEV ECR"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash 
                set -xe
                
                # Log into the dev ECR, build and push the image
                $awsEnvVars

                set +x
                docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST.param_value}
                set -x
                docker build -t ${GwDockerImages.DOC_PORTAL.image_url}:${tag_version} ./server --build-arg tag_version=${tag_version}
                docker push ${GwDockerImages.DOC_PORTAL.image_url}:${tag_version}
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters =
                "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
        }
    }

    fun createRunDocCrawlerStep(deploy_env: String, doc_id: String, config_file: String): ScriptBuildStep {
        val docS3Url = Helpers.getS3BucketUrl(deploy_env)
        val appBaseUrl = Helpers.getTargetUrl(deploy_env)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deploy_env)
        val reportBrokenLinks = if (deploy_env == GwDeployEnvs.PROD.env_name) "no" else "yes"
        val reportShortTopics = if (deploy_env == GwDeployEnvs.PROD.env_name) "no" else "yes"
        return ScriptBuildStep {
            name = "Run the doc crawler"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="$config_file"
                export DOC_ID="$doc_id"
                export DOC_S3_URL="$docS3Url"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                export APP_BASE_URL="$appBaseUrl"
                export DOCS_INDEX_NAME="gw-docs"
                export BROKEN_LINKS_INDEX_NAME="broken-links"
                export SHORT_TOPICS_INDEX_NAME="short-topics"
                export REPORT_BROKEN_LINKS="$reportBrokenLinks"
                export REPORT_SHORT_TOPICS="$reportShortTopics"
                
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

        val configFileUrl = Helpers.getConfigFileUrl(deploy_env)

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
        working_dir: String,
        build_branch: String,
        src_id: String,
        doc_info_file: String,
        doc_config: JSONObject,
    ): ScriptBuildStep {
        val docInfoFilePath = "${working_dir}/${doc_info_file}"
        return ScriptBuildStep {
            name = "Get document details"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    cat << EOF | jq '. += {"gitBuildBranch": "$build_branch", "gitSourceId": "$src_id"}' > "$docInfoFilePath" | jq .
                    $doc_config
                    EOF
                 
                    cat "$docInfoFilePath"
                """.trimIndent()
        }
    }

    fun createCopyFromStagingToProdStep(publish_path: String): ScriptBuildStep {
        val awsEnvVarsStaging = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.env_name)
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.env_name)
        return ScriptBuildStep {
            name = "Copy from S3 on staging to S3 on prod"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Setting credentials to access staging"
                    $awsEnvVarsStaging
                    
                    echo "Copying from staging to Teamcity"
                    aws s3 sync s3://tenant-doctools-staging-builds/${publish_path} ${publish_path}/ --delete
                    
                    echo "Setting credentials to access prod"
                    $awsEnvVarsProd
                    
                    echo "Uploading from Teamcity to prod"
                    aws s3 sync ${publish_path}/ s3://tenant-doctools-omega2-andromeda-builds/${publish_path} --delete
                """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        return ScriptBuildStep {
            name = "Upload content to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    $awsEnvVars
                    
                    aws s3 sync "$output_path" s3://tenant-doctools-${atmosDeployEnv}-builds/${publish_path} --delete
                """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
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
        publish_path: String,
        dita_ot_logs_dir: String,
        normalized_dita_dir: String,
        schematron_reports_dir: String,
        index_redirect: Boolean,
        build_filter: String? = null,
    ): ScriptBuildStep {
        val logFile = "${output_format}_build.log"
        val fullOutputPath = "${output_dir}/${output_format}"

        val ditaCommandParams = mutableListOf<Pair<String, String?>>(
            Pair("-i", "${working_dir}/${root_map}"),
            Pair("-o", "${working_dir}/${fullOutputPath}"),
            Pair("-l", "${working_dir}/${logFile}"),
            Pair("--args.draft", "yes"),
        )

        if (build_filter != null) {
            ditaCommandParams.add(
                Pair(
                    "--filter",
                    "${working_dir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.param_value}/${build_filter}"
                )
            )
        }

        val getDitavalCommand = Helpers.createGetDitavalCommandString(working_dir, build_filter)
        var buildCommand = ""

        when (output_format) {
            // --git-url and --git-branch are required by the DITA OT plugin to generate build data.
            // There are not needed in this build, so they have fake values
            GwDitaOutputFormats.HTML5.format_name -> {
                val tempDir = "tmp/${output_format}"
                ditaCommandParams.add(Pair("-f", "html5-Guidewire"))
                ditaCommandParams.add(Pair("--args.rellinks", "nofamily"))
                ditaCommandParams.add(Pair("--generate.build.data", "yes"))
                ditaCommandParams.add(Pair("--git.url", "gitUrl"))
                ditaCommandParams.add(Pair("--git.branch", "gitBranch"))
                ditaCommandParams.add(Pair("--gw-base-url", publish_path))
                ditaCommandParams.add(Pair("--temp", "${working_dir}/${tempDir}"))
                ditaCommandParams.add(Pair("--clean.temp", "no"))
                ditaCommandParams.add(Pair("--schematron.validate", "yes"))
                ditaCommandParams.add(Pair("%env.ENABLE_DEBUG_MODE%", ""))
                if (index_redirect) {
                    ditaCommandParams.add(Pair("--create-index-redirect", "yes"))
                }
                val ditaBuildCommand = Helpers.getCommandString("dita", ditaCommandParams)
                val resourcesCopyCommand =
                    "mkdir -p \"${working_dir}/${schematron_reports_dir}\" && cp \"${working_dir}/${tempDir}/validation-report.xml\" \"${working_dir}/${schematron_reports_dir}/\""
                val logsCopyCommand =
                    "mkdir -p \"${working_dir}/${dita_ot_logs_dir}\" && cp \"${working_dir}/${logFile}\" \"${working_dir}/${dita_ot_logs_dir}/\""
                buildCommand = """
                    $ditaBuildCommand && $resourcesCopyCommand
                    $logsCopyCommand
                """.trimIndent()
            }

            GwDitaOutputFormats.DITA.format_name -> {
                ditaCommandParams.add(Pair("-f", "gw_dita"))
                val ditaBuildCommand = Helpers.getCommandString("dita", ditaCommandParams)
                val resourcesCopyCommand =
                    "mkdir -p \"${working_dir}/${normalized_dita_dir}\" && cp -R \"${working_dir}/${fullOutputPath}/\"* \"${working_dir}/${normalized_dita_dir}/\""
                buildCommand = "$ditaBuildCommand && $resourcesCopyCommand"
            }
        }

        return ScriptBuildStep {
            name = "Build the ${output_format.replace("_", "")} output"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                                
                SECONDS=0
                
                $getDitavalCommand

                echo "Building output"
                $buildCommand
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
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
        publish_path: String,
        build_filter: String? = null,
        doc_id: String? = null,
        doc_title: String? = null,
        git_url: String? = null,
        git_branch: String? = null,
        for_offline_use: Boolean = false,
        build_pdfs: Boolean = false,
    ): ScriptBuildStep {
        val commandParams = mutableListOf<Pair<String, String?>>(
            Pair("-i", "${working_dir}/${root_map}"),
            Pair("-o", "${working_dir}/${output_dir}"),
            Pair("--processing-mode", "strict")
        )

        if (build_filter != null) {
            commandParams.add(
                Pair(
                    "--filter",
                    "${working_dir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.param_value}/${build_filter}"
                )
            )
        }

        when (output_format) {
            GwDitaOutputFormats.WEBHELP.format_name -> {
                if (for_offline_use) {
                    commandParams.add(Pair("--use-doc-portal-params", "no"))
                    commandParams.add(Pair("-f", "webhelp_Guidewire"))
                } else {
                    commandParams.add(Pair("--use-doc-portal-params", "yes"))
                    commandParams.add(Pair("--gw-doc-id", doc_id))
                    commandParams.add(Pair("--generate.build.data", "yes"))
                    commandParams.add(Pair("--git.url", git_url))
                    commandParams.add(Pair("--git.branch", git_branch))
                    commandParams.add(Pair("-f", "webhelp_Guidewire_validate"))
                }
            }

            GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name -> {
                commandParams.add(Pair("-f", "wh-pdf"))
                commandParams.add(Pair("--use-doc-portal-params", if (for_offline_use) "no" else "yes"))
                commandParams.add(Pair("--gw-doc-id", doc_id))
                commandParams.add(Pair("--generate.build.data", "yes"))
                commandParams.add(Pair("--git.url", git_url))
                commandParams.add(Pair("--git.branch", git_branch))
            }

            GwDitaOutputFormats.PDF.format_name -> {
                commandParams.add(Pair("-f", "pdf_Guidewire_remote"))
                commandParams.add(Pair("--git.url", git_url))
                commandParams.add(Pair("--git.branch", git_branch))
            }

            GwDitaOutputFormats.SINGLEHTML.format_name -> {
                commandParams.add(Pair("-f", "singlehtml"))
            }

            GwDitaOutputFormats.HTML5.format_name -> {
                commandParams.add(Pair("--gw-base-url", publish_path))
                commandParams.add(Pair("--gw-doc-id", doc_id))
                commandParams.add(Pair("--gw-doc-title", doc_title))
                commandParams.add(Pair("--generate.build.data", "yes"))
                commandParams.add(Pair("--git.url", git_url))
                commandParams.add(Pair("--git.branch", git_branch))
                commandParams.add(Pair("-f", "html5-Guidewire"))
                commandParams.add(Pair("--args.rellinks", "nofamily"))
                commandParams.add(Pair("--build.pdfs", if (build_pdfs) "yes" else "no"))

            }
        }

        if (index_redirect) {
            if (arrayOf(
                    GwDitaOutputFormats.WEBHELP.format_name,
                    GwDitaOutputFormats.WEBHELP_WITH_PDF.format_name,
                ).contains(output_format)
            ) {
                commandParams.add(Pair("--create-index-redirect", "yes"))
                commandParams.add(Pair("--webhelp.publication.toc.links", "all"))
            } else if (output_format == GwDitaOutputFormats.HTML5.format_name) {
                commandParams.add(Pair("--create-index-redirect", "yes"))
            }
        }

        val getDitavalCommand = Helpers.createGetDitavalCommandString(working_dir, build_filter)
        val ditaBuildCommand = Helpers.getCommandString("dita", commandParams)

        val dockerImageName = when (for_offline_use) {
            true -> GwDockerImages.DITA_OT_3_4_1.image_url
            false -> GwDockerImages.DITA_OT_LATEST.image_url
        }

        return ScriptBuildStep {
            name = "Build the ${output_format.replace("_", "")} output"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export EXIT_CODE=0
                SECONDS=0
                
                $getDitavalCommand

                echo "Building output"
                $ditaBuildCommand || EXIT_CODE=${'$'}?
                
                duration=${'$'}SECONDS
                echo "BUILD FINISHED AFTER ${'$'}((${'$'}duration / 60)) minutes and ${'$'}((${'$'}duration % 60)) seconds"
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = dockerImageName
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createBuildHtml5DependenciesStep(): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Build HTML5 dependencies"
            id = Helpers.createIdStringFromName(this.name)
            workingDir = "server"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                yarn
                yarn build-html5-dependencies
            """.trimIndent()
            dockerImage = "${GwDockerImages.NODE_REMOTE_BASE.image_url}:14.14.0"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--user 1000:1000"
        }
    }

    fun createBuildHTML2PDFStep(
        html_files_absolute_dir: String,
        pdf_locale: String,
        pdf_output_absolute_path: String,
        doc_title: String,
        doc_portal_absolute_dir: String,
    ): ScriptBuildStep {
        val workingDir = "$doc_portal_absolute_dir/html2pdf"
        val scriptsDir = "$doc_portal_absolute_dir/server/static/html5/scripts"
        return ScriptBuildStep {
            name = "Build HTML2PDF"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                
                export EXIT_CODE=0
                export HTML_FILES_DIR="$html_files_absolute_dir"
                export SCRIPTS_DIR="$scriptsDir"
                export PDF_LOCALE="$pdf_locale"
                export PDF_OUTPUT_PATH="$pdf_output_absolute_path"
                export DOC_TITLE="$doc_title"
                
                cd "$workingDir"
                yarn
                yarn build || EXIT_CODE=${'$'}?
                
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = "${GwDockerImages.NODE_REMOTE_BASE.image_url}:17.6.0"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--user 1000:1000"
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
        validation_mode: Boolean = false,
    ): ScriptBuildStep {
        val nodeImage = when (node_image_version) {
            null -> "${GwDockerImages.NODE_REMOTE_BASE.image_url}:17.6.0"
            else -> "${GwDockerImages.NODE_REMOTE_BASE.image_url}:${node_image_version}"
        }
        val buildCommand = build_command ?: "build"
        val logFile = "yarn_build.log"
        val buildCommandBlock = if (validation_mode) {
            """
                export EXIT_CODE=0
                yarn $buildCommand &> "${working_dir}/${logFile}" || EXIT_CODE=${'$'}?
                
                if [[ ${'$'}EXIT_CODE != 0 ]]; then
                    echo "VALIDATION FAILED: High severity issues found."
                    echo "Check "$logFile" in the build artifacts for more details."
                fi
                    
                exit ${'$'}EXIT_CODE
                """.trimIndent()
        } else {
            """
                export EXIT_CODE=0
                yarn $buildCommand || EXIT_CODE=${'$'}?
                exit ${'$'}EXIT_CODE
            """.trimIndent()
        }
        val targetUrl = Helpers.getTargetUrl(deploy_env)
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
                    
                    export DEPLOY_ENV="$deploy_env"
                    export GW_DOC_ID="$doc_id"
                    export GW_PRODUCT="$gw_products"
                    export GW_PLATFORM="$gw_platforms"
                    export GW_VERSION="$gw_versions"
                    export TARGET_URL="$targetUrl"
                    export BASE_URL="/${publish_path}/"
                    $customEnvExportVars
                    
                    cd "$working_dir"
                    yarn install
                    $buildCommandBlock
                """.trimIndent()
            dockerImage = nodeImage
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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
        val targetUrl = Helpers.getTargetUrl(deploy_env)
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
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/jutro-npm-dev -s @jutro
                    npm config set @jutro:registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/jutro-npm-dev/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/globalization-npm-release -s @gwre-g11n
                    npm config set @gwre-g11n:registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/globalization-npm-release/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/elixir -s @elixir
                    npm config set @elixir:registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/elixir/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/portfoliomunster-npm-dev -s @gtui
                    npm config set @gtui:registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/portfoliomunster-npm-dev/
                                        
                    # new Jutro proxy repo
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/jutro-suite-npm-dev
                    npm config set registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/jutro-suite-npm-dev/

                    # Doctools repo
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://${GwConfigParams.ARTIFACTORY_HOST.param_value}/artifactory/api/npm/doctools-npm-dev/
                    
                    cd "$working_dir"
                    yarn
                    export EXIT_CODE=0
                    NODE_OPTIONS=--max_old_space_size=4096 CI=true yarn build || EXIT_CODE=${'$'}?
                    exit ${'$'}EXIT_CODE
                """.trimIndent()
            dockerImage = GwDockerImages.GENERIC_14_14_0_YARN_CHROME.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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
        validation_module: String,
        working_dir: String,
        dita_ot_logs_dir: String,
        normalized_dita_dir: String,
        schematron_reports_dir: String,
        doc_info_file: String,
    ): ScriptBuildStep {
        var stepName = ""
        val docInfoFileFullPath = "${working_dir}/${doc_info_file}"
        val elasticsearchUrl = Helpers.getElasticsearchUrl(GwDeployEnvs.INT.env_name)
        val validationCommandParams = mutableListOf<Pair<String, String?>>(
            Pair("--elasticsearch-urls", elasticsearchUrl),
            Pair("--doc-info", docInfoFileFullPath),
        )

        when (validation_module) {
            GwValidationModules.VALIDATORS_DITA.validation_name -> {
                validationCommandParams.add(Pair("validators", "${working_dir}/${normalized_dita_dir}"))
                validationCommandParams.add(Pair("dita", ""))
                stepName = "Run GW validations for issues in DITA files"
            }

            GwValidationModules.VALIDATORS_FILES.validation_name -> {
                validationCommandParams.add(Pair("validators", "${working_dir}/${normalized_dita_dir}"))
                validationCommandParams.add(Pair("files", ""))
                stepName = "Run GW validations for miscellaneous issues, like missing file extensions"
            }

            GwValidationModules.VALIDATORS_IMAGES.validation_name -> {
                validationCommandParams.add(Pair("validators", "${working_dir}/${normalized_dita_dir}"))
                validationCommandParams.add(Pair("images", ""))
                stepName = "Run GW validations for images and <img> tags in DITA files"
            }

            GwValidationModules.EXTRACTORS_DITA_OT_LOGS.validation_name -> {
                validationCommandParams.add(Pair("extractors", "${working_dir}/${dita_ot_logs_dir}"))
                validationCommandParams.add(Pair("dita-ot-logs", ""))
                stepName = "Get issues from log files generated by DITA OT builds"
            }

            GwValidationModules.EXTRACTORS_SCHEMATRON_REPORTS.validation_name -> {
                validationCommandParams.add(Pair("extractors", "${working_dir}/${schematron_reports_dir}"))
                validationCommandParams.add(Pair("schematron-reports", ""))
                stepName = "Get issues from reports generated by Schematron validations"
            }
        }
        val validationCommand = Helpers.getCommandString("doc_validator", validationCommandParams)
        return ScriptBuildStep {
            name = stepName
            id = Helpers.createIdStringFromName(this.name)
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            workingDir = working_dir
            scriptContent = """
                #!/bin/bash
                set -xe
                
                $validationCommand
            """.trimIndent()
            dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createDeployStaticFilesStep(
        deploy_env: String,
        deployment_mode: String,
        output_dir: String,
    ): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(deploy_env)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deploy_env)
        var sourceDir = output_dir
        var targetDir = ""
        var excludedPatterns = ""
        when (deployment_mode) {
            GwStaticFilesModes.LANDING_PAGES.mode_name -> {
                targetDir = "pages"
                excludedPatterns = "--exclude \"*l10n/*\" --exclude \"*upgradediffs/*\""
            }

            GwStaticFilesModes.LOCALIZED_PAGES.mode_name -> {
                sourceDir = "${output_dir}/l10n"
                targetDir = "pages/l10n"
            }

            GwStaticFilesModes.UPGRADE_DIFFS.mode_name -> {
                sourceDir = "${output_dir}/upgradediffs"
                targetDir = "pages/upgradediffs"
            }

            GwStaticFilesModes.SITEMAP.mode_name -> targetDir = "sitemap"
            GwStaticFilesModes.HTML5.mode_name -> targetDir = "html5"
        }
        val deployCommand =
            "aws s3 sync \"$sourceDir\" s3://tenant-doctools-${atmosDeployEnv}-builds/${targetDir} --delete $excludedPatterns".trim()

        return ScriptBuildStep {
            name = "Deploy static files to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash 
                set -xe
                
                $awsEnvVars
                
                $deployCommand
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.image_url
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
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

    object GwAntennaHouseFormatterServerProjectFeature : ProjectFeature({
        type = "JetBrains.SharedResources"
        id = "GW_ANTENNA_HOUSE_FORMATTER_SERVER"
        param("quota", "3")
        param("name", "AntennaHouseFormatterServer")
        param("type", "quoted")
    })

    object GwBuildListenerLimitProjectFeature : ProjectFeature({
        type = "JetBrains.SharedResources"
        id = "GW_BUILD_LISTENER_LIMIT"
        param("quota", "5")
        param("name", "BuildListenerLimit")
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
        teamcitySshKey = GwConfigParams.BITBUCKET_SSH_KEY.param_value
    })

    object GwOxygenWebhelpLicenseBuildFeature : BuildFeature({
        id = "GW_OXYGEN_WEBHELP_LICENSE_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "OxygenWebhelpLicense readLock")
    })

    object GwAntennaHouseFormatterServerBuildFeature : BuildFeature({
        id = "GW_ANTENNA_HOUSE_FORMATTER_SERVER_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "AntennaHouseFormatterServer readLock")
    })

    object GwBuildListenerLimitBuildFeature : BuildFeature({
        id = "GW_BUILD_LISTENER_LIMIT_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "BuildListenerLimit readLock")
    })

    object GwCommitStatusPublisherBuildFeature : CommitStatusPublisher({
        publisher = bitbucketServer {
            url = "https://stash.guidewire.com"
            userName = "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
            password =
                "%env.BITBUCKET_ACCESS_TOKEN%"
        }
    })

    fun createGwPullRequestsBuildFeature(target_git_branch: String): PullRequests {
        return PullRequests {
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = token {
                    token = "%env.BITBUCKET_ACCESS_TOKEN%"
                }
                filterTargetBranch = "+:${target_git_branch}"
            }
        }
    }
}

object GwVcsRoots {
    val DocumentationPortalGitVcsRoot =
        createGitVcsRoot(
            Helpers.resolveRelativeIdFromIdString("Documentation Portal git repo"),
            "ssh://git@stash.guidewire.com/doctools/documentation-portal.git",
            "master",
            listOf("(refs/heads/*)")

        )

    val XdocsClientGitVcsRoot =
        createGitVcsRoot(
            Helpers.resolveRelativeIdFromIdString("XDocs Client git repo"),
            "ssh://git@stash.guidewire.com/doctools/xdocs-client.git",
            "master"
        )

    val LocalizedPdfsGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("Localized PDFs git repo"),
        "ssh://git@stash.guidewire.com/docsources/localization-pdfs.git",
        "main"
    )

    val UpgradeDiffsGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("Upgrade diffs git repo"),
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
                uploadedKey = GwConfigParams.BITBUCKET_SSH_KEY.param_value
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


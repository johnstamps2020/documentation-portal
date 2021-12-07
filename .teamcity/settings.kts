import jetbrains.buildServer.configs.kotlin.v10.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.*

version = "2020.1"

project {

    params {
        param("env.NAMESPACE", "doctools")
    }


    subProject(Docs.createRootProjectForDocs())
    subProject(Recommendations.createRootProjectForRecommendations())
    subProject(Content.createRootProjectForContent())

    features {
        feature {
            type = "JetBrains.SharedResources"
            id = "OXYGEN_WEBHELP_LICENSE"
            param("quota", "3")
            param("name", "OxygenWebhelpLicense")
            param("type", "quoted")
        }
    }
}

object Helpers {
    fun convertListToLowercase(list_to_convert: List<String>): List<String> {
        return list_to_convert.map { it.lowercase(Locale.getDefault()) }
    }

    fun convertJsonArrayToArrayList(json_array: JSONArray): List<String> {
        return json_array.joinToString(",").split(",")
    }

    fun generatePlatformProductVersionCombinations(
        gw_platforms: List<String>, gw_products: List<String>, gw_versions: List<String>
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
    val buildConfigs = getObjectsFromAllConfigFiles("config/builds", "builds")

    fun getObjectById(objectList: JSONArray, idName: String, idValue: String): JSONObject {
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

    fun resolveRelativeIdFromIdString(id: String): RelativeId {
        return RelativeId(removeSpecialCharacters(id))
    }


}

object Docs {
    private fun createYarnBuildTypes(
        env_names: List<Any>,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        index_for_search: Boolean,
        build_command: String?,
        node_image_version: String?,
        gw_platforms: String,
        gw_products: String,
        gw_versions: String
    ): List<BuildType> {
        val yarnBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val envName = env.toString()
            val docBuildType = createInitialDocBuildType(
                envName, doc_id, src_id, publish_path, working_dir, index_for_search
            )
            val yarnBuildStep = BuildSteps.createBuildYarnProjectStep(
                envName,
                publish_path,
                build_command,
                node_image_version,
                doc_id,
                gw_products,
                gw_platforms,
                gw_versions,
                working_dir
            )
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
        src_id: String,
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
        src_url: String,
        src_branch: String,
        resources_to_copy: JSONArray
    ): List<BuildType> {
        val ditaBuildTypes = mutableListOf<BuildType>()
        for (env in env_names) {
            val envName = env.toString()
            val docBuildType = createInitialDocBuildType(
                envName, doc_id, src_id, publish_path, working_dir, index_for_search
            )
            if (envName == "prod") {
                val copyFromStagingToProdStep = BuildSteps.createCopyFromStagingToProdStep(publish_path)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                docBuildType.artifactRules = "${working_dir}/${output_dir}/build-data.json => json"
                docBuildType.features.feature(BuildFeatures.GwOxygenWebhelpLicenseFeature)
                val buildDitaProjectStep: ScriptBuildStep
                if (envName == "staging") {
                    buildDitaProjectStep = BuildSteps.createBuildDitaProjectStep(
                        "webhelp_with_pdf",
                        root_map,
                        index_redirect,
                        working_dir,
                        output_dir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        src_url,
                        src_branch
                    )
                    if (gw_platforms.lowercase(Locale.getDefault()).contains("self-managed")) {
                        val localOutputDir = "${output_dir}/zip"
                        val buildDitaProjectForOfflineUseStep = BuildSteps.createBuildDitaProjectStep(
                            "webhelp", root_map, index_redirect, working_dir, localOutputDir, for_offline_use = true
                        )
                        docBuildType.steps.step(buildDitaProjectForOfflineUseStep)
                        docBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
                        val zipPackageStep = BuildSteps.createZipPackageStep(
                            "${working_dir}/${localOutputDir}", "${working_dir}/${output_dir}"
                        )
                        docBuildType.steps.step(zipPackageStep)
                        docBuildType.steps.stepsOrder.add(1, zipPackageStep.id.toString())
                    }
                } else {
                    buildDitaProjectStep = BuildSteps.createBuildDitaProjectStep(
                        "webhelp",
                        root_map,
                        index_redirect,
                        working_dir,
                        output_dir,
                        build_filter,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions,
                        src_url,
                        src_branch
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
                        val copyResourcesStep = BuildSteps.createCopyResourcesStep(
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
                        stepsOrder.addAll(stepsOrder.indexOf("UPLOAD_CONTENT_TO_S3_BUCKET"),
                            copyResourcesSteps.map { it.id.toString() })
                    }
                    docBuildType.features.feature(BuildFeatures.GwSshAgentFeature)
                }
            }

            ditaBuildTypes.add(docBuildType)
        }
        for (format in arrayListOf("webhelp", "pdf", "webhelp_with_pdf")) {
            val downloadableOutputBuildType = BuildType {
                name = "Build downloadable ${format.replace("_", " ")}"
                id = Helpers.resolveRelativeIdFromIdString("$doc_id$format")

                artifactRules = "${working_dir}/${output_dir} => /"

                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(src_id))
                    cleanCheckout = true
                }

                features {
                    feature(BuildFeatures.GwDockerSupportFeature)
                }
            }
            val localOutputDir = "${output_dir}/zip"
            val buildDitaProjectForOfflineUseStep = BuildSteps.createBuildDitaProjectStep(
                format, root_map, index_redirect, working_dir, localOutputDir, build_filter, for_offline_use = true
            )
            downloadableOutputBuildType.steps.step(buildDitaProjectForOfflineUseStep)
            downloadableOutputBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
            val zipPackageStep = BuildSteps.createZipPackageStep(
                "${working_dir}/${localOutputDir}", "${working_dir}/${output_dir}"
            )
            downloadableOutputBuildType.steps.step(zipPackageStep)
            downloadableOutputBuildType.steps.stepsOrder.add(1, zipPackageStep.id.toString())
            ditaBuildTypes.add(downloadableOutputBuildType)
        }
        return ditaBuildTypes
    }

    private fun createInitialDocBuildType(
        deploy_env: String,
        doc_id: String,
        src_id: String,
        publish_path: String,
        working_dir: String,
        index_for_search: Boolean
    ): BuildType {
        return BuildType {
            name = "Publish to $deploy_env"
            id = Helpers.resolveRelativeIdFromIdString("$doc_id$deploy_env")


            if (deploy_env != "prod") {
                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(src_id))
                    cleanCheckout = true
                }
                val uploadContentToS3BucketStep = BuildSteps.createUploadContentToS3BucketStep(
                    deploy_env, publish_path, working_dir
                )
                steps.step(uploadContentToS3BucketStep)
                steps.stepsOrder.add(uploadContentToS3BucketStep.id.toString())
            }

            if (index_for_search) {
                val configFile = "%teamcity.build.workingDir%/config.json"
                val configFileStep = BuildSteps.createGetConfigFileStep(deploy_env, configFile)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = BuildSteps.createCrawlDocStep(deploy_env, doc_id, configFile)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }

            features {
                feature(BuildFeatures.GwDockerSupportFeature)
            }
        }

    }

    private fun createDocVcsRoot(src_id: String): GitVcsRoot {
        val srcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", src_id)
        return GitVcsRoot {
            name = src_id
            id = Helpers.resolveRelativeIdFromIdString(src_id)
            url = srcConfig.getString("gitUrl")
            branch = srcConfig.getString("branch")
            authMethod = uploadedKey {
                uploadedKey = "sys-doc.rsa"
            }
        }
    }

    private fun createDocProject(build_config: JSONObject, src_id: String): Project {
        val gwBuildType = build_config.getString("buildType")
        val docId = build_config.getString("docId")
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val docEnvironmentsList = Helpers.convertJsonArrayToArrayList(docEnvironments)
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

        val docProjectBuildTypes = mutableListOf<BuildType>()
        if (gwBuildType == "yarn") {
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
                indexForSearch,
                buildCommand,
                nodeImageVersion,
                gwPlatformsString,
                gwProductsString,
                gwVersionsString
            )
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
            val outputDir = "out"
            val srcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", src_id)
            val srcUrl = srcConfig.getString("gitUrl")
            val srcBranch = srcConfig.getString("branch")
            val resourcesToCopy =
                if (build_config.has("resources")) build_config.getJSONArray("resources") else JSONArray()

            docProjectBuildTypes += createDitaBuildTypes(
                docEnvironmentsList,
                docId,
                src_id,
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
                srcUrl,
                srcBranch,
                resourcesToCopy
            )
        }

        return Project {
            name = "$docTitle ($docId)"
            description = "$gwPlatforms; $gwProducts; $gwVersions"
            id = Helpers.resolveRelativeIdFromIdString(docId)

            docProjectBuildTypes.forEach {
                buildType(it)
            }
        }
    }

    fun createRootProjectForDocs(): Project {
        val mainProject = Project {
            name = "Docs"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
        }
        val srcIds = mutableListOf<String>()
        for (i in 0 until Helpers.buildConfigs.length()) {
            val buildConfig = Helpers.buildConfigs.getJSONObject(i)
            val srcId = buildConfig.getString("srcId")
            val docProject = createDocProject(buildConfig, srcId)
            mainProject.subProject(docProject)

            srcIds.add(srcId)
        }
        for (srcId in srcIds.distinct()) {
            mainProject.vcsRoot(createDocVcsRoot(srcId))
        }
        return mainProject
    }
}

object Content {
    fun createRootProjectForContent(): Project {
        val mainProject = Project {
            name = "Content"
            id = Helpers.resolveRelativeIdFromIdString(this.name)
        }
        mainProject.buildType(BuildTypes.createCleanUpIndexBuildType())
        mainProject.buildType(BuildTypes.createUpdateSearchIndexBuildType())

        return mainProject
    }
}

object Sources {}

object Server {}

object Recommendations {
    fun createRootProjectForRecommendations(): Project {
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
            val recommendationsForTopicsBuildTypeInt = BuildTypes.createRecommendationsForTopicsBuildType(
                "int", platform, product, version, "GoogleNews-vectors-negative300.bin"
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
        for (i in 0 until Helpers.docConfigs.length()) {
            val doc = Helpers.docConfigs.getJSONObject(i)
            val docEnvironmentsLower =
                Helpers.convertListToLowercase(Helpers.convertJsonArrayToArrayList(doc.getJSONArray("environments")))
            if (docEnvironmentsLower.contains(deploy_env)) {
                val docMetadata = doc.getJSONObject("metadata")
                val docPlatforms = Helpers.convertJsonArrayToArrayList(docMetadata.getJSONArray("platform"))
                val docProducts = Helpers.convertJsonArrayToArrayList(docMetadata.getJSONArray("product"))
                val docVersions = Helpers.convertJsonArrayToArrayList(docMetadata.getJSONArray("version"))
                result += Helpers.generatePlatformProductVersionCombinations(docPlatforms, docProducts, docVersions)
            }
        }
        return result.distinct()
    }
}

object BuildSteps {
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
        input_path: String, target_path: String
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
        deploy_env: String, publish_path: String, working_dir: String
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

    fun createCopyResourcesStep(
        step_id: Int,
        working_dir: String,
        output_dir: String,
        resource_src_dir: String,
        resource_target_dir: String,
        resource_src_url: String,
        resource_src_branch: String
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

    fun createBuildDitaProjectStep(
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
        for_offline_use: Boolean = false
    ): ScriptBuildStep {
        var ditaBuildCommand: String = if (for_offline_use) {
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
            name = if (for_offline_use) "Build the DITA project for offline use" else "Build the DITA project"
            id = if (for_offline_use) "BUILD_DITA_PROJECT_FOR_OFFLINE_USE" else "BUILD_DITA_PROJECT"
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
        working_dir: String
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
}

object BuildFeatures {
    object GwDockerSupportFeature : DockerSupportFeature({
        id = "DockerSupport"
        loginToRegistry = on {
            dockerRegistryId = "PROJECT_EXT_155"
        }
    })

    object GwSshAgentFeature : SshAgent({
        teamcitySshKey = "sys-doc.rsa"
    })

    object GwOxygenWebhelpLicenseFeature : BuildFeature({
        id = "OXYGEN_WEBHELP_LICENSE_READ_LOCK"
        type = "JetBrains.SharedResources"
        param("locks-param", "OxygenWebhelpLicense readLock")
    })
}

object BuildTriggers {

    fun createVcsTriggerForExportedVcsRoot(vcs_root_id: String, src_id: String): VcsTrigger {
        return VcsTrigger({
            triggerRules = """
                +:root=${vcs_root_id};comment=\[$src_id\]:**
                """.trimIndent()
        })
    }

    fun createVcsTriggerForNonDitaBuilds(vcs_root_id: String): VcsTrigger {
        return VcsTrigger({
            triggerRules = """
                +:root=${vcs_root_id}:**
                """.trimIndent()
        })
    }
}

object BuildTypes {

    fun createRecommendationsForTopicsBuildType(
        deploy_env: String, gw_platform: String, gw_product: String, gw_version: String, pretrained_model_file: String
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

            features.feature(BuildFeatures.GwDockerSupportFeature)
        }
    }

    fun createCleanUpIndexBuildType(): BuildType {
        return BuildType {
            name = "Clean up index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

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

            features.feature(BuildFeatures.GwDockerSupportFeature)
        }
    }

    fun createUpdateSearchIndexBuildType(): BuildType {
        return BuildType {
            name = "Update search index"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

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

            val configFile = "%teamcity.build.workingDir%/config.json"
            val configFileStep = BuildSteps.createGetConfigFileStep("%DEPLOY_ENV%", configFile)
            steps.step(configFileStep)
            steps.stepsOrder.add(configFileStep.id.toString())
            val crawlDocStep = BuildSteps.createCrawlDocStep("%DEPLOY_ENV%", "%DOC_ID%", configFile)
            steps.step(crawlDocStep)
            steps.stepsOrder.add(crawlDocStep.id.toString())

            features.feature(BuildFeatures.GwDockerSupportFeature)
        }
    }
}



import jetbrains.buildServer.configs.kotlin.v10.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

version = "2020.1"

project {

    params {
        param("env.NAMESPACE", "doctools")
    }


    subProject(Docs.createRootProjectForDocs())
    template(BuildDocSiteOutputFromDita)

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

object Helpers {
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
    fun createDocBuildType(
        build_type_name: String,
        build_type_id: RelativeId,
        vcs_root_id: String,
        deploy_env: String,
        doc_id: String,
        index_for_search: Boolean,
        publish_path: String,
        working_dir: String
    ): BuildType {
        return BuildType {
            name = build_type_name
            id = build_type_id

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(vcs_root_id))
                cleanCheckout = true
            }

            if (deploy_env != "prod") {
                val uploadContentToS3BucketStep =
                    BuildSteps.createUploadContentToS3BucketStep(
                        deploy_env,
                        publish_path,
                        working_dir
                    )
                steps.step(uploadContentToS3BucketStep)
                steps.stepsOrder.add(uploadContentToS3BucketStep.id.toString())
            }

            if (index_for_search) {
                val configFileStep = BuildSteps.createGetConfigFileStep(deploy_env)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = BuildSteps.createCrawlDocStep(deploy_env, doc_id)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }

            features {
                feature(BuildFeatures.GwDockerSupportFeature)
            }
        }
    }

    fun createDocVcsRoot(src_id: String): GitVcsRoot {
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

    fun createDocProject(build_config: JSONObject, src_id: String): Project {
        val docBuildSubProjects = mutableListOf<BuildType>()
        val docId = build_config.getString("docId")
        val gwBuildType = build_config.getString("buildType")
        val workingDir = when (build_config.has("workingDir")) {
            false -> {
                "%teamcity.build.checkoutDir%"
            }
            true -> {
                "%teamcity.build.checkoutDir%/${build_config.getString("workingDir")}"
            }
        }
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val metadata = docConfig.getJSONObject("metadata")
        val gwProducts = metadata.getJSONArray("product").joinToString(separator = ",")
        val gwPlatforms = metadata.getJSONArray("platform").joinToString(separator = ",")
        val gwVersions = metadata.getJSONArray("version").joinToString(separator = ",")
        val publishPath = docConfig.getString("url")
        val indexForSearch = if (docConfig.has("indexForSearch")) docConfig.getBoolean("indexForSearch") else true
        for (i in 0 until docEnvironments.length()) {
            val envName = docEnvironments.getString(i)
            val docBuildTypeName = "Publish to $envName"
            val docBuildTypeId = Helpers.resolveRelativeIdFromIdString("$docId$envName")
            val docBuildType = createDocBuildType(
                docBuildTypeName,
                docBuildTypeId,
                src_id,
                envName,
                docId,
                indexForSearch,
                publishPath,
                workingDir
            )
            if (gwBuildType == "yarn") {
                val nodeImageVersion =
                    if (build_config.has("nodeImageVersion")) build_config.getString("nodeImageVersion") else null
                val buildCommand =
                    if (build_config.has("yarnBuildCustomCommand")) build_config.getString("yarnBuildCustomCommand") else null
                val yarnBuildStep = BuildSteps.createBuildYarnProjectStep(
                    envName,
                    publishPath,
                    buildCommand,
                    nodeImageVersion,
                    docId,
                    gwProducts,
                    gwPlatforms,
                    gwVersions,
                    workingDir
                )
                docBuildType.steps.step(yarnBuildStep)
                docBuildType.steps.stepsOrder.add(0, yarnBuildStep.id.toString())
                docBuildType.triggers.vcs { BuildTriggers.createVcsTriggerForNonDitaBuilds(src_id) }
            } else if (gwBuildType == "dita") {
                if (envName == "prod") {
                    val copyFromStagingToProdStep = BuildSteps.createCopyFromStagingToProdStep(publishPath)
                    docBuildType.steps.step(copyFromStagingToProdStep)
                    docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
                } else {
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
                    val srcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", src_id)
                    val srcUrl = srcConfig.getString("gitUrl")
                    val srcBranch = srcConfig.getString("branch")
                    val buildPdf = envName == "int"
                    val buildDitaProjectStep = BuildSteps.createBuildDitaProjectStep(
                        rootMap,
                        docId,
                        gwProducts,
                        gwPlatforms,
                        gwVersions,
                        buildFilter,
                        indexRedirect,
                        srcUrl,
                        srcBranch,
                        buildPdf,
                        workingDir
                    )
                    docBuildType.steps.step(buildDitaProjectStep)
                    docBuildType.steps.stepsOrder.add(0, buildDitaProjectStep.id.toString())
                }
            }
            docBuildSubProjects.add(docBuildType)
        }

        return Project {
            name = "$docTitle ($docId)"
            id = Helpers.resolveRelativeIdFromIdString(docId)

            docBuildSubProjects.forEach {
                buildType(it)
            }
        }
    }

    fun createRootProjectForDocs(): Project {
        val mainProject = Project {
            name = "Docs"
            id = Helpers.resolveRelativeIdFromIdString("Docs")
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

object Sources {}

object Server {}

object BuildDocSiteOutputFromDita : BuildOutputFromDita(createZipPackage = false)

open class BuildOutputFromDita(createZipPackage: Boolean) : Template({
    if (createZipPackage) {
        name = "Build the doc site and local output from DITA"
    } else {
        name = "Build the doc site output from DITA"
        artifactRules = """
            %env.SOURCES_ROOT%/%env.OUTPUT_PATH%/build-data.json => json
        """.trimIndent()
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
                
                export DITA_BASE_COMMAND="dita -i \"%env.WORKING_DIR%/%env.ROOT_MAP%\" -o \"%env.WORKING_DIR%/%env.OUTPUT_PATH%\" --use-doc-portal-params yes --gw-doc-id \"%env.GW_DOC_ID%\" --gw-product \"%env.GW_PRODUCT%\" --gw-platform \"%env.GW_PLATFORM%\" --gw-version \"%env.GW_VERSION%\" --generate.build.data yes --git.url \"%env.GIT_URL%\" --git.branch \"%env.GIT_BRANCH%\""
                
                if [[ ! -z "%env.FILTER_PATH%" ]]; then
                    export DITA_BASE_COMMAND+=" --filter \"%env.WORKING_DIR%/%env.FILTER_PATH%\""
                fi
                
                if [[ "%env.BUILD_PDF%" == "true" ]]; then
                    export DITA_BASE_COMMAND+=" -f wh-pdf --dita.ot.pdf.format pdf5_Guidewire"
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


object BuildSteps {
    fun createCrawlDocStep(deploy_env: String, doc_id: String): ScriptBuildStep {
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

    fun createGetConfigFileStep(deploy_env: String): ScriptBuildStep {

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
                
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                export CONFIG_FILE_URL="$configFileUrl"
                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                
                if [[ "$deploy_env" == "prod" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > ${'$'}CONFIG_FILE                 
                elif [[ "$deploy_env" == "portal2" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc"))]}' > ${'$'}CONFIG_FILE
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

    fun createBuildZipPackageStep(working_dir: String, output_path: String): ScriptBuildStep {

        val zipSrcDir = "zip"
        val zipPackageName = "docs.zip"

        return ScriptBuildStep {
            name = "Build a ZIP package"
            id = "BUILD_ZIP_PACKAGE"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Creating a ZIP package"
                cd "${working_dir}/${zipSrcDir}/${output_path}" || exit
                zip -r "${working_dir}/${zipSrcDir}/${zipPackageName}" * &&
                    mv "${working_dir}/${zipSrcDir}/${zipPackageName}" "/${output_path}/" &&
                    rm -rf "${working_dir}/${zipSrcDir}"
            """.trimIndent()
        }
    }

    fun createUploadContentToS3BucketStep(
        deploy_env: String,
        publish_path: String,
        working_dir: String
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

    fun createBuildDitaProjectStep(
        root_map: String,
        doc_id: String,
        gw_products: String,
        gw_platforms: String,
        gw_versions: String,
        build_filter: String?,
        index_redirect: Boolean,
        git_url: String,
        git_branch: String,
        build_pdf: Boolean,
        working_dir: String
    ): ScriptBuildStep {

        var ditaBuildCommand = """
            dita -i \"${working_dir}/${root_map}\" \
            -o \"${working_dir}/out\" \ 
            --use-doc-portal-params yes \
            --gw-doc-id \"${doc_id}\" \ 
            --gw-product \"$gw_products\" \ 
            --gw-platform \"$gw_platforms\" \
            --gw-version \"$gw_versions\" \ 
            --generate.build.data yes \
            --git.url \"$git_url" \
            --git.branch \"$git_branch\""
        """.trimIndent()

        if (!build_filter.isNullOrEmpty()) {
            ditaBuildCommand += " --filter \"${working_dir}/${build_filter}\""
        }

        ditaBuildCommand += if (build_pdf) {
            " -f wh-pdf --dita.ot.pdf.format pdf5_Guidewire"
        } else {
            " -f webhelp_Guidewire_validate"
        }

        if (index_redirect) {
            ditaBuildCommand += " --create-index-redirect yes --webhelp.publication.toc.links all"
        }

        return ScriptBuildStep {
            name = "Build the DITA project"
            id = "BUILD_DITA_PROJECT"
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



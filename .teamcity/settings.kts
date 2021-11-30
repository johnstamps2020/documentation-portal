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


    subProject(HelperObjects.createRootProjectForDocs())
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

    private fun getCleanId(stringToClean: String): String {
        val hashString = stringToClean.hashCode().toString()
        return removeSpecialCharacters(hashString)
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

    class DocVcsRoot(
        vcs_root_id: RelativeId,
        git_source_url: String,
        git_source_branch: String,
        git_additional_branches: List<String> = emptyList()
    ) : GitVcsRoot({
        id = vcs_root_id
        name = vcs_root_id.toString()
        url = git_source_url
        authMethod = uploadedKey {
            uploadedKey = "sys-doc.rsa"
        }

        if (git_source_branch != "") {
            branch = "refs/heads/$git_source_branch"
        }

        if (git_additional_branches.isNotEmpty()) {
            var branchSpecification = ""
            for (element in git_additional_branches) {
                branchSpecification += "+:refs/heads/${element}\n"
            }
            branchSpec = branchSpecification
        }

    })

    fun resolveRelativeIdFromIdString(id: String): RelativeId {
        return RelativeId(removeSpecialCharacters(id))
    }

    fun createYarnBuildType(
        build_type_name: String,
        build_type_id: RelativeId,
        deploy_env: String,
        publish_path: String,
        working_dir: String,
        build_command: String?,
        node_image_version: String?,
        doc_id: String,
        gw_products: String,
        gw_platforms: String,
        gw_versions: String,
        vcs_root_id: String
    ): BuildType {
        return BuildType {
            name = build_type_name
            id = build_type_id

            vcs {
                root(HelperObjects.resolveRelativeIdFromIdString(vcs_root_id))
                cleanCheckout = true
            }

            steps {
                step(
                    BuildSteps.createBuildYarnProjectStep(
                        deploy_env,
                        publish_path,
                        working_dir,
                        build_command,
                        node_image_version,
                        doc_id,
                        gw_products,
                        gw_platforms,
                        gw_versions
                    )
                )
                step(BuildSteps.createGetConfigFileStep(deploy_env))
                step(BuildSteps.createCrawlDocStep(deploy_env, doc_id))
            }

            features {
                feature(BuildFeatures.GwDockerSupportFeature)
            }

            triggers {
                vcs {
                    BuildTriggers.createVcsTriggerForNonDitaBuilds(vcs_root_id)
                }
            }
        }
    }


    fun createDocVcsRoot(src_id: String): GitVcsRoot {
        val srcConfig = getObjectById(sourceConfigs, "id", src_id)
        return GitVcsRoot {
            name = src_id
            id = resolveRelativeIdFromIdString(src_id)
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
        val workingDir = if (build_config.has("workingDir")) build_config.getString("workingDir") else ""
        val docConfig = getObjectById(docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val metadata = docConfig.getJSONObject("metadata")
        val gwProducts = metadata.getJSONArray("product").joinToString(separator = ",")
        val gwPlatforms = metadata.getJSONArray("platform").joinToString(separator = ",")
        val gwVersions = metadata.getJSONArray("version").joinToString(separator = ",")
        val publishPath = docConfig.getString("url")
        for (i in 0 until docEnvironments.length()) {
            val envName = docEnvironments.getString(i)
            val buildTypeName = "Publish to $envName"
            val buildTypeId = resolveRelativeIdFromIdString("$docId$envName")
            if (gwBuildType == "yarn") {
                val nodeImageVersion =
                    if (build_config.has("nodeImageVersion")) build_config.getString("nodeImageVersion") else null
                val buildCommand =
                    if (build_config.has("yarnBuildCustomCommand")) build_config.getString("yarnBuildCustomCommand") else null
                docBuildSubProjects.add(
                    createYarnBuildType(
                        buildTypeName,
                        buildTypeId,
                        envName,
                        publishPath,
                        workingDir,
                        buildCommand,
                        nodeImageVersion,
                        docId,
                        gwProducts,
                        gwPlatforms,
                        gwVersions,
                        src_id
                    )
                )
            }

        }
        return Project {
            name = "$docTitle ($docId)"
            id = resolveRelativeIdFromIdString(docId)

            docBuildSubProjects.forEach {
                buildType(it)
            }
        }
    }

    fun createRootProjectForDocs(): Project {
        val mainProject = Project {
            name = "Docs"
            id = resolveRelativeIdFromIdString("Docs")
        }
        val srcIds = mutableListOf<String>()
        for (i in 0 until buildConfigs.length()) {
            val buildConfig = buildConfigs.getJSONObject(i)
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


object ZipUpSources : Template({
    name = "Zip up the source files"

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
        text("env.ZIP_FILENAME", "%ZIP_FILENAME%", allowEmpty = false)
    }

    vcs {
        root(vcsrootmasteronly)
    }

    steps {
        script {
            name = "Create a zip file of all the sources"
            id = "BUILD_OUTPUT"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                    export TARGET_URL="%env.TARGET_URL_PROD%"
                fi
                
                export BASE_URL=/%env.PUBLISH_PATH%/
                cd %env.SOURCES_ROOT%/%env.WORKING_DIR%
                zip -r %env.ZIP_FILENAME%.zip . -x '*.git*'
                zip -r %env.ZIP_FILENAME%.zip .gitignore
                mkdir out
                mv %env.ZIP_FILENAME%.zip out/%env.ZIP_FILENAME%.zip
            """.trimIndent()
        }
    }

    vcs {
        cleanCheckout = true
    }
})

object BuildDocSiteOutputFromDita : BuildOutputFromDita(createZipPackage = false)
object BuildDocSiteAndLocalOutputFromDita : BuildOutputFromDita(createZipPackage = true)

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
        return ScriptBuildStep {
            name = "Crawl the document and update the index"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export DOC_ID="$doc_id"
                
                if [[ "$deploy_env" == "prod" ]]; then
                    export DOC_S3_URL="https://ditaot.internal.us-east-2.service.guidewire.net"
                    export ELASTICSEARCH_URLS="https://docsearch-doctools.internal.us-east-2.service.guidewire.net"
                    export APP_BASE_URL="https://docs.guidewire.com"
                elif [[ "$deploy_env" == "portal2" ]]; then
                    export DOC_S3_URL="https://portal2.internal.us-east-2.service.guidewire.net"
                    export ELASTICSEARCH_URLS="https://docsearch-doctools.internal.us-east-2.service.guidewire.net"
                    export APP_BASE_URL="https://docs.guidewire.com"
                else
                    export DOC_S3_URL="https://ditaot.internal.${deploy_env}.ccs.guidewire.net"
                    export ELASTICSEARCH_URLS="https://docsearch-doctools.${deploy_env}.ccs.guidewire.net"
                    export APP_BASE_URL="https://docs.${deploy_env}.ccs.guidewire.net"
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

    fun createGetConfigFileStep(deploy_env: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Get config file"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="%teamcity.build.workingDir%/config.json"
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                
                if [[ "$deploy_env" == "prod" ]]; then
                    export CONFIG_FILE_URL="https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json"
                    curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > ${'$'}CONFIG_FILE                 
                elif [[ "$deploy_env" == "portal2" ]]; then
                    export CONFIG_FILE_URL="https://ditaot.internal.us-east-2.service.guidewire.net/portal-config/config.json"
                    curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc"))]}' > ${'$'}CONFIG_FILE
                else
                    export CONFIG_FILE_URL="https://ditaot.internal.${deploy_env}.ccs.guidewire.net/portal-config/config.json"
                    curl ${'$'}CONFIG_FILE_URL > ${'$'}CONFIG_FILE
                fi
            """.trimIndent()
        }
    }

    fun createBuildYarnProjectStep(
        deploy_env: String,
        publish_path: String,
        working_dir: String,
        build_command: String?,
        node_image_version: String?,
        doc_id: String,
        gw_products: String,
        gw_platforms: String,
        gw_versions: String
    ): ScriptBuildStep {
        val nodeImageVersion = node_image_version ?: "12.14.1"
        val buildCommand = build_command ?: "build"
        return ScriptBuildStep {
            name = "Build the yarn project"
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export GW_DOC_ID="$doc_id"
                    export GW_PRODUCT="$gw_products"
                    export GW_PLATFORM="$gw_platforms"
                    export GW_VERSION="$gw_versions"
                    
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
                    
                    if [[ "$deploy_env" == "prod" ]]; then
                        export TARGET_URL="https://docs.guidewire.com"
                    else
                        export TARGET_URL="https://docs.${deploy_env}.ccs.guidewire.net"
                    fi
                    
                    export BASE_URL=/${publish_path}/
                    cd src_root/${working_dir}
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



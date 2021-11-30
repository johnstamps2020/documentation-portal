import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

version = "2020.1"

project {

    params {
        param("env.NAMESPACE", "doctools")
    }


    subProject(HelperObjects.createDocBuilds())

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


    fun createDocBuildVcsRoot(src_id: String): GitVcsRoot {
        val srcConfig = getObjectById(sourceConfigs, "id", src_id)
        return GitVcsRoot {
            name = src_id
            id = RelativeId(removeSpecialCharacters(src_id))
            url = srcConfig.getString("gitUrl")
            branch = srcConfig.getString("branch")
            authMethod = uploadedKey {
                uploadedKey = "sys-doc.rsa"
            }
        }
    }

    fun createDocBuildProject(build_config: JSONObject): Project {
        val docId = build_config.getString("docId")
        val docConfig = getObjectById(docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val mainProject = Project {
            name = "$docTitle ($docId)"
            id = RelativeId(removeSpecialCharacters(docId))
        }
        for (i in 0 until docEnvironments.length()) {
            val envName = docEnvironments.getString(i)
            mainProject.subProject {
                name = "Publish to $envName"
                id = RelativeId(removeSpecialCharacters("$docId$envName"))
            }
        }
        return mainProject
    }

    fun createDocBuilds(): Project {
        val mainProject = Project {
            name = "Docs"
            id = RelativeId(removeSpecialCharacters("Docs"))
        }
        val srcIds = mutableListOf<String>()
        for (i in 0 until buildConfigs.length()) {
            val buildConfig = buildConfigs.getJSONObject(i)
            val docProject = createDocBuildProject(buildConfig)
            mainProject.subProject(docProject)
            srcIds.add(buildConfig.getString("srcId"))
        }
        for (srcId in srcIds.distinct()) {
            mainProject.vcsRoot(createDocBuildVcsRoot(srcId))
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

    steps {
        script {
            name = "Build the yarn project"
            id = "BUILD_OUTPUT"
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
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
                    
                    if [[ "%env.DEPLOY_ENV%" == "prod" ]]; then
                        export TARGET_URL="%env.TARGET_URL_PROD%"
                    fi
                    
                    export BASE_URL=/%env.PUBLISH_PATH%/
                    cd %env.SOURCES_ROOT%/%env.WORKING_DIR%
                    yarn
                    yarn ${'$'}{YARN_BUILD_COMMAND}
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

object BuildDocSiteOutputFromDita : BuildOutputFromDita(createZipPackage = false)
object BuildDocSiteAndLocalOutputFromDita : BuildOutputFromDita(createZipPackage = true)


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
        text(
            "env.DOC_S3_URL_PORTAL2",
            "https://portal2.internal.us-east-2.service.guidewire.net",
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




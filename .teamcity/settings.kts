import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.buildSteps.*
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import jetbrains.buildServer.configs.kotlin.ui.add
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.*
import java.math.BigInteger
import java.security.MessageDigest

version = "2022.04"
project {

//    TODO: Uncomment these builds when the pipeline is ready to merge
//    GwVcsRoots.createGitVcsRootsFromConfigFiles().forEach {
//        vcsRoot(it)
//    }
    vcsRoot(GwVcsRoots.DocumentationPortalGitVcsRoot)
//    vcsRoot(GwVcsRoots.DitaOtPluginsVcsRoot)
    subProject(Database.rootProject)
//    subProject(Runners.rootProject)
//    subProject(Docs.rootProject)
//    subProject(Sources.rootProject)
//    subProject(Recommendations.rootProject)
//    subProject(Content.rootProject)
//    subProject(BuildListeners.rootProject)
//    subProject(Apps.rootProject)
    subProject(Server.rootProject)
    subProject(Frontend.rootProject)
//    subProject(Custom.rootProject)
    listOf(GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD).forEach {
        buildType(GwBuilds.createDeployDocPortalBuildType(it.envName))
    }

    features.feature(GwProjectFeatures.GwOxygenWebhelpLicenseProjectFeature)
    features.feature(GwProjectFeatures.GwAntennaHouseFormatterServerProjectFeature)
    features.feature(GwProjectFeatures.GwBuildListenerLimitProjectFeature)
}

enum class GwDeployEnvs(val envName: String) {
    DEV("dev"), STAGING("staging"), PROD("prod"), OMEGA2_ANDROMEDA("omega2-andromeda"), PORTAL2("portal2")
}

enum class GwBuildTypes(val buildTypeName: String) {
    DITA("dita"), YARN("yarn"), STORYBOOK("storybook"), SOURCE_ZIP("source-zip"), JUST_COPY("just-copy")
}

enum class GwValidationModules(val validationName: String) {
    VALIDATORS_DITA("validators_dita"), VALIDATORS_FILES("validators_files"), VALIDATORS_IMAGES("validators_images"), EXTRACTORS_DITA_OT_LOGS(
        "extractors_dita_ot_logs"
    ),
    EXTRACTORS_SCHEMATRON_REPORTS("extractors_schematron_reports")
}

enum class GwDitaOutputFormats(val formatName: String) {
    WEBHELP("webhelp"),
    PDF("pdf"),
    WEBHELP_WITH_PDF("webhelp_with_pdf"),
    SINGLEHTML("singlehtml"),
    DITA("dita"),
    HTML5("html5"),
    HTML5_WITH_PDF("html5_with_pdf")
}

enum class GwConfigParams(val paramValue: String) {
    CONFIG_FILES_ROOT_DIR("%teamcity.build.checkoutDir%/.teamcity/config"), CONFIG_SCHEMA_FILE_PATH("${CONFIG_FILES_ROOT_DIR.paramValue}/config-schema.json"), BUILDS_CONFIG_FILES_DIR(
        "${CONFIG_FILES_ROOT_DIR.paramValue}/builds"
    ),
    DOCS_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/docs"), SOURCES_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/sources"), MERGED_CONFIG_FILE(
        "merge-all.json"
    ),
    DOCS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/out/docs"), BUILDS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/out/builds"), SOURCES_CONFIG_FILES_OUT_DIR(
        "${CONFIG_FILES_ROOT_DIR.paramValue}/out/sources"
    ),
    DITA_BUILD_OUT_DIR("out"), YARN_BUILD_OUT_DIR("build"), STORYBOOK_BUILD_OUT_DIR("dist"), SOURCE_ZIP_BUILD_OUT_DIR("out"), BUILD_DATA_DIR(
        "json"
    ),
    BUILD_DATA_FILE("build-data.json"), COMMON_GW_DITAVALS_DIR("common_gw_ditavals"), BITBUCKET_SSH_KEY("svc-doc-bitbucket"),
    ECR_HOST("627188849628.dkr.ecr.us-west-2.amazonaws.com"),
    ECR_HOST_PROD("954920275956.dkr.ecr.us-east-1.amazonaws.com"),
    AWS_ROLE("arn:aws:iam::627188849628:role/aws_gwre-ccs-dev_tenant_doctools_developer"),
    AWS_ROLE_PROD("arn:aws:iam::954920275956:role/aws_orange-prod_tenant_doctools_developer"),
    ARTIFACTORY_HOST("artifactory.guidewire.com"),
    OKTA_IDP("0oamwriqo1E1dOdd70h7"),
    OKTA_IDP_PROD("0oa25tk18zhGOqMfj357"),
    OKTA_ISSUER("https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7"),
    OKTA_ISSUER_PROD("https://guidewire-hub.okta.com/oauth2/aus11vix3uKEpIfSI357"),
    OKTA_ISSUER_APAC("https://guidewire-hub-apac.okta.com/oauth2/ausbg05gfcTZQ7bpH3l6"),
    OKTA_ISSUER_EMEA("https://guidewire-hub-eu.okta.com/oauth2/ausc2q01c40dNZII0416"),
    OKTA_SCOPES("NODE_Hawaii_Docs_Web.read"),
    OKTA_SCOPES_PROD("Documentation_portal.read"),
    OKTA_AUDIENCE("Guidewire"),
    OKTA_ADMIN_GROUPS("doctools"),
    GW_COMMUNITY_CUSTOMER_IDP("0oau503zlhhFLwTqF0h7"),
    GW_COMMUNITY_CUSTOMER_IDP_PROD("0oa6c4x5z3fYXUWoE357"),
    GW_COMMUNITY_PARTNER_IDP("0oapv9i36yEMFLjxS0h7"),
    GW_COMMUNITY_PARTNER_IDP_PROD("0oa6c4yaoikrU91Hw357"),
    CONFIG_DB_HOST_DEV("tenant-doctools-docportal-${GwDeployEnvs.DEV.envName}-1.crahnfhpsx5k.us-west-2.rds.amazonaws.com"),
    CONFIG_DB_HOST_STAGING("tenant-doctools-docportal-${GwDeployEnvs.STAGING.envName}-1.crahnfhpsx5k.us-west-2.rds.amazonaws.com"),
    CONFIG_DB_HOST_PROD("tenant-doctools-docportal-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-1.c3qnnou7xlkq.us-east-1.rds.amazonaws.com"),

    // TODO: Change croissant to docportal before merge to master
    DOC_PORTAL_APP_NAME("croissant"),
    DOC_PORTAL_FRONTEND_APP_NAME("docportal-frontend"),
    DOC_PORTAL_KUBE_DEPLOYMENT_FILE("server/kube/deployment.yml"),

    // TODO: Change the path to the gateway config file after merge to master
    DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE("server/kube/gateway-config-croissant.yml"),
    DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE_PROD("server/kube/gateway-config-croissant.yml"),
    DOC_PORTAL_FRONTEND_KUBE_DEPLOYMENT_FILE("landing-pages/kube/deployment.yml"),
    S3_KUBE_DEPLOYMENT_FILE("aws/s3/kube/service-gateway-config.yml")
}

enum class GwDockerImages(val imageUrl: String) {
    DOC_PORTAL("${GwConfigParams.ECR_HOST.paramValue}/tenant-doctools-docportal"), DOC_PORTAL_PROD("${GwConfigParams.ECR_HOST_PROD.paramValue}/tenant-doctools-docportal"), DOC_PORTAL_FRONTEND(
        "${GwConfigParams.ECR_HOST.paramValue}/tenant-doctools-docportal-frontend"
    ),
    DOC_PORTAL_FRONTEND_PROD("${GwConfigParams.ECR_HOST_PROD.paramValue}/tenant-doctools-docportal-frontend"),
    DITA_OT_3_4_1(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/dita-ot:3.4.1"
    ),
    DITA_OT_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/dita-ot:latest"), ATMOS_DEPLOY_2_6_0(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/devex-docker-dev/atmosdeploy:2.6.0"
    ),
    CONFIG_DEPLOYER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/config-deployer:latest"), DOC_CRAWLER_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/doc-crawler:latest"
    ),
    INDEX_CLEANER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/index-cleaner:latest"), BUILD_MANAGER_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/build-manager:latest"
    ),
    RECOMMENDATION_ENGINE_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/recommendation-engine:latest"), FLAIL_SSG_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/flail-ssg:latest"
    ),
    LION_PKG_BUILDER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/lion-pkg-builder:latest"), LION_PAGE_BUILDER_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/lion-page-builder:latest"
    ),
    UPGRADE_DIFFS_PAGE_BUILDER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/upgradediffs-page-builder:latest"), SITEMAP_GENERATOR_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/sitemap-generator:latest"
    ),
    DOC_VALIDATOR_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/doc-validator:latest"), PYTHON_3_9_SLIM_BUSTER(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/hub-docker-remote/python:3.9-slim-buster"
    ),
    NODE_REMOTE_BASE("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/hub-docker-remote/node"), NODE_16_16_0("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/hub-docker-remote/node:16.16.0"), NODE_18_14_0(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/hub-docker-remote/node:18.14.0"
    ),
    GENERIC_14_14_0_YARN_CHROME(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/jutro-docker-dev/generic:14.14.0-yarn-chrome"
    )
}

enum class GwStaticFilesModes(val modeName: String) {
    LANDING_PAGES("landing_pages"), LOCALIZED_PAGES("localized_pages"), UPGRADE_DIFFS("upgrade_diffs"), SITEMAP("sitemap"), HTML5(
        "html5"
    )
}

enum class GwConfigTypes(val typeName: String) {
    DOCS("docs"), SOURCES("sources"), BUILDS("builds")
}

enum class GwAtmosLabels(val labelValue: String) {
    POD_NAME("doctools"), DEPT_CODE("284"),
}

// TODO: Remove croissant from the image tag before merge to master
enum class GwDockerImageTags(val tagValue: String) {
    DOC_PORTAL("latest-croissant"), DOC_PORTAL_FRONTEND("latest")
}

object Database {
    private val testConfigDocsBuildType = createTestConfigBuildType(GwConfigTypes.DOCS.typeName)
    private val testConfigSourcesBuildType = createTestConfigBuildType(GwConfigTypes.SOURCES.typeName)
    private val testConfigBuildsBuildType = createTestConfigBuildType(GwConfigTypes.BUILDS.typeName)
    private val validateDbDeploymentBuildTypeDev = createValidateDbDeploymentBuildType(GwDeployEnvs.DEV.envName)
    private val validateDbDeploymentBuildTypeStaging = createValidateDbDeploymentBuildType(GwDeployEnvs.STAGING.envName)
    private val validateDbDeploymentBuildTypeProd = createValidateDbDeploymentBuildType(GwDeployEnvs.PROD.envName)
    private val uploadLegacyConfigsToDbBuildType = createUploadLegacyConfigsToDbBuildType()
    val deployDbBuildTypeDev = createDeployDbBuildType(GwDeployEnvs.DEV.envName)
    val deployDbBuildTypeStaging = createDeployDbBuildType(GwDeployEnvs.STAGING.envName)
    val deployDbBuildTypeProd = createDeployDbBuildType(GwDeployEnvs.PROD.envName)
    val rootProject = createRootProjectForDatabase()

    private fun createRootProjectForDatabase(): Project {
        return Project {
            name = "Database"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            buildType(deployDbBuildTypeDev)
            buildType(deployDbBuildTypeStaging)
            buildType(deployDbBuildTypeProd)
            buildType(uploadLegacyConfigsToDbBuildType)
            listOf(GwDeployEnvs.DEV, GwDeployEnvs.PROD).forEach {
                buildType(createSyncDbDataBuildType(it.envName))
            }
            buildType(testConfigDocsBuildType)
            buildType(testConfigSourcesBuildType)
            buildType(testConfigBuildsBuildType)
            buildType(validateDbDeploymentBuildTypeDev)
            buildType(validateDbDeploymentBuildTypeStaging)
            buildType(validateDbDeploymentBuildTypeProd)
        }
    }

    private fun createTestConfigBuildType(configType: String): BuildType {
        val scriptStepContent = when (configType) {
            GwConfigTypes.DOCS.typeName -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}"
                 
                    # Test merged config files
                    config_deployer test "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.paramValue}"
                """.trimIndent()

            GwConfigTypes.SOURCES.typeName -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}"
                 
                    # Test merged config files
                    config_deployer test "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.paramValue}"
                """.trimIndent()

            GwConfigTypes.BUILDS.typeName -> """
                    #!/bin/bash
                    set -xe
                    
                    # Merge config files
                    config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}"
                    config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}"
                    config_deployer merge "${GwConfigParams.BUILDS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.paramValue}"
                 
                    # Test merged config files                            
                    config_deployer test "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}" \
                    --sources-path "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}" \
                    --docs-path "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}" \
                    --schema-path "${GwConfigParams.CONFIG_SCHEMA_FILE_PATH.paramValue}"  
                """.trimIndent()

            else -> "echo Nothing to test here"
        }
        val vcsTriggerPath = when (configType) {
            GwConfigTypes.BUILDS.typeName -> ".teamcity/config/**"
            else -> ".teamcity/config/${configType}/**"
        }
        return BuildType {
            name = "Test $configType config files"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Run tests for config files"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = scriptStepContent

                    dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.imageUrl
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

    private fun createValidateDbDeploymentBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val tfstateKey = "docportal/db/terraform.tfstate"
        val s3Bucket = when (deployEnv) {
            GwDeployEnvs.DEV.envName -> "tenant-doctools-${GwDeployEnvs.DEV.envName}-terraform"
            GwDeployEnvs.STAGING.envName -> "tenant-doctools-${GwDeployEnvs.STAGING.envName}-terraform"
            GwDeployEnvs.PROD.envName -> "tenant-doctools-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-terraform"
            else -> ""
        }
        val validateDbDeploymentBuildType = BuildType {
            name = "Validate database deployment to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Validate Terraform config for db"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                    #!/bin/bash
                    set -eux
                    
                    $awsEnvVars

                    cd db

                    terraform init \
                        -backend-config="bucket=$s3Bucket" \
                        -backend-config="region=${'$'}{AWS_DEFAULT_REGION}" \
                        -backend-config="key=$tfstateKey" \
                        -input=false
                    terraform validate
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"

                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
            }
        }

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                validateDbDeploymentBuildType.triggers.vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:db/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }
        }

        return validateDbDeploymentBuildType
    }

    private fun createDeployDbBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val tfstateKey = "docportal/db/terraform.tfstate"
        val envLevel: String
        val starSystemName: String
        val quadrantName: String
        val s3Bucket: String
        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                envLevel = "Non-Prod"
                starSystemName = "needle"
                quadrantName = "pi7"
                s3Bucket = "tenant-doctools-${GwDeployEnvs.DEV.envName}-terraform"
            }

            GwDeployEnvs.STAGING.envName -> {
                envLevel = "Non-Prod"
                starSystemName = "needle"
                quadrantName = "pi11"
                s3Bucket = "tenant-doctools-${GwDeployEnvs.STAGING.envName}-terraform"
            }

            GwDeployEnvs.PROD.envName -> {
                envLevel = "Prod"
                starSystemName = "andromeda"
                quadrantName = "omega2"
                s3Bucket = "tenant-doctools-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-terraform"
            }

            else -> {
                envLevel = ""
                starSystemName = ""
                quadrantName = ""
                s3Bucket = ""
            }
        }
        val deployDatabaseBuildType = BuildType {
            name = "Deploy database to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Deploy db with Terraform"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                    #!/bin/bash
                    set -eux
                    
                    $awsEnvVars

                    cd db

                    terraform init \
                        -backend-config="bucket=$s3Bucket" \
                        -backend-config="region=${'$'}{AWS_DEFAULT_REGION}" \
                        -backend-config="key=$tfstateKey" \
                        -input=false
                    terraform apply \
                        -var="star_system_name=$starSystemName" \
                        -var="quadrant_name=$quadrantName" \
                        -var="deploy_env=$atmosDeployEnv" \
                        -var="region=${'$'}{AWS_DEFAULT_REGION}" \
                        -var="env_level=$envLevel" \
                        -var="pod_name=${GwAtmosLabels.POD_NAME.labelValue}" \
                        -var="dept_code=${GwAtmosLabels.DEPT_CODE.labelValue}" \
                        -input=false \
                        -auto-approve
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
            }
        }

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                deployDatabaseBuildType.dependencies.snapshot(validateDbDeploymentBuildTypeDev) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployDatabaseBuildType.triggers.vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:db/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

            GwDeployEnvs.STAGING.envName -> {
                deployDatabaseBuildType.dependencies.snapshot(
                    validateDbDeploymentBuildTypeStaging
                ) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            GwDeployEnvs.PROD.envName -> {
                deployDatabaseBuildType.dependencies.snapshot(validateDbDeploymentBuildTypeProd) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
        }

        return deployDatabaseBuildType
    }

    // TODO: Idea:
    //  - Extract the db dump step to a separate build
    //  - Publish the db dump as an artifact
    //  - Add an artifact dependency to the sync db data builds to get the db dump from the artifacts of the new build
    //  - With this approach, we only dump data once and we don't need to create multiple pods in Kubernetes
    private fun createSyncDbDataBuildType(deployEnv: String): BuildType {
        val imageName = "alpine"
        val podName = "postgresql-client-shell-teamcity-$deployEnv"
        val dbDumpZipPackageName = "docportalconfig.zip"
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)
        val dbDumpAtmosDeployEnv = Helpers.getAtmosDeployEnv(GwDeployEnvs.STAGING.envName)
        val dbRestoreAwsEnvVars: String
        val dbRestoreAtmosDeployEnv: String
        val dbRestoreConfigDbHost: String
        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                dbRestoreAwsEnvVars = awsEnvVars
                dbRestoreAtmosDeployEnv = Helpers.getAtmosDeployEnv(GwDeployEnvs.DEV.envName)
                dbRestoreConfigDbHost = GwConfigParams.CONFIG_DB_HOST_DEV.paramValue
            }

            GwDeployEnvs.PROD.envName -> {
                dbRestoreAwsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.envName)
                dbRestoreAtmosDeployEnv = Helpers.getAtmosDeployEnv(GwDeployEnvs.PROD.envName)
                dbRestoreConfigDbHost = GwConfigParams.CONFIG_DB_HOST_PROD.paramValue
            }

            else -> {
                dbRestoreAwsEnvVars = ""
                dbRestoreAtmosDeployEnv = ""
                dbRestoreConfigDbHost = ""
            }
        }

        val syncDbDataBuildType = BuildType {
            name = "Sync database data to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            steps {
                script {
                    name = "Create a db dump on staging"
                    scriptContent = """
                        #!/bin/bash 
                        set -eu
                                                        
                        # Set env variables
                        $awsEnvVars
                        export AWS_SECRET=${'$'}(aws secretsmanager get-secret-value --secret-id tenant-doctools-docportal)
                        export CONFIG_DB_NAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_name' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_USERNAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_username' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_PASSWORD=${'$'}(jq -r '.SecretString | fromjson | .config_db_password' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_HOST=${GwConfigParams.CONFIG_DB_HOST_STAGING.paramValue}
                        
                        EXIT_CODE=0
                        aws eks update-kubeconfig --name atmos-$dbDumpAtmosDeployEnv && kubectl config set-context --current --namespace=${GwAtmosLabels.POD_NAME.labelValue} && kubectl run $podName --image=$imageName --env="PGPASSWORD=${'$'}CONFIG_DB_PASSWORD" --env="PGUSER=${'$'}CONFIG_DB_USERNAME" --env="PGHOST=${'$'}CONFIG_DB_HOST" --env="PGDATABASE=${'$'}CONFIG_DB_NAME" --command -- /bin/sleep "infinite" || EXIT_CODE=${'$'}?
                        
                        if [ "${'$'}EXIT_CODE" -eq 0 ]; then
                            SECONDS=0
                            while [ ${'$'}SECONDS -le 30 ]; do
                              status=${'$'}(kubectl get pods $podName -o jsonpath='{.status.phase}')
                              if [ "${'$'}status" == "Running" ]; then
                                kubectl exec $podName -- sh -c "apk add --no-cache postgresql-client zip && pg_dump -Fd ${'$'}CONFIG_DB_NAME -j 5 -f ${'$'}CONFIG_DB_NAME && zip -r $dbDumpZipPackageName ${'$'}CONFIG_DB_NAME" && kubectl cp $podName:/$dbDumpZipPackageName ./$dbDumpZipPackageName || EXIT_CODE=${'$'}?
                                break
                              else
                                echo "Waiting for the $podName pod to be ready"
                                sleep 5
                              fi
                            done
                        fi
                        
                        kubectl get pods | grep $podName && kubectl delete pod $podName || EXIT_CODE=${'$'}?
                       
                        exit ${'$'}EXIT_CODE
                    """.trimIndent()
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                script {
                    name = "Restore the db dump from staging on $deployEnv"
                    scriptContent = """
                        #!/bin/bash 
                        set -eu
                                                        
                        # Set env variables
                        $dbRestoreAwsEnvVars
                        export AWS_SECRET=${'$'}(aws secretsmanager get-secret-value --secret-id tenant-doctools-docportal)
                        export CONFIG_DB_NAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_name' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_USERNAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_username' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_PASSWORD=${'$'}(jq -r '.SecretString | fromjson | .config_db_password' <<< "${'$'}AWS_SECRET")
                        export CONFIG_DB_HOST=$dbRestoreConfigDbHost
                        
                        EXIT_CODE=0
                        aws eks update-kubeconfig --name atmos-$dbRestoreAtmosDeployEnv && kubectl config set-context --current --namespace=${GwAtmosLabels.POD_NAME.labelValue} && kubectl run $podName --image=$imageName --env="PGPASSWORD=${'$'}CONFIG_DB_PASSWORD" --env="PGUSER=${'$'}CONFIG_DB_USERNAME" --env="PGHOST=${'$'}CONFIG_DB_HOST" --env="PGDATABASE=${'$'}CONFIG_DB_NAME" --command -- /bin/sleep "infinite" || EXIT_CODE=${'$'}?
                        
                        if [ "${'$'}EXIT_CODE" -eq 0 ]; then
                            SECONDS=0
                            while [ ${'$'}SECONDS -le 30 ]; do
                              status=${'$'}(kubectl get pods $podName -o jsonpath='{.status.phase}')
                              if [ "${'$'}status" == "Running" ]; then
                                kubectl cp ./$dbDumpZipPackageName $podName:/$dbDumpZipPackageName && kubectl exec $podName -- sh -c "apk add --no-cache postgresql-client zip && unzip ./$dbDumpZipPackageName && pg_restore --clean --if-exists -d ${'$'}CONFIG_DB_NAME ${'$'}CONFIG_DB_NAME" || EXIT_CODE=${'$'}?
                                break
                              else
                                echo "Waiting for the $podName pod to be ready"
                                sleep 5
                              fi
                            done
                        fi
                        
                        kubectl get pods | grep $podName && kubectl delete pod $podName || EXIT_CODE=${'$'}?
                       
                        exit ${'$'}EXIT_CODE
                    """.trimIndent()
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            dependencies {
                snapshot(uploadLegacyConfigsToDbBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:.teamcity/config/**
                        -:user=doctools:**
                        """.trimIndent()
                }
            }
        }

        return syncDbDataBuildType
    }

    // Legacy configs are uploaded only to the db on staging. Dev db and prod db sync data from staging.
    private fun createUploadLegacyConfigsToDbBuildType(): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)
        val pagesDir = "%teamcity.build.checkoutDir%/frontend/pages"
        val outputDir = "%teamcity.build.checkoutDir%/output"
        val outputDirStaging = "${outputDir}/staging/pages"
        val outputDirProd = "${outputDir}/prod/pages"
        return BuildType {
            name = "Upload legacy configs to ${GwDeployEnvs.STAGING.envName} database"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            artifactRules = "response*.json => /"
            steps {
                step(GwBuildSteps.MergeAllLegacyConfigsStep)
                step(
                    GwBuildSteps.createRunFlailSsgStep(
                        pagesDir,
                        outputDirStaging,
                        GwDeployEnvs.STAGING.envName
                    )
                )
                step(
                    GwBuildSteps.createRunFlailSsgStep(
                        pagesDir,
                        outputDirProd,
                        GwDeployEnvs.PROD.envName
                    )
                )
                step(GwBuildSteps.createUploadLegacyConfigsAndPagesToS3BucketStep(GwDeployEnvs.STAGING.envName))
                nodeJS {
                    name = "Call doc portal endpoints to trigger upload"
                    id = Helpers.createIdStringFromName(this.name)
                    shellScript = """
                        #!/bin/sh
                        set -e
                        
                        $awsEnvVars
                        export APP_BASE_URL="${Helpers.getTargetUrl(GwDeployEnvs.STAGING.envName)}"
                        export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER.paramValue}"
                        export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES.paramValue}"
                        
                        cd ci/uploadLegacyConfigsToDb
                        yarn
                        node uploadLegacyConfigsToDb.mjs
                        """.trimIndent()
                    dockerImage = GwDockerImages.NODE_18_14_0.imageUrl
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            dependencies {
                snapshot(testConfigBuildsBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(testConfigDocsBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                snapshot(testConfigSourcesBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
        }
    }
}

object Runners {
    val rootProject = createRootProjectForRunners()

    private fun getDocConfigsFromBuildConfigsForEnv(deployEnv: String): List<JSONObject> {
        val docConfigsForEnv = mutableListOf<JSONObject>()
        Helpers.buildConfigs.forEach {
            val docId = it.getString("docId")
            val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
            val docEnvironments = docConfig.getJSONArray("environments")
            if (docEnvironments.contains(deployEnv)) {
                docConfigsForEnv.add(docConfig)
            }
        }
        return docConfigsForEnv
    }

    private fun getDocIdsForProductAndVersion(
        docConfigs: List<JSONObject>,
        gwProduct: String,
        gwVersion: String,
    ): List<String> {
        val matchingDocIds = mutableListOf<String>()
        docConfigs.forEach {
            val docId = it.getString("id")
            val metadata = it.getJSONObject("metadata")
            val gwProducts = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("product"))
            val gwVersions = Helpers.convertJsonArrayWithStringsToList(metadata.getJSONArray("version"))
            val docConfigMatchesProductAndVersion =
                gwProducts.any { p -> p == gwProduct } && gwVersions.any { v -> v == gwVersion }
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
                GwDeployEnvs.DEV.envName,
                GwDeployEnvs.STAGING.envName,
                GwDeployEnvs.PROD.envName
            ).map {
                subProject(createRunnersProjectForEnv(it))
            }
        }
    }

    private fun createRunnersProjectForEnv(deployEnv: String): Project {
        val docConfigsForEnv = getDocConfigsFromBuildConfigsForEnv(deployEnv)
        val productProjects = generateProductProjects(deployEnv, docConfigsForEnv)
        return Project {
            name = "Runners for $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            productProjects.forEach { pp ->
                pp.subProjects.forEach { vp ->
                    val gwProduct = pp.name
                    val gwVersion = vp.name
                    val matchingDocIds = getDocIdsForProductAndVersion(docConfigsForEnv, gwProduct, gwVersion)
                    if (matchingDocIds.size > 1) {
                        val publishAllDocsBuildType = createRunnerBuildType(
                            deployEnv, matchingDocIds, "Publish all docs", gwProduct, gwVersion
                        )
                        vp.buildType(publishAllDocsBuildType)
                    }
                }
                subProject(pp)
            }
        }
    }

    private fun generateProductProjects(deployEnv: String, docConfigs: List<JSONObject>): List<Project> {
        val productProjects = mutableListOf<Project>()
        for (docConfig in docConfigs) {
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
                        id = Helpers.resolveRelativeIdFromIdString("${this.name}${deployEnv}")

                        gwVersions.forEach {
                            subProject {
                                name = it
                                id = Helpers.resolveRelativeIdFromIdString("${this.name}${gwProduct}${deployEnv}")

                                buildType(createRunnerBuildType(deployEnv, listOf(docId), docTitle, gwProduct, it))
                            }
                        }
                    })
                } else {
                    for (gwVersion in gwVersions) {
                        val runnerBuildType =
                            createRunnerBuildType(deployEnv, listOf(docId), docTitle, gwProduct, gwVersion)
                        val existingVersionSubproject =
                            existingProductProject.subProjects.find { it.name == gwVersion }
                        if (existingVersionSubproject == null) {
                            existingProductProject.subProject {
                                name = gwVersion
                                id = Helpers.resolveRelativeIdFromIdString("${this.name}${gwProduct}${deployEnv}")

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
        deployEnv: String,
        docIds: List<String>,
        docTitle: String,
        gwProduct: String,
        gwVersion: String,
    ): BuildType {
        return BuildType {
            val idHash = Helpers.md5("${this.name}${deployEnv}${gwProduct}${gwVersion}${docIds.joinToString()}")
            name = "$docTitle ($idHash)"
            id = Helpers.resolveRelativeIdFromIdString(idHash)

            type = BuildTypeSettings.Type.COMPOSITE

            dependencies {
                docIds.forEach {
                    snapshot(Helpers.resolveRelativeIdFromIdString("Publish to ${deployEnv}${it}")) {
                        // Build runners reuse doc builds to avoid unnecessary build runs.
                        // This feature can't be used in runners for prod doc builds because the prod doc builds
                        // don’t use a VCS Root - they only copy from staging to prod.
                        // Therefore, runners can’t discover any changes in the VCS Root from which the staging output
                        // was built and as a result they don’t trigger the dependent doc build for prod.
                        if (deployEnv == GwDeployEnvs.PROD.envName) {
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

    private fun createYarnBuildTypes(
        envNames: List<String>,
        docId: String,
        srcId: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
        indexForSearch: Boolean,
        buildCommand: String?,
        nodeImageVersion: String?,
        gwPlatforms: String,
        gwProducts: String,
        gwVersions: String,
        customEnv: JSONArray?,
    ): List<BuildType> {
        val yarnBuildTypes = mutableListOf<BuildType>()
        for (env in envNames) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.YARN.buildTypeName,
                env,
                docId,
                srcId,
                publishPath,
                workingDir,
                outputDir,
                indexForSearch
            )
            if (env == GwDeployEnvs.PROD.envName) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publishPath)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                val yarnBuildStep = GwBuildSteps.createBuildYarnProjectStep(
                    env,
                    publishPath,
                    buildCommand,
                    nodeImageVersion,
                    docId,
                    gwProducts,
                    gwPlatforms,
                    gwVersions,
                    workingDir,
                    customEnv
                )
                docBuildType.steps.step(yarnBuildStep)
                docBuildType.steps.stepsOrder.add(0, yarnBuildStep.id.toString())
            }
            yarnBuildTypes.add(docBuildType)
        }
        return yarnBuildTypes
    }

    private fun createStorybookBuildTypes(
        envNames: List<String>,
        docId: String,
        srcId: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
        indexForSearch: Boolean,
        gwPlatforms: String,
        gwProducts: String,
        gwVersions: String,
        customEnv: JSONArray?,
    ): List<BuildType> {
        val storybookBuildTypes = mutableListOf<BuildType>()
        for (env in envNames) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.STORYBOOK.buildTypeName,
                env,
                docId,
                srcId,
                publishPath,
                workingDir,
                outputDir,
                indexForSearch
            )
            if (env == GwDeployEnvs.PROD.envName) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publishPath)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                val storybookBuildStep = GwBuildSteps.createBuildStorybookProjectStep(
                    env, publishPath, docId, gwProducts, gwPlatforms, gwVersions, workingDir, customEnv
                )
                docBuildType.steps.step(storybookBuildStep)
                docBuildType.steps.stepsOrder.add(0, storybookBuildStep.id.toString())
            }
            storybookBuildTypes.add(docBuildType)
        }
        return storybookBuildTypes
    }

    private fun createSourceZipBuildTypes(
        envNames: List<String>,
        docId: String,
        srcId: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
        indexForSearch: Boolean,
        zipFilename: String,
    ): List<BuildType> {
        val sourceZipBuildTypes = mutableListOf<BuildType>()
        for (env in envNames) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.SOURCE_ZIP.buildTypeName,
                env,
                docId,
                srcId,
                publishPath,
                workingDir,
                outputDir,
                indexForSearch
            )

            if (env == GwDeployEnvs.PROD.envName) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publishPath)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                val zipUpSourcesBuildStep = GwBuildSteps.createZipUpSourcesStep(
                    workingDir, outputDir, zipFilename
                )
                docBuildType.steps.step(zipUpSourcesBuildStep)
                docBuildType.steps.stepsOrder.add(0, zipUpSourcesBuildStep.id.toString())
            }
            sourceZipBuildTypes.add(docBuildType)
        }
        return sourceZipBuildTypes
    }

    private fun createJustCopyBuildTypes(
        envNames: List<String>,
        docId: String,
        srcId: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
    ): List<BuildType> {
        val justCopyBuildTypes = mutableListOf<BuildType>()
        for (env in envNames) {
            val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publishPath)
            if (env == GwDeployEnvs.PROD.envName) {
                val docBuildType = createInitialDocBuildType(
                    GwBuildTypes.JUST_COPY.buildTypeName,
                    env,
                    docId,
                    srcId,
                    publishPath,
                    workingDir,
                    outputDir,
                    false
                )
                docBuildType.steps.step(copyFromStagingToProdStep)
                justCopyBuildTypes.add(docBuildType)
            }
        }

        return justCopyBuildTypes
    }


    private fun createDitaBuildTypes(
        envNames: List<String>,
        docId: String,
        srcId: String,
        gitUrl: String,
        gitBranch: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
        docTitle: String,
        indexForSearch: Boolean,
        rootMap: String,
        indexRedirect: Boolean,
        buildFilter: String?,
        gwPlatforms: String,
        resourcesToCopy: JSONArray,
    ): List<BuildType> {
        val ditaBuildTypes = mutableListOf<BuildType>()
        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(srcId)

        for (env in envNames) {
            val docBuildType = createInitialDocBuildType(
                GwBuildTypes.DITA.buildTypeName,
                env,
                docId,
                srcId,
                publishPath,
                workingDir,
                outputDir,
                indexForSearch
            )
            if (env == GwDeployEnvs.PROD.envName) {
                val copyFromStagingToProdStep = GwBuildSteps.createCopyFromStagingToProdStep(publishPath)
                docBuildType.steps.step(copyFromStagingToProdStep)
                docBuildType.steps.stepsOrder.add(0, copyFromStagingToProdStep.id.toString())
            } else {
                docBuildType.artifactRules =
                    "${workingDir}/${outputDir}/${GwConfigParams.BUILD_DATA_FILE.paramValue} => ${GwConfigParams.BUILD_DATA_DIR.paramValue}"
                val buildDitaProjectStep: ScriptBuildStep
                val buildPdfs = when (env) {
                    GwDeployEnvs.STAGING.envName -> true
                    else -> false
                }
                val buildOutputForOfflineUse =
                    env == GwDeployEnvs.STAGING.envName && gwPlatforms.lowercase(Locale.getDefault())
                        .contains("self-managed")
                // Limit the number of HTML5 builds on staging not to overwhelm the PDF server
                if (env == GwDeployEnvs.STAGING.envName) {
                    docBuildType.features.feature(GwBuildFeatures.GwAntennaHouseFormatterServerBuildFeature)
                }
                buildDitaProjectStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                    GwDitaOutputFormats.HTML5.formatName,
                    rootMap,
                    indexRedirect,
                    workingDir,
                    outputDir,
                    publishPath,
                    buildFilter = buildFilter,
                    docId = docId,
                    docTitle = docTitle,
                    gitUrl = gitUrl,
                    gitBranch = gitBranch,
                    buildPdfs = buildPdfs
                )
                if (buildOutputForOfflineUse) {
                    docBuildType.features.feature(GwBuildFeatures.GwOxygenWebhelpLicenseBuildFeature)
                    val localOutputDir = "${outputDir}/zip"
                    val buildDitaProjectForOfflineUseStep = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        GwDitaOutputFormats.WEBHELP.formatName,
                        rootMap,
                        indexRedirect,
                        workingDir,
                        localOutputDir,
                        publishPath,
                        buildFilter = buildFilter,
                        forOfflineUse = true
                    )
                    docBuildType.steps.step(buildDitaProjectForOfflineUseStep)
                    docBuildType.steps.stepsOrder.add(0, buildDitaProjectForOfflineUseStep.id.toString())
                    val copyPdfToOfflineOutputStep = GwBuildSteps.createCopyPdfFromOnlineToOfflineOutputStep(
                        "${workingDir}/${outputDir}", "${workingDir}/${localOutputDir}"
                    )
                    docBuildType.steps.step(copyPdfToOfflineOutputStep)
                    docBuildType.steps.stepsOrder.add(1, copyPdfToOfflineOutputStep.id.toString())
                    val zipPackageStep = GwBuildSteps.createZipPackageStep(
                        "${workingDir}/${localOutputDir}", "${workingDir}/${outputDir}"
                    )
                    docBuildType.steps.step(zipPackageStep)
                    docBuildType.steps.stepsOrder.add(2, zipPackageStep.id.toString())
                }

                docBuildType.steps.step(buildDitaProjectStep)
                docBuildType.steps.stepsOrder.add(0, buildDitaProjectStep.id.toString())
                if (!resourcesToCopy.isEmpty) {
                    val copyResourcesSteps = mutableListOf<ScriptBuildStep>()
                    for (stepId in 0 until resourcesToCopy.length()) {
                        val resourceObject = resourcesToCopy.getJSONObject(stepId)
                        val resourceSrcDir = resourceObject.getString("sourceFolder")
                        val resourceSrcId = resourceObject.getString("srcId")
                        val resourceSrcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", resourceSrcId)
                        val resourceSrcUrl = resourceSrcConfig.getString("gitUrl")
                        val resourceSrcBranch = resourceSrcConfig.getString("branch")

                        val resourceTargetDir = resourceObject.getString("targetFolder")
                        val copyResourcesStep = GwBuildSteps.createCopyResourcesStep(
                            stepId,
                            workingDir,
                            outputDir,
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

        val localOutputDir = "${outputDir}/zip"
        val downloadableOutputBuildType = BuildType {
            name = "Build downloadable output"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${docId}")

            params {
                select(
                    "OUTPUT_FORMAT",
                    "",
                    "Output format",
                    options = listOf(
                        "HTML5" to GwDitaOutputFormats.HTML5.formatName,
                        "HTML5 with PDF" to GwDitaOutputFormats.HTML5_WITH_PDF.formatName,
                        "PDF" to GwDitaOutputFormats.PDF.formatName,
                        "Webhelp (Deprecated)" to GwDitaOutputFormats.WEBHELP.formatName,
                        "Webhelp with PDF (Deprecated)" to GwDitaOutputFormats.WEBHELP_WITH_PDF.formatName,
                        "Single-page HTML" to GwDitaOutputFormats.SINGLEHTML.formatName
                    ),
                    display = ParameterDisplay.PROMPT,
                )
            }

            artifactRules = "${workingDir}/${outputDir} => /"

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }

            steps {
                for (format in arrayListOf(
                    GwDitaOutputFormats.WEBHELP.formatName,
                    GwDitaOutputFormats.PDF.formatName,
                    GwDitaOutputFormats.WEBHELP_WITH_PDF.formatName,
                    GwDitaOutputFormats.SINGLEHTML.formatName,
                    GwDitaOutputFormats.HTML5.formatName,
                    GwDitaOutputFormats.HTML5_WITH_PDF.formatName
                )) {
                    val step = GwBuildSteps.createBuildDitaProjectForBuildsStep(
                        format,
                        rootMap,
                        indexRedirect,
                        workingDir,
                        localOutputDir,
                        publishPath = "",
                        buildFilter = buildFilter,
                        gitUrl = gitUrl,
                        gitBranch = gitBranch,
                        forOfflineUse = true
                    )
                    step.conditions {
                        equals("OUTPUT_FORMAT", format)
                    }
                    step(step)
                }
                step(
                    GwBuildSteps.createZipPackageStep(
                        "${workingDir}/${localOutputDir}", "${workingDir}/${outputDir}"
                    )
                )
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
        ditaBuildTypes.add(downloadableOutputBuildType)


        if (envNames.contains(GwDeployEnvs.STAGING.envName)) {
            val stagingBuildTypeIdString =
                Helpers.resolveRelativeIdFromIdString("Publish to ${GwDeployEnvs.STAGING.envName}${docId}")
                    .toString()
            val localizationPackageBuildType = BuildType {
                name = "Build localization package"
                id = Helpers.resolveRelativeIdFromIdString("${this.name}${docId}")

                artifactRules = """
                    ${workingDir}/${outputDir} => /
                """.trimIndent()

                vcs {
                    root(teamcityGitRepoId)
                    branchFilter = GwVcsSettings.createBranchFilter(listOf(gitBranch))
                    cleanCheckout = true
                }

                steps {
                    step(
                        GwBuildSteps.createRunLionPkgBuilderStep(
                            workingDir, outputDir, stagingBuildTypeIdString
                        )
                    )
                    script {
                        name = "Add build data"
                        scriptContent = """
                            #!/bin/bash
                            set -xe

                            mkdir _builds
                            jq -n '{"root": "$rootMap", "filter": "$buildFilter"}' > _builds/$docId.json
                            zip -ur $workingDir/$outputDir/l10n_package.zip _builds 
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
        gwBuildType: String,
        deployEnv: String,
        docId: String,
        srcId: String,
        publishPath: String,
        workingDir: String,
        outputDir: String,
        indexForSearch: Boolean,
    ): BuildType {
        return BuildType {
            name = "Publish to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${docId}")
            maxRunningBuilds = 1

            if (arrayOf(GwDeployEnvs.STAGING.envName).contains(
                    deployEnv
                )
            ) {
                vcs {
                    root(Helpers.resolveRelativeIdFromIdString(srcId))
                    cleanCheckout = true
                }
                val uploadContentToS3BucketStep = GwBuildSteps.createUploadContentToS3BucketStep(
                    deployEnv, "${workingDir}/${outputDir}", publishPath
                )
                steps.step(uploadContentToS3BucketStep)
                steps.stepsOrder.add(uploadContentToS3BucketStep.id.toString())
            }

            if (indexForSearch) {
                artifactRules = """
                    %teamcity.build.workingDir%/*.log => build_logs
                """.trimIndent()
                val configFile = "%teamcity.build.workingDir%/config.json"
                val configFileStep = GwBuildSteps.createGetConfigFileStep(deployEnv, configFile)
                steps.step(configFileStep)
                steps.stepsOrder.add(configFileStep.id.toString())
                val crawlDocStep = GwBuildSteps.createRunDocCrawlerStep(deployEnv, docId, configFile)
                steps.step(crawlDocStep)
                steps.stepsOrder.add(crawlDocStep.id.toString())
            }

            // Publishing builds for STAGING are triggered automatically.
            // DITA publishing builds are triggered by build listener builds.
            // The reference to the build listener template is one of the criteria used by the build manager app
            // to identify builds that must be triggered.
            // Yarn validation builds are triggered by regular TeamCity VCS triggers.
            if (arrayOf(GwDeployEnvs.STAGING.envName).contains(deployEnv)) {
                when (gwBuildType) {
                    GwBuildTypes.DITA.buildTypeName -> {
                        templates(GwTemplates.BuildListenerTemplate)
                    }

                    else -> {
                        triggers.vcs {
                            triggerRules = Helpers.getNonDitaTriggerRules(workingDir)
                        }
                    }
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
    }

    private fun createDocProject(buildConfig: JSONObject, srcId: String): Project {
        val gwBuildType = buildConfig.getString("buildType")
        val docId = buildConfig.getString("docId")
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")
        val docEnvironments = docConfig.getJSONArray("environments")
        val docEnvironmentsList = Helpers.convertJsonArrayWithStringsToList(docEnvironments)
        val workingDir = Helpers.getWorkingDir(buildConfig)
        val outputDir = when (buildConfig.has("outputPath")) {
            true -> buildConfig.getString("outputPath")
            false -> {
                when (gwBuildType) {
                    GwBuildTypes.YARN.buildTypeName -> GwConfigParams.YARN_BUILD_OUT_DIR.paramValue
                    GwBuildTypes.STORYBOOK.buildTypeName -> GwConfigParams.STORYBOOK_BUILD_OUT_DIR.paramValue
                    GwBuildTypes.SOURCE_ZIP.buildTypeName -> GwConfigParams.SOURCE_ZIP_BUILD_OUT_DIR.paramValue
                    else -> GwConfigParams.DITA_BUILD_OUT_DIR.paramValue
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

        val srcConfig = Helpers.getObjectById(Helpers.sourceConfigs, "id", srcId)
        val gitUrl = srcConfig.getString("gitUrl")
        val gitBranch = srcConfig.getString("branch")

        val docProjectBuildTypes = mutableListOf<BuildType>()
        val customEnv = if (buildConfig.has("customEnv")) buildConfig.getJSONArray("customEnv") else null

        val buildIsDisabled = buildConfig.getBoolean("disabled")
        if (!buildIsDisabled) {
            when (gwBuildType) {
                GwBuildTypes.YARN.buildTypeName -> {
                    val nodeImageVersion =
                        if (buildConfig.has("nodeImageVersion")) buildConfig.getString("nodeImageVersion") else null
                    val buildCommand =
                        if (buildConfig.has("yarnBuildCustomCommand")) buildConfig.getString("yarnBuildCustomCommand") else null
                    docProjectBuildTypes += createYarnBuildTypes(
                        docEnvironmentsList,
                        docId,
                        srcId,
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

                GwBuildTypes.STORYBOOK.buildTypeName -> {
                    docProjectBuildTypes += createStorybookBuildTypes(
                        docEnvironmentsList,
                        docId,
                        srcId,
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

                GwBuildTypes.DITA.buildTypeName -> {
                    val rootMap = buildConfig.getString("root")
                    val indexRedirect = when (buildConfig.has("indexRedirect")) {
                        true -> {
                            buildConfig.getBoolean("indexRedirect")
                        }

                        else -> {
                            false
                        }

                    }
                    val buildFilter = when (buildConfig.has("filter")) {
                        true -> {
                            buildConfig.getString("filter")
                        }

                        else -> {
                            null
                        }
                    }
                    val resourcesToCopy =
                        if (buildConfig.has("resources")) buildConfig.getJSONArray("resources") else JSONArray()

                    docProjectBuildTypes += createDitaBuildTypes(
                        docEnvironmentsList,
                        docId,
                        srcId,
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

                GwBuildTypes.SOURCE_ZIP.buildTypeName -> {
                    val zipFilename = buildConfig.getString("zipFilename")
                    docProjectBuildTypes += createSourceZipBuildTypes(
                        docEnvironmentsList,
                        docId,
                        srcId,
                        publishPath,
                        workingDir,
                        outputDir,
                        indexForSearch,
                        zipFilename
                    )
                }

                GwBuildTypes.JUST_COPY.buildTypeName -> {
                    docProjectBuildTypes += createJustCopyBuildTypes(
                        docEnvironmentsList, docId, srcId, publishPath, workingDir, outputDir
                    )
                }
            }
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
                "env.GIT_URL", "", label = "Git repo URL", display = ParameterDisplay.PROMPT
            )
            text(
                "env.GIT_BRANCH", "", label = "Git branch name", display = ParameterDisplay.PROMPT
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
                "env.BUILDS_FILE_PARSED", "builds.txt", display = ParameterDisplay.HIDDEN
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

                    git clone --single-branch --branch %env.GIT_BRANCH% %env.GIT_URL% ${'$'}GIT_CLONE_DIR --recurse-submodules

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

                    export GIT_CLONE_DIR="git_clone_dir"
                                                                                           
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
                      dita -i "${'$'}GIT_CLONE_DIR/${'$'}input" --filter "${'$'}filter" -f html5-Guidewire --gw-offline-webhelp yes --build.pdfs yes --create-index-redirect yes --args.rellinks nofamily -o "$localOutputDir/${'$'}OUTPUT_SUBDIR"
                      n=${'$'}((n+1))
                    done < %env.BUILDS_FILE_PARSED%
                """.trimIndent()
                dockerImage = GwDockerImages.DITA_OT_LATEST.imageUrl
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
            step(
                GwBuildSteps.createZipPackageStep(
                    "%teamcity.build.workingDir%/$localOutputDir", "%teamcity.build.workingDir%"
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
            subProject(createDeployContentStorageProject())
            buildType(UploadPdfsForEscrowBuildType)
            buildType(SyncDocsFromStagingToDev)
            buildType(SyncElasticsearchIndexFromStagingToDev)
        }
    }

    private fun createGenerateSitemapProject(): Project {
        return Project {
            name = "Generate sitemap"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD
            ).forEach {
                buildType(createGenerateSitemapBuildType(it.envName))
            }
        }
    }

    private fun createGenerateSitemapBuildType(deployEnv: String): BuildType {
        val outputDir = "%teamcity.build.checkoutDir%/build"
        return BuildType {
            name = "Generate sitemap for $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                step(GwBuildSteps.createRunSitemapGeneratorStep(deployEnv, outputDir))
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deployEnv, GwStaticFilesModes.SITEMAP.modeName, outputDir
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            if (deployEnv == GwDeployEnvs.PROD.envName) {
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
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD
            ).forEach {
                buildType(createCleanUpSearchIndexBuildType(it.envName))
            }
        }
    }

    private fun createCleanUpSearchIndexBuildType(deployEnv: String): BuildType {
        return BuildType {
            name = "Clean up search index on $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            steps {
                step(GwBuildSteps.createRunIndexCleanerStep(deployEnv))
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
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD, GwDeployEnvs.PORTAL2
            ).forEach {
                buildType(createUpdateSearchIndexBuildType(it.envName))
            }
        }
    }

    private fun createUpdateSearchIndexBuildType(deployEnv: String): BuildType {
        val configFile = "%teamcity.build.workingDir%/config.json"
        return BuildType {
            name = "Update search index on $deployEnv"
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
                step(GwBuildSteps.createGetConfigFileStep(deployEnv, configFile))
                step(GwBuildSteps.createRunDocCrawlerStep(deployEnv, "%DOC_ID%", configFile))
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    private fun createDeployContentStorageProject(): Project {
        return Project {
            name = "Deploy content storage"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD, GwDeployEnvs.PORTAL2
            ).forEach {
                buildType(createDeployContentStorageBuildType(it.envName))
            }
        }
    }

    private fun createDeployContentStorageBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val contentStorageDeployEnvVars = Helpers.setContentStorageDeployEnvVars(deployEnv)
        return BuildType {
            name = "Deploy $deployEnv content storage"
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
                        $contentStorageDeployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${GwAtmosLabels.POD_NAME.labelValue})
                        
                        eval "echo \"${'$'}(cat ${GwConfigParams.S3_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                                                
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${GwConfigParams.S3_KUBE_DEPLOYMENT_FILE.paramValue}
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
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.envName)
        val awsEnvVarsInt = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)

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
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
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
                    aws s3 cp "${tmpDir}/${zipArchiveName}" s3://tenant-doctools-staging-builds/escrow/%env.RELEASE_NAME%/
            """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
            }
        }
    })

    object SyncDocsFromStagingToDev : BuildType({
        name = "Sync docs from staging to dev"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        steps {
            step(GwBuildSteps.createSyncDataFromStagingS3BucketToDevS3BucketStep())
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

    object SyncElasticsearchIndexFromStagingToDev : BuildType({
        name = "Sync the Elasticsearch index from staging to dev"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            branchFilter = "+:<default>"
            cleanCheckout = true
        }

        steps {
            nodeJS {
                name = "Reindex from staging to dev"
                id = Helpers.createIdStringFromName(this.name)
                shellScript = """
                        #!/bin/sh
                        set -e
                        
                        node ci/reindexFromStagingToDev.mjs
                        """.trimIndent()
                dockerImage = GwDockerImages.NODE_18_14_0.imageUrl
            }
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

}

object Frontend {
    private val testKubernetesConfigFilesDev =
        createTestReactLandingPagesKubernetesConfigFiles(GwDeployEnvs.DEV.envName)
    private val testKubernetesConfigFilesStaging =
        createTestReactLandingPagesKubernetesConfigFiles(GwDeployEnvs.STAGING.envName)
    private val testKubernetesConfigFilesProd =
        createTestReactLandingPagesKubernetesConfigFiles(GwDeployEnvs.PROD.envName)
    private val runCheckmarxScan = GwBuilds.createRunCheckmarxScan("landing-pages")
    private val buildAndPublishDockerImageToDevEcrBuildType =
        GwBuilds.createBuildAndPublishDockerImageToDevEcrBuildType(
            GwDockerImageTags.DOC_PORTAL_FRONTEND.tagValue,
            GwDockerImages.DOC_PORTAL_FRONTEND.imageUrl,
            "%teamcity.build.checkoutDir%",
            listOf(runCheckmarxScan, TestReactLandingPagesBuildType)
        )
    private val publishDockerImageToProdEcrBuildType = GwBuilds.createPublishDockerImageToProdEcrBuildType(
        GwDockerImageTags.DOC_PORTAL_FRONTEND.tagValue,
        GwDockerImages.DOC_PORTAL_FRONTEND.imageUrl,
        GwDockerImages.DOC_PORTAL_FRONTEND_PROD.imageUrl,
        listOf(buildAndPublishDockerImageToDevEcrBuildType)
    )
    val deployReactLandingPagesBuildTypeDev = createDeployReactLandingPagesBuildType(GwDeployEnvs.DEV.envName)
    val deployReactLandingPagesBuildTypeStaging = createDeployReactLandingPagesBuildType(GwDeployEnvs.STAGING.envName)
    val deployReactLandingPagesBuildTypeProd = createDeployReactLandingPagesBuildType(GwDeployEnvs.PROD.envName)
    val rootProject = createRootProjectForFrontend()

    private fun createRootProjectForFrontend(): Project {
        return Project {
            name = "Frontend"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            subProject(createReactLandingPagesProject())
//            subProject(createNpmPackagesProject())
//            subProject(createHtml5DependenciesProject())
        }
    }

    private fun createNpmPackagesProject(): Project {
        return Project {
            name = "NPM packages"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                Pair("theme", "docusaurus/themes/gw-theme-classic"),
                Pair("plugin", "docusaurus/plugins/gw-plugin-redoc")
            ).forEach {
                buildType(createPublishNpmPackageBuildType(it.first, it.second))
            }
        }
    }


    private fun createHtml5DependenciesProject(): Project {
        return Project {
            name = "HTML5 dependencies"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            arrayOf(
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD
            ).forEach {
                buildType(createDeployHtml5DependenciesBuildType(it.envName))
            }

            buildType(createDeployHtml5OfflineDependenciesBuildType())
        }
    }

    private fun createReactLandingPagesProject(): Project {
        return Project {
            name = "React landing pages"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            buildType(deployReactLandingPagesBuildTypeDev)
            buildType(deployReactLandingPagesBuildTypeStaging)
            buildType(deployReactLandingPagesBuildTypeProd)
            buildType(runCheckmarxScan)
            buildType(TestReactLandingPagesBuildType)
            buildType(testKubernetesConfigFilesDev)
            buildType(testKubernetesConfigFilesStaging)
            buildType(testKubernetesConfigFilesProd)
            buildType(buildAndPublishDockerImageToDevEcrBuildType)
            buildType(publishDockerImageToProdEcrBuildType)
        }
    }

    private fun createDeployReactLandingPagesBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val reactLandingPagesDeployEnvVars =
            Helpers.setReactLandingPagesDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL_FRONTEND.tagValue)
        val deployReactLandingPagesBuildType = BuildType {
            name = "Deploy React landing pages to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                nodeJS {
                    name = "Generate the root breadcrumbs file from React components"
                    id = Helpers.createIdStringFromName(this.name)
                    shellScript = """
                        yarn --cwd scripts
                        yarn --cwd scripts get-root-breadcrumbs
                    """.trimIndent()
                    dockerImage = GwDockerImages.NODE_18_14_0.imageUrl
                }
                script {
                    name = "Copy the root breadcrumbs file to landing pages"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash 
                        set -xe
                        
                        cp %teamcity.build.checkoutDir%/scripts/out/root-breadcrumbs.json %teamcity.build.checkoutDir%/landing-pages/public
                    """.trimIndent()
                }
                script {
                    name = "Deploy to Kubernetes"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        #!/bin/bash 
                        set -eux
                                
                        # Set AWS credentials
                        $awsEnvVars
                        
                        # Set environment variables needed for Kubernetes config files
                        $reactLandingPagesDeployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${GwAtmosLabels.POD_NAME.labelValue})
                        
                        eval "echo \"${'$'}(cat ${GwConfigParams.DOC_PORTAL_FRONTEND_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                                                
                        sed -ie "s/BUILD_TIME/${'$'}(date)/g" ${'$'}TMP_DEPLOYMENT_FILE
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                step(
                    GwBuildSteps.createCheckPodsStatusStep(
                        awsEnvVars,
                        atmosDeployEnv,
                        GwConfigParams.DOC_PORTAL_FRONTEND_APP_NAME.paramValue
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                deployReactLandingPagesBuildType.dependencies.snapshot(buildAndPublishDockerImageToDevEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployReactLandingPagesBuildType.dependencies.snapshot(testKubernetesConfigFilesDev) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployReactLandingPagesBuildType.triggers.vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:landing-pages/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

            GwDeployEnvs.STAGING.envName -> {
                deployReactLandingPagesBuildType.dependencies.snapshot(buildAndPublishDockerImageToDevEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployReactLandingPagesBuildType.dependencies.snapshot(testKubernetesConfigFilesStaging) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            GwDeployEnvs.PROD.envName -> {
                deployReactLandingPagesBuildType.dependencies.snapshot(publishDockerImageToProdEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployReactLandingPagesBuildType.dependencies.snapshot(testKubernetesConfigFilesProd) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
        }

        return deployReactLandingPagesBuildType
    }

    private object TestReactLandingPagesBuildType : BuildType({
        name = "Test React landing pages"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            nodeJS {
                id = "Build landing pages"
                shellScript = """
                    yarn
                    CI=true yarn test:landing-pages
                    yarn build
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_16_16_0.imageUrl
            }
        }

        features {
            feature(GwBuildFeatures.createGwPullRequestsBuildFeature(Helpers.createFullGitBranchName("feature/typeorm")))
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
        }

        triggers {
            vcs {
                triggerRules = """
                    +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:landing-pages/**
                    -:user=doctools:**
                """.trimIndent()
            }
        }
    })

    private fun createTestReactLandingPagesKubernetesConfigFiles(deployEnv: String): BuildType {
        val reactLandingPagesDeployEnvVars =
            Helpers.setReactLandingPagesDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        return BuildType {
            name = "Test Kubernetes config files for React landing pages on $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Create Kubernetes resources in dry run "
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                    #!/bin/bash 
                    set -e
                    
                    $awsEnvVars
                    $reactLandingPagesDeployEnvVars
                    export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                    
                    aws eks update-kubeconfig --name atmos-$atmosDeployEnv
                    eval "echo \"${'$'}(cat ${GwConfigParams.DOC_PORTAL_FRONTEND_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                    
                    kubectl create -f ${'$'}TMP_DEPLOYMENT_FILE --dry-run=client
                """.trimIndent()
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }

            when (deployEnv) {
                GwDeployEnvs.DEV.envName -> {
                    triggers.vcs {
                        triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:landing-pages/kube/**
                            -:user=doctools:**
                        """.trimIndent()
                    }
                }
            }
        }
    }

    private fun createPublishNpmPackageBuildType(packageHandle: String, packagePath: String): BuildType {
        return BuildType {
            name = "Publish $packageHandle to Artifactory"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.createPublishNpmPackageStep(packageHandle, packagePath))
            }

            triggers {
                vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${packagePath}/package.json
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

            features {
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
    }

    private fun createDeployHtml5DependenciesBuildType(deployEnv: String): BuildType {
        return BuildType {
            name = "Deploy HTML5 dependencies to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            // It is the output path defined in webpack.config.js
            val outputDir = "%teamcity.build.checkoutDir%/html5/static/html5"

            steps {
                step(GwBuildSteps.createBuildHtml5DependenciesStep())
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deployEnv, GwStaticFilesModes.HTML5.modeName, outputDir
                    )
                )
            }

            triggers {
                vcs {
                    triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:html5/**
                            -:user=doctools:**
                            """.trimIndent()
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
    }

    private fun createDeployHtml5OfflineDependenciesBuildType(): BuildType {
        val ditaOutPluginsCheckoutDir = "dita-ot-plugins"
        return BuildType {
            name = "Deploy HTML5 OFFLINE dependencies"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                root(GwVcsRoots.DitaOtPluginsVcsRoot, "+:.=>$ditaOutPluginsCheckoutDir")

                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.createBuildHtml5OfflineDependenciesStep())
                step(GwBuildSteps.createDeployHtml5OfflineDependenciesStep("%teamcity.build.checkoutDir%/$ditaOutPluginsCheckoutDir"))
            }

            triggers {
                vcs {
                    triggerRules = """
                            +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:html5/**
                            -:user=doctools:**
                            """.trimIndent()
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
            }
        }
    }
}

object Server {
    private val testKubernetesConfigFilesDev =
        createTestServerKubernetesConfigFiles(GwDeployEnvs.DEV.envName)
    private val testKubernetesConfigFilesStaging =
        createTestServerKubernetesConfigFiles(GwDeployEnvs.STAGING.envName)
    private val testKubernetesConfigFilesProd =
        createTestServerKubernetesConfigFiles(GwDeployEnvs.PROD.envName)
    private val runCheckmarxScan = GwBuilds.createRunCheckmarxScan("server")
    private val buildAndPublishDockerImageToDevEcrBuildType =
        GwBuilds.createBuildAndPublishDockerImageToDevEcrBuildType(
            GwDockerImageTags.DOC_PORTAL.tagValue,
            GwDockerImages.DOC_PORTAL.imageUrl,
            "%teamcity.build.checkoutDir%/server",
            listOf(runCheckmarxScan, TestDocSiteServerApp)
        )
    private val publishDockerImageToProdEcrBuildType = GwBuilds.createPublishDockerImageToProdEcrBuildType(
        GwDockerImageTags.DOC_PORTAL.tagValue,
        GwDockerImages.DOC_PORTAL.imageUrl,
        GwDockerImages.DOC_PORTAL_PROD.imageUrl,
        listOf(buildAndPublishDockerImageToDevEcrBuildType)
    )
    val deployServerBuildTypeDev = createDeployServerBuildType(GwDeployEnvs.DEV.envName)
    val deployServerBuildTypeStaging = createDeployServerBuildType(GwDeployEnvs.STAGING.envName)
    val deployServerBuildTypeProd = createDeployServerBuildType(GwDeployEnvs.PROD.envName)
    val rootProject = createRootProjectForServer()
    private fun createRootProjectForServer(): Project {
        return Project {
            name = "Server"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            buildType(deployServerBuildTypeDev)
            buildType(deployServerBuildTypeStaging)
            buildType(deployServerBuildTypeProd)
            buildType(runCheckmarxScan)
            buildType(TestDocSiteServerApp)
            buildType(TestSettingsKts)
            buildType(TestHtml5Dependencies)
            buildType(testKubernetesConfigFilesDev)
            buildType(testKubernetesConfigFilesStaging)
            buildType(testKubernetesConfigFilesProd)
            buildType(buildAndPublishDockerImageToDevEcrBuildType)
            buildType(publishDockerImageToProdEcrBuildType)
//            temporarily disabled
//            buildType(AuditNpmPackages)
        }
    }

    private object TestSettingsKts : BuildType({
        name = "Test settings.kts"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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

    private object TestHtml5Dependencies : BuildType({
        name = "Test HTML5 dependencies"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            step(GwBuildSteps.createBuildHtml5DependenciesStep())
            step(GwBuildSteps.createBuildHtml5OfflineDependenciesStep())
        }

        triggers.vcs {
            triggerRules = """
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:html5/**
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:docusaurus/themes/**
                -:user=doctools:**
            """.trimIndent()
        }

        features.feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
    })

    // Temporarily disabled
    private object AuditNpmPackages : BuildType({
        name = "Audit npm packages"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            nodeJS {
                id = "Run yarn npm audit"
                shellScript = """
                    yarn audit:server
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_16_16_0.imageUrl
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
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                name = "Test the doc site server"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/sh
                    set -e
                    export OKTA_CLIENT_ID=mock
                    export OKTA_CLIENT_SECRET=mock
                    export OKTA_IDP="${GwConfigParams.OKTA_IDP.paramValue}"
                    export GW_COMMUNITY_PARTNER_IDP="${GwConfigParams.GW_COMMUNITY_PARTNER_IDP.paramValue}"
                    export GW_COMMUNITY_CUSTOMER_IDP="${GwConfigParams.GW_COMMUNITY_CUSTOMER_IDP.paramValue}"
                    export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER.paramValue}"
                    export OKTA_ISSUER_APAC="issuerNotConfigured"
                    export OKTA_ISSUER_EMEA="issuerNotConfigured"
                    export OKTA_SCOPES=mock
                    export OKTA_AUDIENCE=mock
                    export APP_BASE_URL=http://localhost:8081
                    export SESSION_KEY=mock
                    export DOC_S3_URL="${Helpers.getS3BucketUrl(GwDeployEnvs.STAGING.envName)}"
                    export PORTAL2_S3_URL="${Helpers.getS3BucketUrl(GwDeployEnvs.PORTAL2.envName)}"
                    export ELASTIC_SEARCH_URL="${Helpers.getElasticsearchUrl(GwDeployEnvs.STAGING.envName)}"
                    export DEPLOY_ENV="${GwDeployEnvs.STAGING.envName}"
                    export LOCAL_CONFIG=yes
                    export ENABLE_AUTH=no
                    export PRETEND_TO_BE_EXTERNAL=no
                    export ALLOW_PUBLIC_DOCS=yes
                    export LOCALHOST_SESSION_SETTINGS=yes
                    export PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${Helpers.getTargetUrl(GwDeployEnvs.STAGING.envName)}/partners-login"
                    export PARTNERS_LOGIN_URL="https://guidewire--qaint.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
                    export PARTNERS_LOGIN_CERT=mock
                    export CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${Helpers.getTargetUrl(GwDeployEnvs.STAGING.envName)}/customers-login"
                    export CUSTOMERS_LOGIN_URL="https://guidewire--qaint.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
                    export CUSTOMERS_LOGIN_CERT=mock
                    
                    yarn
                    yarn test:server
                """.trimIndent()
                dockerImage = GwDockerImages.NODE_16_16_0.imageUrl
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

    private fun createTestServerKubernetesConfigFiles(deployEnv: String): BuildType {
        val serverDeployEnvVars = Helpers.setServerDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val gatewayConfigFile = Helpers.getServerGatewayConfigFile(deployEnv)
        return BuildType {
            name = "Test Kubernetes config files for server on $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Create Kubernetes resources in dry run "
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                    #!/bin/bash 
                    set -e
                    
                    $awsEnvVars
                    $serverDeployEnvVars
                    export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                    export TMP_GATEWAY_CONFIG_FILE="tmp-gateway-config.yml"
                    
                    aws eks update-kubeconfig --name atmos-$atmosDeployEnv
                    eval "echo \"${'$'}(cat ${GwConfigParams.DOC_PORTAL_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                    eval "echo \"${'$'}(cat ${gatewayConfigFile})\"" > ${'$'}TMP_GATEWAY_CONFIG_FILE
                    
                    kubectl create -f ${'$'}TMP_DEPLOYMENT_FILE --dry-run=client
                    kubectl create -f ${'$'}TMP_GATEWAY_CONFIG_FILE --dry-run=client
                """.trimIndent()
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }

            when (deployEnv) {
                GwDeployEnvs.DEV.envName -> {
                    triggers.vcs {
                        triggerRules = """
                +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/kube/**
                -:user=doctools:**
            """.trimIndent()
                    }
                }
            }
        }
    }

    private fun createDeployServerBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val gatewayConfigFile = Helpers.getServerGatewayConfigFile(deployEnv)

        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val serverDeployEnvVars = Helpers.setServerDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
        val deployServerBuildType = BuildType {
            name = "Deploy server to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
                        $serverDeployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        export TMP_GATEWAY_CONFIG_FILE="tmp-gateway-config.yml"
                        
                        aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                        
                        echo ${'$'}(kubectl get pods --namespace=${GwAtmosLabels.POD_NAME.labelValue})
                        
                        eval "echo \"${'$'}(cat ${GwConfigParams.DOC_PORTAL_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                        eval "echo \"${'$'}(cat ${gatewayConfigFile})\"" > ${'$'}TMP_GATEWAY_CONFIG_FILE
                                                
                        sed -ie "s/BUILD_TIME/${'$'}(date)/g" ${'$'}TMP_DEPLOYMENT_FILE
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}
                        kubectl apply -f ${'$'}TMP_GATEWAY_CONFIG_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}                    
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                step(
                    GwBuildSteps.createCheckPodsStatusStep(
                        awsEnvVars,
                        atmosDeployEnv,
                        GwConfigParams.DOC_PORTAL_APP_NAME.paramValue
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                deployServerBuildType.dependencies.snapshot(buildAndPublishDockerImageToDevEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployServerBuildType.dependencies.snapshot(testKubernetesConfigFilesDev) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployServerBuildType.triggers.vcs {
                    triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:server/**
                        -:user=doctools:**
                    """.trimIndent()
                }
            }

            GwDeployEnvs.STAGING.envName -> {
                deployServerBuildType.dependencies.snapshot(buildAndPublishDockerImageToDevEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployServerBuildType.dependencies.snapshot(testKubernetesConfigFilesStaging) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            GwDeployEnvs.PROD.envName -> {
                deployServerBuildType.dependencies.snapshot(publishDockerImageToProdEcrBuildType) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployServerBuildType.dependencies.snapshot(testKubernetesConfigFilesProd) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
        }

        return deployServerBuildType
    }
}

object BuildListeners {
    val rootProject = createRootProjectForBuildListeners()

    private fun getSourcesForBuildListenerBuildTypes(): List<JSONObject> {
        val sourcesRequiringListeners = mutableListOf<JSONObject>()
        for (src in Helpers.gitSources) {
            val srcId = src.getString("id")
            val ditaBuildsRelatedToSrc = Helpers.buildConfigs.filter {
                it.getString("srcId") == srcId && (it.getString("buildType") == GwBuildTypes.DITA.buildTypeName)
            }
            val uniqueEnvsFromAllDitaBuildsRelatedToSrc = ditaBuildsRelatedToSrc.map {
                val buildDocId = it.getString("docId")
                val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", buildDocId)
                Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
            }.flatten().distinct()

            if (arrayListOf(
                    GwDeployEnvs.STAGING.envName
                ).any { uniqueEnvsFromAllDitaBuildsRelatedToSrc.contains(it) }
            ) {
                sourcesRequiringListeners.add(src)
            }
        }
        return sourcesRequiringListeners
    }

    private fun createRootProjectForBuildListeners(): Project {
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
                            gitBranch = gitBranch,
                            teamcityBuildBranch = gitBranch
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
        for (src in Helpers.gitSources) {
            val srcId = src.getString("id")
            val gitUrl = src.getString("gitUrl")
            val buildsRelatedToSrc = Helpers.buildConfigs.filter { it.getString("srcId") == srcId }
            if (buildsRelatedToSrc.isNotEmpty()) {
                val gitBranch = src.getString("branch")
                val validationProject = createValidationProject(
                    srcId, gitUrl, gitBranch, buildsRelatedToSrc
                )
                validationProjects.add(validationProject)
            }
        }
        return validationProjects
    }

    private fun createValidationProject(
        srcId: String,
        gitUrl: String,
        gitBranch: String,
        buildConfigs: List<JSONObject>,
    ): Project {
        val uniqueGwBuildTypesForAllBuilds = buildConfigs.map { it.getString("buildType") }.distinct()
        return Project {
            name = srcId
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            val validationBuildsSubProject = Project {
                name = "Validation builds"
                id = Helpers.resolveRelativeIdFromIdString("${srcId}${this.name}")
            }

            buildType(createCleanValidationResultsBuildType(srcId, gitUrl))

            if (uniqueGwBuildTypesForAllBuilds.contains(GwBuildTypes.DITA.buildTypeName)) {
                validationBuildsSubProject.buildType(
                    createValidationListenerBuildType(
                        srcId, gitUrl, gitBranch, this.id.toString()
                    )
                )
            }
            buildConfigs.forEach {
                validationBuildsSubProject.buildType(
                    createValidationBuildType(
                        srcId, gitBranch, it, it.getString("buildType"), gitUrl
                    )
                )
            }
            subProject(validationBuildsSubProject)


        }
    }


    private fun createValidationListenerBuildType(
        srcId: String,
        gitUrl: String,
        gitBranch: String,
        teamcityAffectedProjectId: String,
    ): BuildType {
        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(srcId)
        return BuildType {
            name = "$srcId validation listener"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }
            steps.step(
                GwBuildSteps.createRunBuildManagerStep(
                    teamcityAffectedProjectId,
                    GwTemplates.ValidationListenerTemplate.id.toString(),
                    gitUrl,
                    Helpers.createFullGitBranchName(gitBranch),
                    "%teamcity.build.branch%"
                )
            )

            triggers.vcs {}

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(Helpers.createFullGitBranchName(gitBranch)))
                feature(GwBuildFeatures.GwBuildListenerLimitBuildFeature)
            }
        }
    }

    private fun createValidationBuildType(
        srcId: String,
        gitBranch: String,
        buildConfig: JSONObject,
        gwBuildType: String,
        gitUrl: String,
    ): BuildType {
        val docId = buildConfig.getString("docId")
        val docConfig = Helpers.getObjectById(Helpers.docConfigs, "id", docId)
        val docTitle = docConfig.getString("title")

        val workingDir = Helpers.getWorkingDir(buildConfig)
        val outputDir = when (buildConfig.has("outputPath")) {
            true -> buildConfig.getString("outputPath")
            false -> {
                when (gwBuildType) {
                    GwBuildTypes.YARN.buildTypeName -> GwConfigParams.YARN_BUILD_OUT_DIR.paramValue
                    GwBuildTypes.STORYBOOK.buildTypeName -> GwConfigParams.STORYBOOK_BUILD_OUT_DIR.paramValue
                    GwBuildTypes.SOURCE_ZIP.buildTypeName -> GwConfigParams.SOURCE_ZIP_BUILD_OUT_DIR.paramValue
                    else -> GwConfigParams.DITA_BUILD_OUT_DIR.paramValue
                }
            }
        }

        val teamcityGitRepoId = Helpers.resolveRelativeIdFromIdString(srcId)
        // For the preview URL and doc validator data uploaded to Elasticsearch, we cannot use the teamcity.build.branch
        // variable because for the default branch it resolves to "<default>". We need the full branch name so we use
        // the teamcity.build.vcs.branch.<VCS_root_ID> variable. For validation listeners and builds, we use
        // the teamcity.build.branch variable because it's more flexible (we don't need to provide the VCS Root ID).
        val teamcityBuildBranch = "%teamcity.build.vcs.branch.${teamcityGitRepoId}%"
        val publishPath = "preview/${srcId}/${teamcityBuildBranch}/${docId}"
        val previewUrl = "${Helpers.getTargetUrl(GwDeployEnvs.STAGING.envName)}/$publishPath"
        val previewUrlFile = "preview_url.txt"

        val validationBuildType = BuildType {
            name = "Validate $docTitle ($docId)"
            id = Helpers.resolveRelativeIdFromIdString("${this.name}${srcId}")

            artifactRules = "$previewUrlFile\n"

            vcs {
                root(teamcityGitRepoId)
                cleanCheckout = true
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            features.feature(
                GwBuildFeatures.createGwPullRequestsBuildFeature(
                    Helpers.createFullGitBranchName(
                        gitBranch
                    )
                )
            )
        }

        val regex = "ssh://git@stash.guidewire.com/(.+)/(.+).git".toRegex()
        val matchList = regex.find(gitUrl)?.groupValues
        val projectKey = matchList!![1]
        val repoKey = matchList!![2]
        val pullRequestId = "%teamcity.pullRequest.branch.pullrequests%"

        val uploadStepOuputPath = when (gwBuildType) {
            GwBuildTypes.DITA.buildTypeName -> "${workingDir}/${outputDir}/${GwDitaOutputFormats.HTML5.formatName}"
            else -> "${workingDir}/${outputDir}"
        }

        val uploadStep = GwBuildSteps.createUploadContentToS3BucketStep(
            GwDeployEnvs.STAGING.envName,
            uploadStepOuputPath,
            publishPath,
        )
        uploadStep.conditions { equals("teamcity.build.branch.is_default", "false") }

        val previewFileStep = GwBuildSteps.createPreviewUrlFile(
            previewUrl, previewUrlFile
        )
        previewFileStep.conditions { equals("teamcity.build.branch.is_default", "false") }

        val pullRequestCommentStep = GwBuildSteps.createAddPullRequestCommentStep(
            "preview link",
            "Hi, I created a preview for validation build %build.number%: $previewUrl",
            projectKey,
            repoKey,
            pullRequestId
        )
        pullRequestCommentStep.conditions { equals("teamcity.build.branch.is_default", "false") }

        val buildLogsDir = "build_logs"
        val adminLogsDir = "admin_logs"

        when (gwBuildType) {
            GwBuildTypes.DITA.buildTypeName -> {
                val ditaOtLogsDir = "dita_ot_logs"
                val docValidatorLogs = "doc_validator_logs"
                val normalizedDitaDir = "normalized_dita_dir"
                val schematronReportsDir = "schematron_reports_dir"
                val docInfoFile = "doc-info.json"
                val rootMap = buildConfig.getString("root")
                val indexRedirect = when (buildConfig.has("indexRedirect")) {
                    true -> {
                        buildConfig.getBoolean("indexRedirect")
                    }

                    else -> {
                        false
                    }

                }
                val buildFilter = when (buildConfig.has("filter")) {
                    true -> {
                        buildConfig.getString("filter")
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
                    ${workingDir}/${docValidatorLogs} => $buildLogsDir
                    ${workingDir}/${ditaOtLogsDir} => $adminLogsDir
                    ${workingDir}/${outputDir}/${GwDitaOutputFormats.HTML5.formatName}/${GwConfigParams.BUILD_DATA_FILE.paramValue} => ${GwConfigParams.BUILD_DATA_DIR.paramValue}
                """.trimIndent()

                validationBuildType.steps {
                    step(
                        GwBuildSteps.createBuildDitaProjectForValidationsStep(
                            GwDitaOutputFormats.HTML5.formatName,
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
                    step(uploadStep)
                    step(previewFileStep)
                    step(pullRequestCommentStep)
                    step(
                        GwBuildSteps.createBuildDitaProjectForValidationsStep(
                            GwDitaOutputFormats.DITA.formatName,
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
                            workingDir, teamcityBuildBranch, srcId, docInfoFile, docConfig
                        )
                    )
                    // For now, image validations are disabled.
                    // These validations need improvements.

                    arrayOf(
                        GwValidationModules.VALIDATORS_DITA.validationName,
                        GwValidationModules.VALIDATORS_FILES.validationName,
                        GwValidationModules.EXTRACTORS_DITA_OT_LOGS.validationName,
                        GwValidationModules.EXTRACTORS_SCHEMATRON_REPORTS.validationName,
                    ).forEach {
                        val exitCodeEnvVarName = "env.${it.uppercase()}_EXIT_CODE"
                        this.step(
                            GwBuildSteps.createRunDocValidatorStep(
                                it,
                                workingDir,
                                ditaOtLogsDir,
                                normalizedDitaDir,
                                schematronReportsDir,
                                docInfoFile,
                                exitCodeEnvVarName
                            )
                        )
                        val pullRequestCommentForLogFileLinkStep = GwBuildSteps.createAddPullRequestCommentStep(
                            "${it}.log link",
                            "\u26D4 \uD83E\uDD16 Hi, $it here. I found some issues in validation build %build.number%: https://gwre-devexp-ci-production-devci.gwre-devops.net/repository/download/%system.teamcity.buildType.id%/%teamcity.build.id%:id/${buildLogsDir}/${it}.log",
                            projectKey,
                            repoKey,
                            pullRequestId
                        )
                        pullRequestCommentForLogFileLinkStep.executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
                        pullRequestCommentForLogFileLinkStep.conditions {
                            equals("teamcity.build.branch.is_default", "false")
                            equals(exitCodeEnvVarName, "1")
                        }
                        this.step(
                            pullRequestCommentForLogFileLinkStep
                        )
                    }
                }
            }

            GwBuildTypes.YARN.buildTypeName -> {
                val metadata = docConfig.getJSONObject("metadata")
                val gwPlatforms = metadata.getJSONArray("platform")
                val gwProducts = metadata.getJSONArray("product")
                val gwVersions = metadata.getJSONArray("version")
                val gwPlatformsString = gwPlatforms.joinToString(",")
                val gwProductsString = gwProducts.joinToString(",")
                val gwVersionsString = gwVersions.joinToString(",")
                val nodeImageVersion =
                    if (buildConfig.has("nodeImageVersion")) buildConfig.getString("nodeImageVersion") else null
                val buildCommand =
                    if (buildConfig.has("yarnBuildCustomCommand")) buildConfig.getString("yarnBuildCustomCommand") else null
                val customEnv = if (buildConfig.has("customEnv")) buildConfig.getJSONArray("customEnv") else null

                validationBuildType.artifactRules += """
                    ${workingDir}/*.log => $buildLogsDir
                """.trimIndent()


                validationBuildType.steps {
                    val exitCodeEnvVarName = "env.YARN_BUILD_EXIT_CODE"
                    step(
                        GwBuildSteps.createBuildYarnProjectStep(
                            GwDeployEnvs.STAGING.envName,
                            publishPath,
                            buildCommand,
                            nodeImageVersion,
                            docId,
                            gwProductsString,
                            gwPlatformsString,
                            gwVersionsString,
                            workingDir,
                            customEnv,
                            validationMode = true,
                            exitCodeEnvVarName = exitCodeEnvVarName
                        )
                    )
                    step(uploadStep)
                    step(previewFileStep)
                    step(pullRequestCommentStep)
                    val buildLogFileName = "yarn_build.log"
                    val pullRequestCommentForLogFileLinkStep = GwBuildSteps.createAddPullRequestCommentStep(
                        "$buildLogFileName link",
                        "\u26D4 \uD83E\uDD16 Hi, I found some issues in validation build %build.number%: https://gwre-devexp-ci-production-devci.gwre-devops.net/repository/download/%system.teamcity.buildType.id%/%teamcity.build.id%:id/${buildLogsDir}/${buildLogFileName}",
                        projectKey,
                        repoKey,
                        pullRequestId
                    )
                    pullRequestCommentForLogFileLinkStep.executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
                    pullRequestCommentForLogFileLinkStep.conditions {
                        equals("teamcity.build.branch.is_default", "false")
                        equals(exitCodeEnvVarName, "1")
                    }
                    this.step(
                        pullRequestCommentForLogFileLinkStep
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
        when (gwBuildType) {
            GwBuildTypes.DITA.buildTypeName -> {
                validationBuildType.templates(GwTemplates.ValidationListenerTemplate)
            }

            GwBuildTypes.YARN.buildTypeName -> {
                validationBuildType.triggers.vcs {
                    triggerRules = Helpers.getNonDitaTriggerRules(workingDir)
                }
            }
        }

        return validationBuildType
    }

    private fun createCleanValidationResultsBuildType(
        srcId: String,
        gitUrl: String,
    ): BuildType {
        val elasticsearchUrl = Helpers.getElasticsearchUrl(GwDeployEnvs.STAGING.envName)
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)
        return BuildType {
            name = "Clean validation results for $srcId"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            vcs {
                root(Helpers.resolveRelativeIdFromIdString(srcId))
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
                        
                        results_cleaner --elasticsearch-urls "$elasticsearchUrl"  --git-source-id "$srcId" --git-source-url "$gitUrl" --s3-bucket-name "tenant-doctools-staging-builds"
                    """.trimIndent()
                    dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.imageUrl
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

            for (env in arrayOf(GwDeployEnvs.STAGING)) {
                val recommendationProject = createRecommendationProject(env.envName)
                subProject(recommendationProject)
            }
        }
    }

    private fun createRecommendationProject(deployEnv: String): Project {
        val recommendationProjectBuildTypes = mutableListOf<BuildType>()
        val allPlatformProductVersionCombinations = generatePlatformProductVersionCombinationsForAllDocs(deployEnv)
        for (combination in allPlatformProductVersionCombinations) {
            val (platform, product, version) = combination
            val recommendationsForTopicsBuildTypeInt = createRecommendationsForTopicsBuildType(
                GwDeployEnvs.STAGING.envName, platform, product, version

            )
            recommendationProjectBuildTypes.add(recommendationsForTopicsBuildTypeInt)
        }
        return Project {
            name = "Recommendations for $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(this.name)

            recommendationProjectBuildTypes.forEach {
                buildType(it)
            }
        }
    }

    private fun generatePlatformProductVersionCombinationsForAllDocs(deployEnv: String): List<Triple<String, String, String>> {
        val result = mutableListOf<Triple<String, String, String>>()
        for (docConfig in Helpers.docConfigs) {
            val docEnvironmentsLowercaseList =
                Helpers.convertJsonArrayWithStringsToLowercaseList(docConfig.getJSONArray("environments"))
            if (docEnvironmentsLowercaseList.contains(deployEnv)) {
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
        deployEnv: String,
        gwPlatform: String,
        gwProduct: String,
        gwVersion: String,
    ): BuildType {
        val pretrainedModelFile = "GoogleNews-vectors-negative300.bin"
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val elasticsearchUrl = Helpers.getElasticsearchUrl(deployEnv)

        return BuildType {
            name = "Generate recommendations for $gwProduct, $gwPlatform, $gwVersion"
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
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
                }
                script {
                    name = "Run the recommendation engine"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                            #!/bin/bash
                            set -xe
                            
                            export PLATFORM="$gwPlatform"
                            export PRODUCT="$gwProduct"
                            export VERSION="$gwVersion"
                            export ELASTICSEARCH_URL="$elasticsearchUrl"
                            export DOCS_INDEX_NAME="gw-docs"
                            export RECOMMENDATIONS_INDEX_NAME="gw-recommendations"
                            export PRETRAINED_MODEL_FILE="$pretrainedModelFile"
                                                                    
                            recommendation_engine
                        """.trimIndent()
                    dockerImage = GwDockerImages.RECOMMENDATION_ENGINE_LATEST.imageUrl
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

            subProject(FlailSSGProject)
        }
    }

    object FlailSSGProject : Project({
        name = "Flail SSG"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        buildType(PublishFlailSSGDockerImageBuildType)
        buildType(TestFlailSSGBuildType)

    })

    object PublishFlailSSGDockerImageBuildType : BuildType({
        val appDir = "frontend/flail_ssg"
        name = "Publish Docker image for Flail SSG"
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
                        
                        cd $appDir
                        ./publish_docker.sh latest       
                    """.trimIndent()
            }
        }

        triggers {
            vcs {
                triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:${appDir}/**
                        -:user=doctools:**
                    """.trimIndent()
            }
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

        dependencies {
            snapshot(TestFlailSSGBuildType) {
                reuseBuilds = ReuseBuilds.SUCCESSFUL
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    })

    object TestFlailSSGBuildType : BuildType({
        name = "Test Flail SSG"
        id = Helpers.resolveRelativeIdFromIdString(this.name)

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        params {
            text(
                "env.DOCS_CONFIG_FILE",
                "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}",
                display = ParameterDisplay.HIDDEN
            )
        }

        steps {
            step(GwBuildSteps.MergeDocsConfigFilesStep)
            script {
                name = "Run tests"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                        #!/bin/bash
                        set -xe

                        cd frontend/flail_ssg
                        ./run_tests.sh
                    """.trimIndent()
                dockerImage = GwDockerImages.PYTHON_3_9_SLIM_BUSTER.imageUrl
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            }
        }

        triggers {
            vcs {
                triggerRules = """
                        +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:frontend/**
                        -:user=doctools:**
                    """.trimIndent()
            }
        }

        features {
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    })
}

object Helpers {
    fun getWorkingDir(buildConfig: JSONObject): String {
        return when (buildConfig.has("workingDir")) {
            false -> {
                "%teamcity.build.checkoutDir%"
            }

            true -> {
                "%teamcity.build.checkoutDir%/${buildConfig.getString("workingDir")}"
            }
        }
    }

    fun convertJsonArrayWithStringsToList(jsonArray: JSONArray): List<String> {
        if (jsonArray.all { it is String }) {
            return jsonArray.joinToString(",").split(",")
        }
        throw Error("Cannot convert JSON Array to list. Not all array elements are of the String type.")
    }

    private fun convertListToLowercase(listToConvert: List<String>): List<String> {
        return listToConvert.map { it.lowercase(Locale.getDefault()) }
    }

    fun convertJsonArrayWithStringsToLowercaseList(jsonArray: JSONArray): List<String> {
        return convertListToLowercase(convertJsonArrayWithStringsToList(jsonArray))
    }

    fun generatePlatformProductVersionCombinations(
        gwPlatforms: List<String>, gwProducts: List<String>, gwVersions: List<String>,
    ): List<Triple<String, String, String>> {
        val result = mutableListOf<Triple<String, String, String>>()
        gwPlatforms.forEach { a ->
            gwProducts.forEach { b ->
                gwVersions.forEach { c ->
                    result.add(Triple(a, b, c))
                }
            }
        }
        return result
    }

    private fun getObjectsFromAllConfigFiles(srcDir: String, objectName: String): List<JSONObject> {
        val allConfigObjects = mutableListOf<JSONObject>()
        val jsonFiles = File(srcDir).walk().filter { File(it.toString()).extension == "json" }
        for (file in jsonFiles) {
            val configFileData = JSONObject(File(file.toString()).readText(Charsets.UTF_8))
            val configObjects = configFileData.getJSONArray(objectName)
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
    val gitSources = getBuildSourceConfigs()

    fun getObjectById(objectList: List<JSONObject>, idName: String, idValue: String): JSONObject {
        return objectList.find { it.getString(idName) == idValue } ?: JSONObject()
    }

    private fun removeSpecialCharacters(stringToClean: String): String {
        val re = Regex("[^A-Za-z0-9]")
        return re.replace(stringToClean, "")
    }

    fun resolveRelativeIdFromIdString(id: String): RelativeId {
        return RelativeId(removeSpecialCharacters(id))
    }

    fun createIdStringFromName(name: String): String {
        return name.uppercase(Locale.getDefault()).replace(" ", "_")
    }

    fun createFullGitBranchName(branchName: String): String {
        return if (branchName.contains("refs/")) {
            branchName
        } else {
            "refs/heads/${branchName}"
        }
    }

    fun getConfigFileUrl(deployEnv: String): String {
        return if (arrayListOf(GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName).contains(deployEnv)) {
            "https://docportal-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.guidewire.net/portal-config/config.json"
        } else {
            "https://docportal-content.${deployEnv}.ccs.guidewire.net/portal-config/config.json"
        }
    }

    fun setAwsEnvVars(deployEnv: String): String {
        val (awsAccessKeyId, awsSecretAccessKey, awsDefaultRegion) = when (deployEnv) {
            GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName -> Triple(
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
            export AWS_REGION="$awsDefaultRegion"
        """.trimIndent()
    }

    // TODO: Change URLs to doc site URLs before merge to master
    fun getTargetUrl(deployEnv: String): String {
        return if (arrayOf(
                GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName
            ).contains(deployEnv)
        ) {
            "https://croissant.${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.guidewire.net"
        } else {
            "https://croissant.${deployEnv}.ccs.guidewire.net"
        }
    }

    fun getElasticsearchUrl(deployEnv: String): String {
        return if (arrayOf(GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName).contains(deployEnv)) {
            "https://docsearch-doctools.${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.guidewire.net"
        } else {
            "https://docsearch-doctools.${deployEnv}.ccs.guidewire.net"
        }
    }

    fun getS3BucketUrl(deployEnv: String): String {
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName -> "https://docportal-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.guidewire.net"
            GwDeployEnvs.PORTAL2.envName -> "https://portal2-content.${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.guidewire.net"
            else -> "https://docportal-content.${deployEnv}.ccs.guidewire.net"
        }
    }

    fun getServerGatewayConfigFile(deployEnv: String): String {
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName -> GwConfigParams.DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE_PROD.paramValue
            else -> GwConfigParams.DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE.paramValue
        }
    }

    fun getAtmosDeployEnv(deployEnv: String): String {
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName -> GwDeployEnvs.OMEGA2_ANDROMEDA.envName
            else -> deployEnv
        }
    }

    private fun getGwCommunityUrls(deployEnv: String): Pair<String, String> {
        val partnersLoginUrl: String
        val customersLoginUrl: String
        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                partnersLoginUrl = "https://guidewire--qaint.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
                customersLoginUrl =
                    "https://guidewire--qaint.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
            }

            GwDeployEnvs.STAGING.envName -> {
                partnersLoginUrl = "https://guidewire--uat.sandbox.my.site.com/partners/idp/endpoint/HttpRedirect"
                customersLoginUrl = "https://guidewire--uat.sandbox.my.site.com/customers/idp/endpoint/HttpRedirect"
            }

            GwDeployEnvs.PROD.envName -> {
                partnersLoginUrl = "https://partner.guidewire.com/idp/endpoint/HttpRedirect"
                customersLoginUrl = "https://community.guidewire.com/idp/endpoint/HttpRedirect"
            }

            else -> {
                partnersLoginUrl = ""
                customersLoginUrl = ""
            }
        }
        return Pair(partnersLoginUrl, customersLoginUrl)
    }

    // TODO: Adjust requested values for CPU and memory when Kubecost starts being useful again
    fun setReactLandingPagesDeployEnvVars(deployEnv: String, tagVersion: String): String {
        val commonEnvVars = """
            export APP_NAME="${GwConfigParams.DOC_PORTAL_FRONTEND_APP_NAME.paramValue}"
            export POD_NAME="${GwAtmosLabels.POD_NAME.labelValue}"
            export DEPT_CODE="${GwAtmosLabels.DEPT_CODE.labelValue}"
            export TAG_VERSION=$tagVersion
        """.trimIndent()
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName -> """
                $commonEnvVars
                export AWS_ROLE="${GwConfigParams.AWS_ROLE_PROD.paramValue}"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL_FRONTEND_PROD.imageUrl}"
                export REQUESTS_MEMORY="1G"
                export REQUESTS_CPU="200m"
                export LIMITS_MEMORY="4G"
                export LIMITS_CPU="2"
            """.trimIndent()

            else -> """
                $commonEnvVars
                export AWS_ROLE="${GwConfigParams.AWS_ROLE.paramValue}"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL_FRONTEND.imageUrl}"
                export REQUESTS_MEMORY="500M"
                export REQUESTS_CPU="100m"
                export LIMITS_MEMORY="2G"
                export LIMITS_CPU="1"
            """.trimIndent()
        }
    }

    fun setServerDeployEnvVars(deployEnv: String, tagVersion: String): String {
        val (partnersLoginUrl, customersLoginUrl) = getGwCommunityUrls(deployEnv)
        val appBaseUrl = getTargetUrl(deployEnv)
        val docS3Url = getS3BucketUrl(deployEnv)
        val portal2S3Url = getS3BucketUrl(GwDeployEnvs.PORTAL2.envName)
        val commonEnvVars = """
            export APP_NAME="${GwConfigParams.DOC_PORTAL_APP_NAME.paramValue}"
            export POD_NAME="${GwAtmosLabels.POD_NAME.labelValue}"
            export DEPT_CODE="${GwAtmosLabels.DEPT_CODE.labelValue}"
            export TAG_VERSION="$tagVersion"
            export APP_BASE_URL="$appBaseUrl"
            export FRONTEND_URL="http://docportal-frontend.doctools:6006"
            export DOC_S3_URL="$docS3Url"
            export PORTAL2_S3_URL="$portal2S3Url"
            export ENABLE_AUTH="yes"
            export DD_SERVICE_NAME="${GwConfigParams.DOC_PORTAL_APP_NAME.paramValue}"
            export OKTA_AUDIENCE="${GwConfigParams.OKTA_AUDIENCE.paramValue}"
            export OKTA_ADMIN_GROUPS="${GwConfigParams.OKTA_ADMIN_GROUPS.paramValue}"
            export CUSTOMERS_LOGIN_URL="$customersLoginUrl"
            export CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/customers-login"
            export PARTNERS_LOGIN_URL="$partnersLoginUrl"
            export PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID="${appBaseUrl}/partners-login"
        """.trimIndent()
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName -> """
                $commonEnvVars
                export AWS_ROLE="${GwConfigParams.AWS_ROLE_PROD.paramValue}"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL_PROD.imageUrl}"
                export GW_COMMUNITY_PARTNER_IDP="${GwConfigParams.GW_COMMUNITY_PARTNER_IDP_PROD.paramValue}"
                export GW_COMMUNITY_CUSTOMER_IDP="${GwConfigParams.GW_COMMUNITY_CUSTOMER_IDP_PROD.paramValue}"
                export DEPLOY_ENV="${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}"
                export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER_PROD.paramValue}"
                export OKTA_ISSUER_APAC="${GwConfigParams.OKTA_ISSUER_APAC.paramValue}"
                export OKTA_ISSUER_EMEA="${GwConfigParams.OKTA_ISSUER_EMEA.paramValue}"
                export OKTA_IDP="${GwConfigParams.OKTA_IDP_PROD.paramValue}"
                export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES_PROD.paramValue}"
                export ELASTIC_SEARCH_URL="http://docsearch-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.doctools:9200"
                export CONFIG_DB_HOST="${GwConfigParams.CONFIG_DB_HOST_PROD.paramValue}" 
                export REQUESTS_MEMORY="1G"
                export REQUESTS_CPU="200m"
                export LIMITS_MEMORY="4G"
                export LIMITS_CPU="2"
            """.trimIndent()

            else -> """
                $commonEnvVars
                export AWS_ROLE="${GwConfigParams.AWS_ROLE.paramValue}"
                export AWS_ECR_REPO="${GwDockerImages.DOC_PORTAL.imageUrl}"
                export GW_COMMUNITY_PARTNER_IDP="${GwConfigParams.GW_COMMUNITY_PARTNER_IDP.paramValue}"
                export GW_COMMUNITY_CUSTOMER_IDP="${GwConfigParams.GW_COMMUNITY_CUSTOMER_IDP.paramValue}"
                export DEPLOY_ENV="$deployEnv"
                export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER.paramValue}"
                export OKTA_ISSUER_APAC="issuerNotConfigured"
                export OKTA_ISSUER_EMEA="issuerNotConfigured"
                export OKTA_IDP="${GwConfigParams.OKTA_IDP.paramValue}"
                export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES.paramValue}"
                export ELASTIC_SEARCH_URL="http://docsearch-${deployEnv}.doctools:9200"
                export CONFIG_DB_HOST="${
                when (deployEnv) {
                    GwDeployEnvs.STAGING.envName -> GwConfigParams.CONFIG_DB_HOST_STAGING.paramValue
                    GwDeployEnvs.DEV.envName -> GwConfigParams.CONFIG_DB_HOST_DEV.paramValue
                    else -> ""
                }
            }"
                export REQUESTS_MEMORY="500M"
                export REQUESTS_CPU="100m"
                export LIMITS_MEMORY="2G"
                export LIMITS_CPU="1"
            """.trimIndent()
        }
    }

    fun setContentStorageDeployEnvVars(deployEnv: String): String {
        val commonEnvVars = """
            export POD_NAME="${GwAtmosLabels.POD_NAME.labelValue}"
            export DEPT_CODE="${GwAtmosLabels.DEPT_CODE.labelValue}"
            export TAG_VERSION="0.0.0"
        """.trimIndent()
        return when (deployEnv) {
            GwDeployEnvs.PROD.envName -> """
                $commonEnvVars
                export APP_NAME="docportal-content"
                export SERVICE_EXTERNAL_NAME="tenant-${GwAtmosLabels.POD_NAME.labelValue}-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-builds.s3-website-us-east-1.amazonaws.com"
            """.trimIndent()

            GwDeployEnvs.PORTAL2.envName -> """
                $commonEnvVars
                export APP_NAME="portal2-content"
                export SERVICE_EXTERNAL_NAME="tenant-${GwAtmosLabels.POD_NAME.labelValue}-portal2-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-builds.s3-website-us-east-1.amazonaws.com"
            """.trimIndent()

            else -> """
                $commonEnvVars
                export APP_NAME="docportal-content"
                export SERVICE_EXTERNAL_NAME="tenant-${GwAtmosLabels.POD_NAME.labelValue}-${deployEnv}-builds.s3-website.us-west-2.amazonaws.com"
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
        workingDir: String,
        buildFilter: String?,
    ): String {
        return if (buildFilter != null) {
            """
                echo "Downloading the ditaval file from common-gw submodule"
                                    
                export COMMON_GW_DITAVALS_DIR="${workingDir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.paramValue}"
                mkdir -p ${'$'}COMMON_GW_DITAVALS_DIR && cd ${'$'}COMMON_GW_DITAVALS_DIR 
                curl -O https://stash.guidewire.com/rest/api/1.0/projects/DOCSOURCES/repos/common-gw/raw/ditavals/${buildFilter} \
                    -H "Accept: application/json" \
                    -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%"
            """.trimIndent()
        } else {
            "echo \"This build does not use a ditaval file. Skipping download from the common-gw submodule...\""
        }
    }

    fun md5(input: String): String {
        val md = MessageDigest.getInstance("MD5")
        return BigInteger(1, md.digest(input.toByteArray())).toString(16).padStart(32, '0')
    }

}

object GwBuilds {
    fun createDeployDocPortalBuildType(deployEnv: String): BuildType {
        val snapshotDependencies = when (deployEnv) {
            GwDeployEnvs.DEV.envName -> listOf(
                Database.deployDbBuildTypeDev,
                Server.deployServerBuildTypeDev,
                Frontend.deployReactLandingPagesBuildTypeDev
            )

            GwDeployEnvs.STAGING.envName -> listOf(
                Database.deployDbBuildTypeStaging,
                Server.deployServerBuildTypeStaging,
                Frontend.deployReactLandingPagesBuildTypeStaging
            )

            GwDeployEnvs.PROD.envName -> listOf(
                Database.deployDbBuildTypeProd,
                Server.deployServerBuildTypeProd,
                Frontend.deployReactLandingPagesBuildTypeProd
            )

            else -> listOf()
        }
        return BuildType {
            name = "Deploy doc portal to $deployEnv"
            description = "Deploys db, server and React landing pages to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
            type = BuildTypeSettings.Type.COMPOSITE

            dependencies {
                snapshotDependencies.forEach {
                    snapshot(it) {
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }

    fun createBuildAndPublishDockerImageToDevEcrBuildType(
        tagVersion: String,
        devDockerImageUrl: String,
        dockerfilePath: String,
        snapshotDependencies: List<BuildType>,
    ): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.envName)
        return BuildType {
            name = "Build and publish Docker Image to DEV ECR"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5("${this.name}${devDockerImageUrl}"))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                branchFilter = "+:<default>"
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Build and publish Docker Image to DEV ECR"
                    id = Helpers.createIdStringFromName(this.name)

                    scriptContent = """
                        #!/bin/bash 
                        set -xe
                        
                        # Log into the dev ECR, build and push the image
                        $awsEnvVars
                        
                        export TAG_VERSION=$tagVersion
                        export DEPT_CODE=${GwAtmosLabels.DEPT_CODE.labelValue}
                        export POD_NAME=${GwAtmosLabels.POD_NAME.labelValue}
        
                        set +x
                        docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST.paramValue}
                        set -x
                        docker build -t ${devDockerImageUrl}:${tagVersion} $dockerfilePath \
                        --build-arg NPM_AUTH_TOKEN \
                        --build-arg TAG_VERSION \
                        --build-arg DEPT_CODE \
                        --build-arg POD_NAME
                        docker push ${devDockerImageUrl}:${tagVersion}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters =
                        "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            dependencies {
                snapshotDependencies.forEach {
                    snapshot(it) {
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }

    fun createPublishDockerImageToProdEcrBuildType(
        tagVersion: String,
        devDockerImageUrl: String,
        prodDockerImageUrl: String,
        snapshotDependencies: List<BuildType>,
    ): BuildType {
        val awsEnvVarsDev = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.envName)
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.envName)
        return BuildType {
            name = "Publish Docker Image to PROD ECR"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5("${this.name}${devDockerImageUrl}"))

            steps {
                script {
                    name = "Download Docker Image from DEV ECR and push it to PROD ECR"
                    id = Helpers.createIdStringFromName(this.name)
                    scriptContent = """
                        set -xe
                        
                        # Log into the dev ECR, download the image and tag it
                        $awsEnvVarsDev
        
                        set +x
                        docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST.paramValue}
                        set -x
                        docker pull ${devDockerImageUrl}:${tagVersion}
                        docker tag ${devDockerImageUrl}:${tagVersion} ${prodDockerImageUrl}:${tagVersion}
                        
                        # Log into the prod ECR and push the image
                        $awsEnvVarsProd
                        
                        set +x
                        docker login -u AWS -p ${'$'}(aws ecr get-login-password) ${GwConfigParams.ECR_HOST_PROD.paramValue}
                        set -x
                        docker push ${prodDockerImageUrl}:${tagVersion}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters =
                        "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro -v ${'$'}HOME/.docker:/root/.docker"
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            dependencies {
                snapshotDependencies.forEach {
                    snapshot(it) {
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }

    fun createRunCheckmarxScan(sourceDir: String): BuildType {
        return BuildType {
            templates(AbsoluteId("CheckmarxSastScan"))
            name = "Run Checkmarx scan"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5("${this.name}${sourceDir}"))

            params {
                text("checkmarx.project.name", "doctools")
                text("checkmarx.source.directory", sourceDir)
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
                    +:root=${GwVcsRoots.DocumentationPortalGitVcsRoot.id}:$sourceDir/**
                    -:user=doctools:**
                    """.trimIndent()
                }
            }
        }
    }
}

object GwBuildSteps {
    object MergeAllLegacyConfigsStep : ScriptBuildStep({
        name = "Merge all config files"
        id = Helpers.createIdStringFromName(this.name)
        scriptContent = """
                #!/bin/bash
                set -xe

                config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}"
                config_deployer merge "${GwConfigParams.SOURCES_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}"
                config_deployer merge "${GwConfigParams.BUILDS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.paramValue}"
            """.trimIndent()
        dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.imageUrl
        dockerImagePlatform = ImagePlatform.Linux
    })

    fun createCheckPodsStatusStep(envVars: String, deployEnv: String, appName: String): ScriptBuildStep {
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        return ScriptBuildStep {
            name = "Check pods status"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -e
                
                # Set AWS credentials
                $envVars
                
                aws eks update-kubeconfig --name atmos-${atmosDeployEnv}
                sleep 10
                TIME="0"
                while true; do
                    if [[ "${'$'}TIME" == "10" ]]; then
                        break
                    fi
                    FAIL_PODS=`kubectl get pods -l app=${appName} --namespace=${GwAtmosLabels.POD_NAME.labelValue} | grep CrashLoopBackOff | cut -d' ' -f1 | tail -n +2`
                    if [[ ! -z "${'$'}FAIL_PODS" ]]; then
                        echo "The following pods failed in last Deployment. Please check it in Kubernetes Dashboard."
                        echo "${'$'}FAIL_PODS" && false
                    fi
                    sleep 10
                    TIME=${'$'}[${'$'}TIME+1]
                done
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createAddPullRequestCommentStep(
        stepNameSuffix: String,
        commentText: String,
        projectKey: String,
        repoKey: String,
        pullRequestId: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Add a pull request comment (${stepNameSuffix})"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                    set -xe
                curl -X POST https://stash.guidewire.com/rest/api/1.0/projects/${projectKey}/repos/${repoKey}/pull-requests/${pullRequestId}/comments \
                        -H "Accept: application/json" \
                        -H "Content-Type: application/json" \
                        -H "Authorization: Bearer %env.BITBUCKET_ACCESS_TOKEN%" \
                        -d '{ "text": "$commentText"}'
            """.trimIndent()
        }
    }

    fun createPublishNpmPackageStep(packageHandle: String, packagePath: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "NPM publish $packageHandle"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                npm install -g npm-cli-login
                npm-cli-login -u ${'$'}{ARTIFACTORY_SERVICE_ACCOUNT_USERNAME} -p ${'$'}{ARTIFACTORY_API_KEY} -e svc-doc-artifactory@guidewire.com -r https://artifactory.guidewire.com/api/npm/doctools-npm-dev
                npm config set @doctools:registry https://artifactory.guidewire.com/api/npm/doctools-npm-dev/
                npm config set always-auth true
                npm config set unsafe-perm true
                
                yarn install
                yarn build:$packageHandle
                cd $packagePath
                npm publish
            """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = "artifactory.guidewire.com/hub-docker-remote/node:16.16.0"
        }
    }

    fun createUploadLegacyConfigsAndPagesToS3BucketStep(deployEnv: String): ScriptBuildStep {
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val localRootDir = "%teamcity.build.checkoutDir%"
        val legacyConfigsPublishPath = "legacy-config"
        val localLegacyConfigsPublishPath = "${localRootDir}/$legacyConfigsPublishPath"
        val localLegacyPagesPublishPath = "${localRootDir}/output"
        val s3BucketUrl = "s3://tenant-doctools-${atmosDeployEnv}-builds"
        val s3LegacyConfigsPublishPath = "${s3BucketUrl}/${legacyConfigsPublishPath}"
        val s3LegacyPagesPublishPath = "${s3BucketUrl}/legacy-landing-pages"
        return ScriptBuildStep {
            name = "Upload legacy configs and legacy pages to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                $awsEnvVars
                
                mkdir -p "$localLegacyConfigsPublishPath"
                                
                mv "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/docs.json"
                mv "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/sources.json"
                mv "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/builds.json"
                
                rm -rf 
                
                # Copy merged legacy configs to the S3 bucket
                aws s3 sync "$localLegacyConfigsPublishPath" "$s3LegacyConfigsPublishPath" --delete
                
                # Copy merged legacy pages to the S3 bucket
                aws s3 sync "$localLegacyPagesPublishPath" "$s3LegacyPagesPublishPath" --delete --exclude "**/breadcrumbs.json" --exclude "**/versionSelectors.json"
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    object MergeDocsConfigFilesStep : ScriptBuildStep({
        name = "Merge docs config files"
        id = Helpers.createIdStringFromName(this.name)
        scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer merge "${GwConfigParams.DOCS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}"
            """.trimIndent()
        dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.imageUrl
        dockerImagePlatform = ImagePlatform.Linux
    })

    fun createGenerateDocsConfigFilesForEnvStep(deployEnv: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Generate config file for $deployEnv"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                config_deployer deploy "${GwConfigParams.DOCS_CONFIG_FILES_DIR.paramValue}" -o "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}" --deploy-env $deployEnv
            """.trimIndent()
            dockerImage = GwDockerImages.CONFIG_DEPLOYER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunFlailSsgStep(
        pagesDir: String,
        outputDir: String,
        deployEnv: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run Flail SSG (${deployEnv})"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export PAGES_DIR="$pagesDir"
                export OUTPUT_DIR="$outputDir"
                export DOCS_CONFIG_FILE="${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/${GwConfigParams.MERGED_CONFIG_FILE.paramValue}"
                export DEPLOY_ENV="$deployEnv"
                export SEND_BOUNCER_HOME="no"
                                
                flail_ssg
            """.trimIndent()
            dockerImage = GwDockerImages.FLAIL_SSG_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRefreshConfigBuildStep(deployEnv: String): ScriptBuildStep {
        val url = Helpers.getTargetUrl(deployEnv)
        return ScriptBuildStep {
            name = "Refresh config for $deployEnv"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                curl $url/safeConfig/refreshConfig
            """.trimIndent()
        }
    }

    fun createRunLionPageBuilderStep(locDocsSrc: String, locDocsOut: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the lion page builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export LOC_DOCS_SRC="$locDocsSrc"
                export LOC_DOCS_OUT="$locDocsOut"
                
                lion_page_builder
            """.trimIndent()
            dockerImage = GwDockerImages.LION_PAGE_BUILDER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createCopyLocalizedPdfsToS3BucketStep(deployEnv: String, locDocsSrc: String): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        return ScriptBuildStep {
            name = "Copy localized PDFs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                $awsEnvVars
                        
                aws s3 sync "$locDocsSrc" s3://tenant-doctools-${atmosDeployEnv}-builds/l10n --exclude ".git/*" --delete
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createRunLionPkgBuilderStep(
        workingDir: String,
        outputDir: String,
        tcBuildTypeId: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the lion pkg builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export TEAMCITY_API_ROOT_URL="https://gwre-devexp-ci-production-devci.gwre-devops.net/app/rest/" 
                export TEAMCITY_API_AUTH_TOKEN="%env.TEAMCITY_API_ACCESS_TOKEN%"
                export TEAMCITY_RESOURCES_ARTIFACT_PATH="${GwConfigParams.BUILD_DATA_DIR.paramValue}/${GwConfigParams.BUILD_DATA_FILE.paramValue}"
                export ZIP_SRC_DIR="zip"
                export OUTPUT_PATH="$outputDir"
                export WORKING_DIR="$workingDir"
                export TC_BUILD_TYPE_ID="$tcBuildTypeId"
                
                lion_pkg_builder
            """.trimIndent()
            dockerImage = GwDockerImages.LION_PKG_BUILDER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunUpgradeDiffsPageBuilderStep(
        deployEnv: String,
        upgradeDiffsDocsSrc: String,
        upgradeDiffsDocsOut: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the upgrade diffs page builder"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export UPGRADEDIFFS_DOCS_SRC="$upgradeDiffsDocsSrc"
                export UPGRADEDIFFS_DOCS_OUT="$upgradeDiffsDocsOut"
                export DEPLOY_ENV="$deployEnv"
                
                upgradediffs_page_builder
            """.trimIndent()
            dockerImage = GwDockerImages.UPGRADE_DIFFS_PAGE_BUILDER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createCopyUpgradeDiffsToS3BucketStep(deployEnv: String, upgradeDiffsDocsSrc: String): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        var awsS3SyncCommand =
            "aws s3 sync \"${upgradeDiffsDocsSrc}\" s3://tenant-doctools-${atmosDeployEnv}-builds/upgradediffs --delete"
        if (arrayOf(GwDeployEnvs.STAGING.envName, GwDeployEnvs.PROD.envName).contains(deployEnv)) {
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
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createRunSitemapGeneratorStep(deployEnv: String, outputDir: String): ScriptBuildStep {
        val appBaseUrl = Helpers.getTargetUrl(deployEnv)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deployEnv)
        return ScriptBuildStep {
            name = "Run the sitemap generator"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export OUTPUT_DIR="$outputDir"
                export APP_BASE_URL="$appBaseUrl"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                
                sitemap_generator
            """.trimIndent()
            dockerImage = GwDockerImages.SITEMAP_GENERATOR_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunIndexCleanerStep(deployEnv: String): ScriptBuildStep {
        // Do not use the config file from dev because here are hardly any docs configured for dev and the index
        // will end up with very few docs.
        val envForConfigFile =
            if (deployEnv == GwDeployEnvs.DEV.envName) GwDeployEnvs.STAGING.envName else deployEnv
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deployEnv)
        val configFileUrl = Helpers.getConfigFileUrl(envForConfigFile)
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
            dockerImage = GwDockerImages.INDEX_CLEANER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunDocCrawlerStep(deployEnv: String, docId: String, configFile: String): ScriptBuildStep {
        val docS3Url = Helpers.getS3BucketUrl(deployEnv)
        val appBaseUrl = Helpers.getTargetUrl(deployEnv)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deployEnv)
        val reportBrokenLinks = if (deployEnv == GwDeployEnvs.PROD.envName) "no" else "yes"
        val reportShortTopics = if (deployEnv == GwDeployEnvs.PROD.envName) "no" else "yes"
        return ScriptBuildStep {
            name = "Run the doc crawler"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="$configFile"
                export DOC_ID="$docId"
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
            dockerImage = GwDockerImages.DOC_CRAWLER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createGetConfigFileStep(deployEnv: String, configFile: String): ScriptBuildStep {

        val configFileUrl = Helpers.getConfigFileUrl(deployEnv)

        return ScriptBuildStep {
            name = "Get config file"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export CONFIG_FILE="$configFile"
                export TMP_CONFIG_FILE="%teamcity.build.workingDir%/tmp_config.json"
                export CONFIG_FILE_URL="$configFileUrl"
                
                curl ${'$'}CONFIG_FILE_URL > ${'$'}TMP_CONFIG_FILE
                
                if [[ "$deployEnv" == "${GwDeployEnvs.PROD.envName}" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc") | not)]}' > ${'$'}CONFIG_FILE                 
                elif [[ "$deployEnv" == "${GwDeployEnvs.PORTAL2.envName}" ]]; then
                    cat ${'$'}TMP_CONFIG_FILE | jq -r '{"docs": [.docs[] | select(.url | startswith("portal/secure/doc"))]}' > ${'$'}CONFIG_FILE
                else
                    cat ${'$'}TMP_CONFIG_FILE > ${'$'}CONFIG_FILE
                fi
            """.trimIndent()
        }
    }

    fun createGetDocumentDetailsStep(
        workingDir: String,
        buildBranch: String,
        srcId: String,
        docInfoFile: String,
        docConfig: JSONObject,
    ): ScriptBuildStep {
        val docInfoFilePath = "${workingDir}/${docInfoFile}"
        return ScriptBuildStep {
            name = "Get document details"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    cat << EOF | jq '. += {"gitBuildBranch": "$buildBranch", "gitSourceId": "$srcId"}' > "$docInfoFilePath" | jq .
                    $docConfig
                    EOF
                 
                    cat "$docInfoFilePath"
                """.trimIndent()
        }
    }

    fun createCopyFromStagingToProdStep(publishPath: String): ScriptBuildStep {
        val awsEnvVarsStaging = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)
        val awsEnvVarsProd = Helpers.setAwsEnvVars(GwDeployEnvs.PROD.envName)
        return ScriptBuildStep {
            name = "Copy from S3 on staging to S3 on prod"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    echo "Setting credentials to access staging"
                    $awsEnvVarsStaging
                    
                    echo "Copying from staging to Teamcity"
                    aws s3 sync s3://tenant-doctools-staging-builds/${publishPath} ${publishPath}/ --delete
                    
                    echo "Setting credentials to access prod"
                    $awsEnvVarsProd
                    
                    echo "Uploading from Teamcity to prod"
                    aws s3 sync ${publishPath}/ s3://tenant-doctools-omega2-andromeda-builds/${publishPath} --delete
                """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createCopyPdfFromOnlineToOfflineOutputStep(
        onlineOutputPath: String,
        offlineOutputPath: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Copy PDF from online to offline output"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                cp -avR "${onlineOutputPath}/pdf" "$offlineOutputPath" 2>/dev/null || :
                """.trimIndent()
        }
    }

    fun createZipPackageStep(
        inputPath: String, targetPath: String,
    ): ScriptBuildStep {
        val zipPackageName = "docs.zip"

        return ScriptBuildStep {
            name = "Build a ZIP package"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Creating a ZIP package"
                cd "$inputPath"
                zip -r "${targetPath}/${zipPackageName}" * &&
                rm -rf "$inputPath"
            """.trimIndent()
        }
    }

    fun createUploadContentToS3BucketStep(
        deployEnv: String, outputPath: String, publishPath: String,
    ): ScriptBuildStep {
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        return ScriptBuildStep {
            name = "Upload content to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    $awsEnvVars
                    
                    aws s3 sync "$outputPath" s3://tenant-doctools-${atmosDeployEnv}-builds/${publishPath} --delete
                """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createPreviewUrlFile(
        previewUrl: String, previewUrlFile: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Create preview URL file"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                echo "Output preview available at $previewUrl" > $previewUrlFile
            """.trimIndent()
        }
    }

    fun createCopyResourcesStep(
        stepId: Int,
        workingDir: String,
        outputDir: String,
        resourceSrcDir: String,
        resourceTargetDir: String,
        resourceSrcUrl: String,
        resourceSrcBranch: String,
    ): ScriptBuildStep {
        val resourcesRootDir = "resource$stepId"
        val fullTargetPath = "${workingDir}/${outputDir}/${resourceTargetDir}"
        return ScriptBuildStep {
            name = "Copy resources from git to the doc output dir ($stepId)"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                        
                git clone --single-branch --branch $resourceSrcBranch $resourceSrcUrl $resourcesRootDir
                        
                echo "Copying files to the doc output dir"
                mkdir -p $fullTargetPath
                cp -R ./${resourcesRootDir}/${resourceSrcDir}/* $fullTargetPath
            """.trimIndent()
        }
    }

    fun createBuildDitaProjectForValidationsStep(
        outputFormat: String,
        rootMap: String,
        workingDir: String,
        outputDir: String,
        publishPath: String,
        ditaOtLogsDir: String,
        normalizedDitaDir: String,
        schematronReportsDir: String,
        indexRedirect: Boolean,
        buildFilter: String? = null,
    ): ScriptBuildStep {
        val logFile = "${outputFormat}_build.log"
        val fullOutputPath = "${outputDir}/${outputFormat}"

        val ditaCommandParams = mutableListOf<Pair<String, String?>>(
            Pair("-i", "${workingDir}/${rootMap}"),
            Pair("-o", "${workingDir}/${fullOutputPath}"),
            Pair("-l", "${workingDir}/${logFile}"),
            Pair("--args.draft", "yes"),
        )

        if (buildFilter != null) {
            ditaCommandParams.add(
                Pair(
                    "--filter", "${workingDir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.paramValue}/${buildFilter}"
                )
            )
        }

        val getDitavalCommand = Helpers.createGetDitavalCommandString(workingDir, buildFilter)
        var buildCommand = ""

        when (outputFormat) {
            // --git-url and --git-branch are required by the DITA OT plugin to generate build data.
            // There are not needed in this build, so they have fake values
            GwDitaOutputFormats.HTML5.formatName -> {
                val tempDir = "tmp/${outputFormat}"
                ditaCommandParams.add(Pair("-f", "html5-Guidewire"))
                ditaCommandParams.add(Pair("--args.rellinks", "nofamily"))
                ditaCommandParams.add(Pair("--generate.build.data", "yes"))
                ditaCommandParams.add(Pair("--git.url", "gitUrl"))
                ditaCommandParams.add(Pair("--git.branch", "gitBranch"))
                ditaCommandParams.add(Pair("--gw-base-url", publishPath))
                ditaCommandParams.add(Pair("--temp", "${workingDir}/${tempDir}"))
                ditaCommandParams.add(Pair("--clean.temp", "no"))
                ditaCommandParams.add(Pair("--schematron.validate", "yes"))
                ditaCommandParams.add(Pair("%env.ENABLE_DEBUG_MODE%", ""))
                if (indexRedirect) {
                    ditaCommandParams.add(Pair("--create-index-redirect", "yes"))
                }
                val ditaBuildCommand = Helpers.getCommandString("dita", ditaCommandParams)
                val resourcesCopyCommand =
                    "mkdir -p \"${workingDir}/${schematronReportsDir}\" && cp \"${workingDir}/${tempDir}/validation-report.xml\" \"${workingDir}/${schematronReportsDir}/\""
                val logsCopyCommand =
                    "mkdir -p \"${workingDir}/${ditaOtLogsDir}\" && cp \"${workingDir}/${logFile}\" \"${workingDir}/${ditaOtLogsDir}/\""
                buildCommand = """
                    $ditaBuildCommand && $resourcesCopyCommand
                    $logsCopyCommand
                """.trimIndent()
            }

            GwDitaOutputFormats.DITA.formatName -> {
                ditaCommandParams.add(Pair("-f", "gw_dita"))
                val ditaBuildCommand = Helpers.getCommandString("dita", ditaCommandParams)
                val resourcesCopyCommand =
                    "mkdir -p \"${workingDir}/${normalizedDitaDir}\" && cp -R \"${workingDir}/${fullOutputPath}/\"* \"${workingDir}/${normalizedDitaDir}/\""
                buildCommand = "$ditaBuildCommand && $resourcesCopyCommand"
            }
        }

        return ScriptBuildStep {
            name = "Build the ${outputFormat.replace("_", "")} output"
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
            dockerImage = GwDockerImages.DITA_OT_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createBuildDitaProjectForBuildsStep(
        outputFormat: String,
        rootMap: String,
        indexRedirect: Boolean,
        workingDir: String,
        outputDir: String,
        publishPath: String,
        buildFilter: String? = null,
        docId: String? = null,
        docTitle: String? = null,
        gitUrl: String? = null,
        gitBranch: String? = null,
        forOfflineUse: Boolean = false,
        buildPdfs: Boolean = false,
    ): ScriptBuildStep {
        val commandParams = mutableListOf<Pair<String, String?>>(
            Pair("-i", "${workingDir}/${rootMap}"),
            Pair("-o", "${workingDir}/${outputDir}"),
            Pair("--processing-mode", "strict")
        )

        if (buildFilter != null) {
            commandParams.add(
                Pair(
                    "--filter", "${workingDir}/${GwConfigParams.COMMON_GW_DITAVALS_DIR.paramValue}/${buildFilter}"
                )
            )
        }

        when (outputFormat) {
            GwDitaOutputFormats.WEBHELP.formatName -> {
                if (forOfflineUse) {
                    commandParams.add(Pair("--use-doc-portal-params", "no"))
                    commandParams.add(Pair("-f", "webhelp_Guidewire"))
                } else {
                    commandParams.add(Pair("--use-doc-portal-params", "yes"))
                    commandParams.add(Pair("--gw-doc-id", docId))
                    commandParams.add(Pair("--generate.build.data", "yes"))
                    commandParams.add(Pair("--git.url", gitUrl))
                    commandParams.add(Pair("--git.branch", gitBranch))
                    commandParams.add(Pair("-f", "webhelp_Guidewire_validate"))
                }
            }

            GwDitaOutputFormats.WEBHELP_WITH_PDF.formatName -> {
                commandParams.add(Pair("-f", "wh-pdf"))
                commandParams.add(Pair("--use-doc-portal-params", if (forOfflineUse) "no" else "yes"))
                commandParams.add(Pair("--gw-doc-id", docId))
                commandParams.add(Pair("--generate.build.data", "yes"))
                commandParams.add(Pair("--git.url", gitUrl))
                commandParams.add(Pair("--git.branch", gitBranch))
            }

            GwDitaOutputFormats.PDF.formatName -> {
                commandParams.add(Pair("-f", "pdf2_Guidewire"))
                commandParams.add(Pair("--ah.remote", "true"))
            }

            GwDitaOutputFormats.SINGLEHTML.formatName -> {
                commandParams.add(Pair("-f", "singlehtml"))
            }

            GwDitaOutputFormats.HTML5.formatName -> {
                commandParams.add(Pair("--gw-base-url", publishPath))
                commandParams.add(Pair("--gw-doc-id", docId))
                commandParams.add(Pair("--gw-doc-title", docTitle))
                commandParams.add(Pair("--generate.build.data", "yes"))
                commandParams.add(Pair("--git.url", gitUrl))
                commandParams.add(Pair("--git.branch", gitBranch))
                commandParams.add(Pair("-f", "html5-Guidewire"))
                commandParams.add(Pair("--args.rellinks", "nofamily"))
                commandParams.add(Pair("--build.pdfs", if (buildPdfs) "yes" else "no"))
                if (forOfflineUse) {
                    commandParams.add(Pair("--gw-offline-webhelp", "yes"))
                }
            }

            GwDitaOutputFormats.HTML5_WITH_PDF.formatName -> {
                commandParams.add(Pair("--gw-base-url", publishPath))
                commandParams.add(Pair("--gw-doc-id", docId))
                commandParams.add(Pair("--gw-doc-title", docTitle))
                commandParams.add(Pair("--generate.build.data", "yes"))
                commandParams.add(Pair("--git.url", gitUrl))
                commandParams.add(Pair("--git.branch", gitBranch))
                commandParams.add(Pair("-f", "html5-Guidewire"))
                commandParams.add(Pair("--args.rellinks", "nofamily"))
                commandParams.add(Pair("--build.pdfs", "yes"))
                if (forOfflineUse) {
                    commandParams.add(Pair("--gw-offline-webhelp", "yes"))
                }
            }
        }

        if (indexRedirect) {
            if (arrayOf(
                    GwDitaOutputFormats.WEBHELP.formatName,
                    GwDitaOutputFormats.WEBHELP_WITH_PDF.formatName,
                ).contains(outputFormat)
            ) {
                commandParams.add(Pair("--create-index-redirect", "yes"))
                commandParams.add(Pair("--webhelp.publication.toc.links", "all"))
            } else if (arrayOf(
                    GwDitaOutputFormats.HTML5.formatName,
                    GwDitaOutputFormats.HTML5_WITH_PDF.formatName,
                ).contains(outputFormat)
            ) {
                commandParams.add(Pair("--create-index-redirect", "yes"))
            }
        }

        val getDitavalCommand = Helpers.createGetDitavalCommandString(workingDir, buildFilter)
        val ditaBuildCommand = Helpers.getCommandString("dita", commandParams)

        val dockerImageName = when (forOfflineUse && (arrayOf(
            GwDitaOutputFormats.WEBHELP.formatName,
            GwDitaOutputFormats.WEBHELP_WITH_PDF.formatName,
            GwDitaOutputFormats.SINGLEHTML.formatName,
        ).contains(outputFormat))
        ) {
            true -> GwDockerImages.DITA_OT_3_4_1.imageUrl
            false -> GwDockerImages.DITA_OT_LATEST.imageUrl
        }

        return ScriptBuildStep {
            name = "Build the ${outputFormat.replace("_", "")} output"
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
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export EXIT_CODE=0
                
                yarn
                yarn build:html5 || EXIT_CODE=${'$'}?
                
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = "${GwDockerImages.NODE_REMOTE_BASE.imageUrl}:16.16.0"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--user 1000:1000"
        }
    }

    fun createBuildHtml5OfflineDependenciesStep(): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Build HTML5 offline dependencies"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export EXIT_CODE=0
                
                yarn
                yarn build:html5-offline || EXIT_CODE=${'$'}?
                
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = "${GwDockerImages.NODE_REMOTE_BASE.imageUrl}:16.16.0"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--user 1000:1000"
        }
    }

    fun createDeployHtml5OfflineDependenciesStep(ditaOtPath: String): ScriptBuildStep {
        val targetPath = "$ditaOtPath/guidewire/com.guidewire.html5/scripts"
        return ScriptBuildStep {
            name = "Deploy HTML5 offline dependencies"
            id = Helpers.createIdStringFromName(this.name)
            workingDir = "html5"
            scriptContent = """
                #!/bin/bash
                set -xe
                
                rsync -avu --delete ./build/ $targetPath/
                
                cd $ditaOtPath
                git add .
                git commit -m "Load the latest HTML5 scripts (%build.number%)"
                git push -u origin main
            """.trimIndent()
        }
    }

    fun createBuildYarnProjectStep(
        deployEnv: String,
        publishPath: String,
        buildCommand: String?,
        nodeImageVersion: String?,
        docId: String,
        gwProducts: String,
        gwPlatforms: String,
        gwVersions: String,
        workingDir: String,
        customEnv: JSONArray?,
        validationMode: Boolean = false,
        exitCodeEnvVarName: String = "",
    ): ScriptBuildStep {
        val nodeImage = when (nodeImageVersion) {
            null -> "${GwDockerImages.NODE_REMOTE_BASE.imageUrl}:17.6.0"
            else -> "${GwDockerImages.NODE_REMOTE_BASE.imageUrl}:${nodeImageVersion}"
        }
        val scriptBuildCommand = buildCommand ?: "build"
        val logFile = "yarn_build.log"
        val buildCommandBlock = if (validationMode) {
            """
                export EXIT_CODE=0
                yarn $scriptBuildCommand &> "${workingDir}/${logFile}" || EXIT_CODE=${'$'}?
                
                if [[ ${'$'}EXIT_CODE != 0 ]]; then
                    echo "VALIDATION FAILED: High severity issues found."
                    echo "Check "$logFile" in the build artifacts for more details."
                fi
                
                echo "##teamcity[setParameter name='$exitCodeEnvVarName' value='${'$'}EXIT_CODE']"
                    
                exit ${'$'}EXIT_CODE
                """.trimIndent()
        } else {
            """
                export EXIT_CODE=0
                yarn $scriptBuildCommand || EXIT_CODE=${'$'}?
                exit ${'$'}EXIT_CODE
            """.trimIndent()
        }
        val targetUrl = Helpers.getTargetUrl(deployEnv)
        var customEnvExportVars = ""
        customEnv?.forEach {
            it as JSONObject
            customEnvExportVars += "export ${it.getString("name")}=\"${it.getString("value")}\" # Custom env from the build config file\n"
        }

        return ScriptBuildStep {
            name = "Build the yarn project"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    
                    export DEPLOY_ENV="$deployEnv"
                    export GW_DOC_ID="$docId"
                    export GW_PRODUCT="$gwProducts"
                    export GW_PLATFORM="$gwPlatforms"
                    export GW_VERSION="$gwVersions"
                    export TARGET_URL="$targetUrl"
                    export BASE_URL="/${publishPath}/"
                    $customEnvExportVars
                    
                    cd "$workingDir"
                    yarn install
                    $buildCommandBlock
                """.trimIndent()
            dockerImage = nodeImage
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "--user 1000:1000"
        }
    }

    fun createBuildStorybookProjectStep(
        deployEnv: String,
        publishPath: String,
        docId: String,
        gwProducts: String,
        gwPlatforms: String,
        gwVersions: String,
        workingDir: String,
        customEnv: JSONArray?,
    ): ScriptBuildStep {
        val targetUrl = Helpers.getTargetUrl(deployEnv)
        var customEnvExportVars = ""
        customEnv?.forEach {
            it as JSONObject
            customEnvExportVars += "export ${it.getString("name")}=\"${it.getString("value")}\" # Custom env from the build config file\n"
        }

        return ScriptBuildStep {
            name = "Build the Storybook project"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    export DEPLOY_ENV="$deployEnv"
                    export GW_DOC_ID="$docId"
                    export GW_PRODUCT="$gwProducts"
                    export GW_PLATFORM="$gwPlatforms"
                    export JUTRO_VERSION="$gwVersions"
                    export TARGET_URL="$targetUrl"
                    export BASE_URL="/${publishPath}/"
                    $customEnvExportVars
                    
                    # legacy Jutro repos
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/jutro-npm-dev -s @jutro
                    npm config set @jutro:registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/jutro-npm-dev/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/globalization-npm-release -s @gwre-g11n
                    npm config set @gwre-g11n:registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/globalization-npm-release/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/elixir -s @elixir
                    npm config set @elixir:registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/elixir/
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/portfoliomunster-npm-dev -s @gtui
                    npm config set @gtui:registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/portfoliomunster-npm-dev/
                                        
                    # new Jutro proxy repo
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/jutro-suite-npm-dev
                    npm config set registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/jutro-suite-npm-dev/

                    # Doctools repo
                    npm-cli-login -u "%env.ARTIFACTORY_SERVICE_ACCOUNT_USERNAME%" -p "%env.ARTIFACTORY_API_KEY%" -e doctools@guidewire.com -r https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/doctools-npm-dev -s @doctools
                    npm config set @doctools:registry https://${GwConfigParams.ARTIFACTORY_HOST.paramValue}/artifactory/api/npm/doctools-npm-dev/
                    
                    cd "$workingDir"
                    yarn
                    export EXIT_CODE=0
                    NODE_OPTIONS=--max_old_space_size=4096 CI=true yarn build || EXIT_CODE=${'$'}?
                    exit ${'$'}EXIT_CODE
                """.trimIndent()
            dockerImage = GwDockerImages.GENERIC_14_14_0_YARN_CHROME.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createZipUpSourcesStep(inputPath: String, outputDir: String, zipFilename: String): ScriptBuildStep {
        val zipPackageName = "${zipFilename}.zip"
        return ScriptBuildStep {
            name = "Zip up sources"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                cd "$inputPath"
                zip -r "$zipPackageName" . -x '*.git*'
                zip -r "$zipPackageName" .gitignore
                mkdir "$outputDir"
                mv "$zipPackageName" "$outputDir/${zipPackageName}"
            """.trimIndent()
        }
    }

    fun createRunBuildManagerStep(
        teamcityAffectedProject: String,
        teamcityTemplate: String,
        gitUrl: String,
        gitBranch: String,
        teamcityBuildBranch: String,
    ): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Run the build manager"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export TEAMCITY_RESOURCES_ARTIFACT_PATH="${GwConfigParams.BUILD_DATA_DIR.paramValue}/${GwConfigParams.BUILD_DATA_FILE.paramValue}"
                export TEAMCITY_AFFECTED_PROJECT="$teamcityAffectedProject"
                export TEAMCITY_TEMPLATE="$teamcityTemplate"
                export GIT_URL="$gitUrl"
                export GIT_BRANCH="$gitBranch"
                export TEAMCITY_BUILD_BRANCH="$teamcityBuildBranch"
                                                        
                build_manager
            """.trimIndent()
            dockerImage = GwDockerImages.BUILD_MANAGER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunDocValidatorStep(
        validationModule: String,
        workingDir: String,
        ditaOtLogsDir: String,
        normalizedDitaDir: String,
        schematronReportsDir: String,
        docInfoFile: String,
        exitCodeEnvVarName: String,
    ): ScriptBuildStep {
        var stepName = ""
        val docInfoFileFullPath = "${workingDir}/${docInfoFile}"
        val elasticsearchUrl = Helpers.getElasticsearchUrl(GwDeployEnvs.STAGING.envName)
        val validationCommandParams = mutableListOf<Pair<String, String?>>(
            Pair("--elasticsearch-urls", elasticsearchUrl),
            Pair("--doc-info", docInfoFileFullPath),
        )

        when (validationModule) {
            GwValidationModules.VALIDATORS_DITA.validationName -> {
                validationCommandParams.add(Pair("validators", "${workingDir}/${normalizedDitaDir}"))
                validationCommandParams.add(Pair("dita", ""))
                stepName = "Run GW validations for issues in DITA files"
            }

            GwValidationModules.VALIDATORS_FILES.validationName -> {
                validationCommandParams.add(Pair("validators", "${workingDir}/${normalizedDitaDir}"))
                validationCommandParams.add(Pair("files", ""))
                stepName = "Run GW validations for miscellaneous issues, like missing file extensions"
            }

            GwValidationModules.VALIDATORS_IMAGES.validationName -> {
                validationCommandParams.add(Pair("validators", "${workingDir}/${normalizedDitaDir}"))
                validationCommandParams.add(Pair("images", ""))
                stepName = "Run GW validations for images and <img> tags in DITA files"
            }

            GwValidationModules.EXTRACTORS_DITA_OT_LOGS.validationName -> {
                validationCommandParams.add(Pair("extractors", "${workingDir}/${ditaOtLogsDir}"))
                validationCommandParams.add(Pair("dita-ot-logs", ""))
                stepName = "Get issues from log files generated by DITA OT builds"
            }

            GwValidationModules.EXTRACTORS_SCHEMATRON_REPORTS.validationName -> {
                validationCommandParams.add(Pair("extractors", "${workingDir}/${schematronReportsDir}"))
                validationCommandParams.add(Pair("schematron-reports", ""))
                stepName = "Get issues from reports generated by Schematron validations"
            }
        }
        val validationCommand = Helpers.getCommandString("doc_validator", validationCommandParams)
        return ScriptBuildStep {
            name = stepName
            id = Helpers.createIdStringFromName(this.name)
            executionMode = BuildStep.ExecutionMode.RUN_ON_FAILURE
            this.workingDir = workingDir
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export EXIT_CODE=0
                $validationCommand || EXIT_CODE=${'$'}?
                echo "##teamcity[setParameter name='$exitCodeEnvVarName' value='${'$'}EXIT_CODE']"
                exit ${'$'}EXIT_CODE
            """.trimIndent()
            dockerImage = GwDockerImages.DOC_VALIDATOR_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createDeployStaticFilesStep(
        deployEnv: String,
        deploymentMode: String,
        outputDir: String,
    ): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        var sourceDir = outputDir
        var targetDir = ""
        var excludedPatterns = ""
        when (deploymentMode) {
            GwStaticFilesModes.LANDING_PAGES.modeName -> {
                targetDir = "pages"
                excludedPatterns = "--exclude \"*l10n/*\" --exclude \"*upgradediffs/*\""
            }

            GwStaticFilesModes.LOCALIZED_PAGES.modeName -> {
                sourceDir = "${outputDir}/l10n"
                targetDir = "pages/l10n"
            }

            GwStaticFilesModes.UPGRADE_DIFFS.modeName -> {
                sourceDir = "${outputDir}/upgradediffs"
                targetDir = "pages/upgradediffs"
            }

            GwStaticFilesModes.SITEMAP.modeName -> targetDir = "sitemap"
            GwStaticFilesModes.HTML5.modeName -> targetDir = "html5"
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
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}pwd:/app:ro"
        }
    }

    fun createSyncDataFromStagingS3BucketToDevS3BucketStep(): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.envName)
        return ScriptBuildStep {
            name = "Sync contents from staging S3 bucket to dev S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/bash
                    set -xe
                    
                    $awsEnvVars
                    
                    echo Syncing the s3 server...
                    aws s3 sync "s3://tenant-doctools-${GwDeployEnvs.STAGING.envName}-builds" "s3://tenant-doctools-${GwDeployEnvs.DEV.envName}-builds" --delete --only-show-errors --exclude "_do-not-delete/*"
                """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
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
        teamcitySshKey = GwConfigParams.BITBUCKET_SSH_KEY.paramValue
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
            password = "%env.BITBUCKET_ACCESS_TOKEN%"
        }
    })

    fun createGwPullRequestsBuildFeature(targetGitBranch: String): PullRequests {
        return PullRequests {
            provider = bitbucketServer {
                serverUrl = "https://stash.guidewire.com"
                authType = token {
                    token = "%env.BITBUCKET_ACCESS_TOKEN%"
                }
                filterTargetBranch = "+:${targetGitBranch}"
            }
        }
    }
}

object GwVcsRoots {
    // TODO:
    //  - Switch this repo to the master branch after testing is done
    //  - Change the branch filter to "(refs/heads/*)"
    val DocumentationPortalGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("Documentation Portal git repo"),
        "ssh://git@stash.guidewire.com/doctools/documentation-portal.git",
        "feature/typeorm",
        listOf("(refs/heads/feature/typeorm*)")
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

    val DitaOtPluginsVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString("DITA OT plugins repo"),
        "ssh://git@stash.guidewire.com/doctools/dita-ot-plugins.git",
        "main",
    )

    private fun createGitVcsRoot(
        vcsRootId: RelativeId,
        gitUrl: String,
        defaultBranch: String,
        monitoredBranches: List<String> = emptyList(),
    ): GitVcsRoot {
        return GitVcsRoot {
            name = vcsRootId.toString()
            id = vcsRootId
            url = gitUrl
            branch = Helpers.createFullGitBranchName(defaultBranch)
            authMethod = uploadedKey {
                uploadedKey = GwConfigParams.BITBUCKET_SSH_KEY.paramValue
            }
            checkoutPolicy = GitVcsRoot.AgentCheckoutPolicy.USE_MIRRORS

            if (monitoredBranches.isNotEmpty()) {
                branchSpec = ""
                monitoredBranches.forEach {
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
    fun createBranchFilter(gitBranches: List<String>, addDefaultBranch: Boolean = true): String {
        val gitBranchesEntries = mutableListOf<String>()
        if (addDefaultBranch) gitBranchesEntries.add("+:<default>")
        gitBranches.forEach {
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
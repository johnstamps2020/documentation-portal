import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.DockerSupportFeature
import jetbrains.buildServer.configs.kotlin.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.buildFeatures.SshAgent
import jetbrains.buildServer.configs.kotlin.buildSteps.*
import jetbrains.buildServer.configs.kotlin.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import java.math.BigInteger
import java.security.MessageDigest
import java.util.*

version = "2024.03"
project {
    vcsRoot(GwVcsRoots.DocumentationPortalGitVcsRoot)
    vcsRoot(GwVcsRoots.DocumentationPortalConfigGitVcsRoot)
    vcsRoot(GwVcsRoots.DitaOtPluginsVcsRoot)
    subProject(Database.rootProject)
    subProject(DocPortal.rootProject)
    subProject(Frontend.rootProject)
    subProject(Server.rootProject)
    subProject(Content.rootProject)
    buildType(TestDocPortalEverything)
    buildType(AuditNpmPackages)
}

enum class GwDeployEnvs(val envName: String) {
    DEV("dev"), STAGING("staging"), PROD("prod"), OMEGA2_ANDROMEDA("omega2-andromeda"), PORTAL2("portal2")
}

enum class GwConfigParams(val paramValue: String) {
    DOCUMENTATION_PORTAL_CONFIG_CHECKOUT_DIR("documentation-portal-config"),
    CONFIG_FILES_ROOT_DIR("%teamcity.build.checkoutDir%/${DOCUMENTATION_PORTAL_CONFIG_CHECKOUT_DIR.paramValue}/.teamcity/config"),
    BUILDS_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/builds"),
    DOCS_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/docs"),
    SOURCES_CONFIG_FILES_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/sources"),
    BUILDS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/out/builds"),
    DOCS_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/out/docs"),
    SOURCES_CONFIG_FILES_OUT_DIR("${CONFIG_FILES_ROOT_DIR.paramValue}/out/sources"),
    BITBUCKET_SSH_KEY("svc-doc-bitbucket"),
    ECR_HOST("627188849628.dkr.ecr.us-west-2.amazonaws.com"),
    ECR_HOST_PROD("954920275956.dkr.ecr.us-east-1.amazonaws.com"),
    AWS_ROLE("arn:aws:iam::627188849628:role/aws_gwre-ccs-dev_tenant_doctools_developer"),
    AWS_ROLE_PROD("arn:aws:iam::954920275956:role/aws_orange-prod_tenant_doctools_developer"),
    ARTIFACTORY_HOST("artifactory.guidewire.com"),
    OKTA_ISSUER("https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7"),
    OKTA_ISSUER_PROD("https://guidewire-hub.okta.com/oauth2/aus11vix3uKEpIfSI357"),
    OKTA_ISSUER_APAC("https://guidewire-hub-apac.okta.com/oauth2/ausbg05gfcTZQ7bpH3l6"),
    OKTA_ISSUER_EMEA("https://guidewire-hub-eu.okta.com/oauth2/ausc2q01c40dNZII0416"),
    OKTA_SCOPES("NODE_Hawaii_Docs_Web.read"),
    OKTA_SCOPES_PROD("Documentation_portal.read"),
    OKTA_AUDIENCE("Guidewire"),
    GW_COMMUNITY_CUSTOMER_IDP("0oau503zlhhFLwTqF0h7"),
    GW_COMMUNITY_CUSTOMER_IDP_PROD("0oa6c4x5z3fYXUWoE357"),
    GW_COMMUNITY_PARTNER_IDP("0oapv9i36yEMFLjxS0h7"),
    GW_COMMUNITY_PARTNER_IDP_PROD("0oa6c4yaoikrU91Hw357"),
    CONFIG_DB_HOST_DEV("tenant-doctools-docportal-${GwDeployEnvs.DEV.envName}-1.crahnfhpsx5k.us-west-2.rds.amazonaws.com"),
    CONFIG_DB_HOST_STAGING("tenant-doctools-docportal-${GwDeployEnvs.STAGING.envName}-1.crahnfhpsx5k.us-west-2.rds.amazonaws.com"),
    CONFIG_DB_HOST_PROD("tenant-doctools-docportal-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}-1.c3qnnou7xlkq.us-east-1.rds.amazonaws.com"),
    DB_CLIENT_POD_NAME("postgresql-client-shell-teamcity"),
    DB_CLIENT_IMAGE_NAME("alpine"),
    DB_CLIENT_PACKAGE_NAME("postgresql14-client"),
    DB_DUMP_ZIP_PACKAGE_NAME("docportalconfig.zip"),

    DOC_PORTAL_APP_NAME("docportal"),
    DOC_PORTAL_FRONTEND_APP_NAME("docportal-frontend"),
    DOC_PORTAL_DIR("server"),
    DOC_PORTAL_FRONTEND_DIR("landing-pages"),
    DOC_PORTAL_KUBE_DEPLOYMENT_FILE("${DOC_PORTAL_DIR.paramValue}/kube/deployment.yml"),

    DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE("${DOC_PORTAL_DIR.paramValue}/kube/gateway-config.yml"),
    DOC_PORTAL_KUBE_GATEWAY_CONFIG_FILE_PROD("${DOC_PORTAL_DIR.paramValue}/kube/gateway-config-prod.yml"),
    DOC_PORTAL_FRONTEND_KUBE_DEPLOYMENT_FILE("${DOC_PORTAL_FRONTEND_DIR.paramValue}/kube/deployment.yml"),
    S3_KUBE_DEPLOYMENT_FILE("aws/s3/kube/service-gateway-config.yml")
}

enum class GwDockerImages(val imageUrl: String) {
    DOC_PORTAL("${GwConfigParams.ECR_HOST.paramValue}/tenant-doctools-docportal"), DOC_PORTAL_PROD("${GwConfigParams.ECR_HOST_PROD.paramValue}/tenant-doctools-docportal"), DOC_PORTAL_FRONTEND(
        "${GwConfigParams.ECR_HOST.paramValue}/tenant-doctools-docportal-frontend"
    ),
    DOC_PORTAL_FRONTEND_PROD("${GwConfigParams.ECR_HOST_PROD.paramValue}/tenant-doctools-docportal-frontend"),
    ATMOS_DEPLOY_2_6_0(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/devex-docker-dev/atmosdeploy:2.6.0"
    ),
    ATMOS_DEPLOY_4_3_0(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/devex-docker-dev/atmosdeploy:4.3.0"
    ),
    CONFIG_DEPLOYER_LATEST("${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/config-deployer:latest"), DOC_CRAWLER_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/doc-crawler:latest"
    ),
    SITEMAP_GENERATOR_LATEST(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/doctools-docker-dev/sitemap-generator:latest"
    ),
    NODE_18_18_2(
        "${GwConfigParams.ARTIFACTORY_HOST.paramValue}/hub-docker-remote/node:18.18.2"
    ),
}

enum class GwStaticFilesModes(val modeName: String) {
    LANDING_PAGES("landing_pages"),
    LOCALIZED_PAGES("localized_pages"),
    UPGRADE_DIFFS("upgrade_diffs"),
    SITEMAP("sitemap"),
    S3_SITEMAP("s3_sitemap"),
    HTML5("html5")
}

enum class GwConfigTypes(val typeName: String) {
    DOCS("docs"), SOURCES("sources"), BUILDS("builds")
}

enum class GwAtmosLabels(val labelValue: String) {
    POD_NAME("doctools"), DEPT_CODE("284"),
}

enum class GwDockerImageTags(val tagValue: String) {
    DOC_PORTAL("latest"), DOC_PORTAL_FRONTEND("latest")
}

enum class GwTriggerPaths(val pathValue: String) {
    AWS_S3_KUBE("aws/s3/kube/**"),
    DB("db/**"),
    PACKAGE_JSON("package.json"),
    HTML5("html5/**"),
    LANDING_PAGES("${GwConfigParams.DOC_PORTAL_FRONTEND_DIR.paramValue}/**"),
    LANDING_PAGES_KUBE("${GwConfigParams.DOC_PORTAL_FRONTEND_DIR.paramValue}/kube/**"),
    SERVER("${GwConfigParams.DOC_PORTAL_DIR.paramValue}/**"),
    SERVER_KUBE("${GwConfigParams.DOC_PORTAL_DIR.paramValue}/kube/**"),
    SERVER_SRC_MODEL_ENTITY("${GwConfigParams.DOC_PORTAL_DIR.paramValue}/src/model/entity/**"),
    SERVER_SRC_TYPES("${GwConfigParams.DOC_PORTAL_DIR.paramValue}/src/types/**"),
    SUBDIRS_PACKAGE_JSON("**/package.json"),
    SCRIPTS_SRC_PAGES_GET_ROOT_BREADCRUMBS("scripts/src/pages/getRootBreadcrumbs.ts"),
    SHIMS("shims/**"),
    TEAMCITY_CONFIG(".teamcity/config/**"),
    YARN_LOCK("yarn.lock"),
}

enum class GwTestTriggerPaths(val pathValue: String) {
    TEAMCITY_SETTINGS_KTS(".teamcity/"),
    CORE("core/"),
    LANDING_PAGES(GwConfigParams.DOC_PORTAL_FRONTEND_DIR.paramValue),
    SERVER(GwConfigParams.DOC_PORTAL_DIR.paramValue),
    HTML5("html5/"),
    AWS_S3_KUBE("aws/s3/kube/"),
    LANDING_PAGES_KUBE("${GwConfigParams.DOC_PORTAL_FRONTEND_DIR.paramValue}/kube/"),
    SERVER_KUBE("${GwConfigParams.DOC_PORTAL_DIR.paramValue}/kube/"),
}

enum class GwDocCrawlerOperationModes(val modeValue: String) {
    CRAWL("crawl"),
    CLEAN_INDEX("clean-index")
}

object Helpers {
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

    fun getTargetUrl(deployEnv: String): String {
        return if (arrayOf(
                GwDeployEnvs.PROD.envName, GwDeployEnvs.PORTAL2.envName
            ).contains(deployEnv)
        ) {
            "https://docs.guidewire.com"
        } else {
            "https://docs.${deployEnv}.ccs.guidewire.net"
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
            export NODE_ENV="production"
            export APP_NAME="${GwConfigParams.DOC_PORTAL_APP_NAME.paramValue}"
            export POD_NAME="${GwAtmosLabels.POD_NAME.labelValue}"
            export DEPT_CODE="${GwAtmosLabels.DEPT_CODE.labelValue}"
            export TAG_VERSION="$tagVersion"
            export APP_BASE_URL="$appBaseUrl"
            export FRONTEND_URL="http://${GwConfigParams.DOC_PORTAL_FRONTEND_APP_NAME.paramValue}-service.doctools:6006"
            export DOC_S3_URL="$docS3Url"
            export PORTAL2_S3_URL="$portal2S3Url"
            export ENABLE_AUTH="yes"
            export DD_SERVICE_NAME="${GwConfigParams.DOC_PORTAL_APP_NAME.paramValue}"
            export OKTA_AUDIENCE="${GwConfigParams.OKTA_AUDIENCE.paramValue}"
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
                export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES_PROD.paramValue}"
                export ELASTIC_SEARCH_URL="http://docsearch-${GwDeployEnvs.OMEGA2_ANDROMEDA.envName}.doctools:9200"
                export CONFIG_DB_HOST="${GwConfigParams.CONFIG_DB_HOST_PROD.paramValue}" 
                export REQUESTS_MEMORY="16G"
                export REQUESTS_CPU="2"
                export LIMITS_MEMORY="16G"
                export LIMITS_CPU="4"
                export NUMBER_OF_REPLICAS="4"
                export PDB_MIN_AVAILABLE="2"
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
                export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES.paramValue}"
                export ELASTIC_SEARCH_URL="http://docsearch-${deployEnv}.doctools:9200"
                export CONFIG_DB_HOST="${
                when (deployEnv) {
                    GwDeployEnvs.STAGING.envName -> GwConfigParams.CONFIG_DB_HOST_STAGING.paramValue
                    GwDeployEnvs.DEV.envName -> GwConfigParams.CONFIG_DB_HOST_DEV.paramValue
                    else -> ""
                }
            }"
                export REQUESTS_MEMORY="1G"
                export REQUESTS_CPU="200m"
                export LIMITS_MEMORY="4G"
                export LIMITS_CPU="2"
                export NUMBER_OF_REPLICAS="2"
                export PDB_MIN_AVAILABLE="1"
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

    fun md5(input: String): String {
        val md = MessageDigest.getInstance("MD5")
        return BigInteger(1, md.digest(input.toByteArray())).toString(16).padStart(32, '0')
    }

}

object GwBuildTypes {
    fun createBuildAndPublishDockerImageToDevEcrBuildType(
        tagVersion: String,
        devDockerImageUrl: String,
        dockerfileName: String,
        snapshotDependencies: List<BuildType>,
    ): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.envName)
        return BuildType {
            name = "Build and publish Docker Image to DEV ECR"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5("${this.name}${devDockerImageUrl}"))
            maxRunningBuilds = 1

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
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
                        docker build -f $dockerfileName -t ${devDockerImageUrl}:${tagVersion} . \
                        --build-arg NPM_AUTH_TOKEN \
                        --build-arg TAG_VERSION \
                        --build-arg DEPT_CODE \
                        --build-arg POD_NAME
                        docker push ${devDockerImageUrl}:${tagVersion}
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters =
                        "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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
            maxRunningBuilds = 1

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
                        "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro -v ${'$'}HOME/.docker:/root/.docker"
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

    fun createRunCheckmarxScanBuildType(sourceDir: String): BuildType {
        return BuildType {
            templates(AbsoluteId("CheckmarxSastScan"))
            name = "Run Checkmarx scan"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5("${this.name}${sourceDir}"))

            params {
                text("checkmarx.project.name", "doctools")
                text("checkmarx.source.directory", sourceDir)
                text(
                    "checkmarx.location.files.exclude ", """
                        !**/_cvs/**/*, !**/.svn/**/*, !**/.hg/**/*, !**/.git/**/*, !**/.bzr/**/*, !**/bin/**/*,
                        !**/obj/**/*, !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr, !**/*.iws,
                        !**/*.bak, !**/*.tmp, !**/*.aac, !**/*.aif, !**/*.iff, !**/*.m3u, !**/*.mid, !**/*.mp3,
                        !**/*.mpa, !**/*.ra, !**/*.wav, !**/*.wma, !**/*.3g2, !**/*.3gp, !**/*.asf, !**/*.asx,
                        !**/*.avi, !**/*.flv, !**/*.mov, !**/*.mp4, !**/*.mpg, !**/*.rm, !**/*.swf, !**/*.vob,
                        !**/*.wmv, !**/*.bmp, !**/*.gif, !**/*.jpg, !**/*.png, !**/*.psd, !**/*.tif, !**/*.swf,
                        !**/*.jar, !**/*.zip, !**/*.rar, !**/*.exe, !**/*.dll, !**/*.pdb,   !**/*.7z,  !**/*.gz,
                        !**/*.tar.gz, !**/*.tar, !**/*.gz, !**/*.ahtm, !**/*.ahtml, !**/*.fhtml, !**/*.hdm,
                        !**/*.hdml, !**/*.hsql, !**/*.ht, !**/*.hta, !**/*.htc, !**/*.htd, !**/*.war, !**/*.ear,
                        !**/*.htmls, !**/*.ihtml, !**/*.mht, !**/*.mhtm, !**/*.mhtml, !**/*.ssi, !**/*.stm,
                        !**/*.stml, !**/*.ttml, !**/*.txn, !**/*.xhtm, !**/*.xhtml, !**/*.class, !**/node_modules/**/*, !**/*.iml,
                        !**/tests/**/*, !**/.teamcity/**/*, !**/__tests__/**/*, !**/images/**/*, !**/fonts/**/*
                    """.trimIndent()
                )
            }

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            }
        }
    }

    fun createTestKubernetesConfigFilesScriptBuildStep(deployEnv: String, triggerPath: String): ScriptBuildStep {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        var deployEnvVars = ""
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        var deploymentFile = ""
        var testGatewayConfigScript = ""

        when (triggerPath) {
            GwTriggerPaths.AWS_S3_KUBE.pathValue, GwTestTriggerPaths.AWS_S3_KUBE.pathValue -> {
                deployEnvVars = Helpers.setContentStorageDeployEnvVars(deployEnv)
                deploymentFile = GwConfigParams.S3_KUBE_DEPLOYMENT_FILE.paramValue
            }
            GwTriggerPaths.LANDING_PAGES_KUBE.pathValue, GwTestTriggerPaths.LANDING_PAGES_KUBE.pathValue -> {
                deployEnvVars =
                    Helpers.setReactLandingPagesDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
                deploymentFile = GwConfigParams.DOC_PORTAL_FRONTEND_KUBE_DEPLOYMENT_FILE.paramValue
            }
            GwTriggerPaths.SERVER_KUBE.pathValue, GwTestTriggerPaths.SERVER_KUBE.pathValue -> {
                deployEnvVars = Helpers.setServerDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
                deploymentFile = GwConfigParams.DOC_PORTAL_KUBE_DEPLOYMENT_FILE.paramValue
                testGatewayConfigScript = """
                        export TMP_GATEWAY_CONFIG_FILE="tmp-gateway-config.yml"
                        eval "echo \"${'$'}(cat ${Helpers.getServerGatewayConfigFile(deployEnv)})\"" > ${'$'}TMP_GATEWAY_CONFIG_FILE
                        kubectl create -f ${'$'}TMP_GATEWAY_CONFIG_FILE --dry-run=client
                    """.trimIndent()
            }
        }

        return ScriptBuildStep {
            name = "Create Kubernetes resources in dry run $deployEnv $triggerPath"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                        #!/bin/bash 
                        set -e
                        
                        # Set AWS credentials
                        $awsEnvVars
                        
                        # Set environment variables needed for Kubernetes config files
                        $deployEnvVars
                        
                        # Set other envs
                        export TMP_DEPLOYMENT_FILE="tmp-deployment.yml"
                        
                        aws eks update-kubeconfig --name atmos-$atmosDeployEnv
                        eval "echo \"${'$'}(cat ${deploymentFile})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                        kubectl create -f ${'$'}TMP_DEPLOYMENT_FILE --dry-run=client
                        
                        $testGatewayConfigScript
                    """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
        }
    }

    fun createTestKubernetesConfigFilesBuildType(deployEnv: String, triggerPath: String): BuildType {
        var buildName = ""

        when (triggerPath) {
            GwTriggerPaths.AWS_S3_KUBE.pathValue -> {
                buildName = "Test Kubernetes config files for content storage on $deployEnv"
            }

            GwTriggerPaths.LANDING_PAGES_KUBE.pathValue -> {
                buildName = "Test Kubernetes config files for React landing pages on $deployEnv"
            }

            GwTriggerPaths.SERVER_KUBE.pathValue -> {
                buildName = "Test Kubernetes config files for server on $deployEnv"
            }
        }
        return BuildType {
            name = buildName
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                step(createTestKubernetesConfigFilesScriptBuildStep(deployEnv, triggerPath))
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
            }

            when (deployEnv) {
                GwDeployEnvs.DEV.envName -> {
                    triggers.trigger(
                        GwVcsTriggers.createGitVcsTrigger(
                            GwVcsRoots.DocumentationPortalGitVcsRoot,
                            listOf(triggerPath)
                        )
                    )
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
        val numberOfPods =
            if (appName == GwConfigParams.DOC_PORTAL_APP_NAME.paramValue && deployEnv == GwDeployEnvs.OMEGA2_ANDROMEDA.envName) {
                4
            } else {
                2
            }

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
                  if [[ "${'$'}TIME" == "20" ]]; then
                    break
                  fi
                  PODS=${'$'}(kubectl get pods -l app=$appName --namespace=doctools | tail -n +2)
                  FAILED_PODS=${'$'}(echo "${'$'}PODS" | grep CrashLoopBackOff | cut -d' ' -f1)
                  if [[ ! -z "${'$'}FAILED_PODS" ]]; then
                    echo "The following pods failed during the deployment. Check the details in Kubernetes."
                    echo "${'$'}FAILED_PODS" && exit 1
                  fi
                  NUMBER_OF_PODS=${'$'}(echo "${'$'}PODS" | wc -l | tr -d " ")
                  NUMBER_OF_RUNNING_PODS=${'$'}(echo "${'$'}PODS" | grep Running | wc -l | tr -d " ")
                  if [[ "${'$'}NUMBER_OF_PODS" -eq $numberOfPods && "${'$'}NUMBER_OF_RUNNING_PODS" -eq $numberOfPods ]]; then
                    echo "Rolling update completed."
                    echo "Running pods: ${'$'}{NUMBER_OF_RUNNING_PODS}/${'$'}{NUMBER_OF_PODS}"
                    break
                  fi
                  echo "Rolling update in progress. Pod status:"
                  echo "${'$'}PODS"
                  echo "Next check in 30 seconds"
                  sleep 30
                  TIME=${'$'}((${'$'}TIME + 1))
                done
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
        }
    }

    fun createPublishNpmPackageStep(packageHandle: String): ScriptBuildStep {
        return ScriptBuildStep {
            name = "NPM publish $packageHandle"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                yarn install
                
                yarn build:core
                yarn publish:core
                
                yarn build:$packageHandle
                yarn publish:$packageHandle
            """.trimIndent()
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        }
    }

    fun createUploadLegacyConfigsToS3BucketStep(deployEnv: String): ScriptBuildStep {
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val localRootDir = "%teamcity.build.checkoutDir%"
        val legacyConfigsPublishPath = "legacy-config"
        val localLegacyConfigsPublishPath = "${localRootDir}/$legacyConfigsPublishPath"
        val s3BucketUrl = "s3://tenant-doctools-${atmosDeployEnv}-builds"
        val s3LegacyConfigsPublishPath = "${s3BucketUrl}/${legacyConfigsPublishPath}"
        return ScriptBuildStep {
            name = "Upload legacy configs to the S3 bucket"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                $awsEnvVars
                
                mkdir -p "$localLegacyConfigsPublishPath"
                                
                mv "${GwConfigParams.DOCS_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/docs.json"
                mv "${GwConfigParams.SOURCES_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/sources.json"
                mv "${GwConfigParams.BUILDS_CONFIG_FILES_OUT_DIR.paramValue}/merge-all.json" "$localLegacyConfigsPublishPath/builds.json"
                
                # Copy merged legacy configs to the S3 bucket
                aws s3 sync "$localLegacyConfigsPublishPath" "$s3LegacyConfigsPublishPath" --delete
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
        }
    }

    fun createRunSitemapGeneratorStep(deployEnv: String, outputDir: String): ScriptBuildStep {
        val appBaseUrl = Helpers.getTargetUrl(deployEnv)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deployEnv)
        val s3BucketUrl = Helpers.getS3BucketUrl(deployEnv)
        return ScriptBuildStep {
            name = "Run the sitemap generator"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                set -xe
                
                export OUTPUT_DIR="$outputDir"
                export APP_BASE_URL="$appBaseUrl"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                export DOC_S3_URL="$s3BucketUrl"
                
                sitemap_generator
            """.trimIndent()
            dockerImage = GwDockerImages.SITEMAP_GENERATOR_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createRunDocCrawlerStep(
        deployEnv: String,
        operationMode: String,
        propertyName: String = "",
        propertyValue: String = "",
    ): ScriptBuildStep {
        val docS3Url = Helpers.getS3BucketUrl(deployEnv)
        val appBaseUrl = Helpers.getTargetUrl(deployEnv)
        val elasticsearchUrls = Helpers.getElasticsearchUrl(deployEnv)
        val reportBrokenLinks: String
        val reportShortTopics: String
        val oktaIssuer: String
        val oktaScopes: String
        when (deployEnv) {
            GwDeployEnvs.PROD.envName -> {
                reportBrokenLinks = "no"
                reportShortTopics = "no"
                oktaIssuer = GwConfigParams.OKTA_ISSUER_PROD.paramValue
                oktaScopes = "${GwConfigParams.OKTA_SCOPES_PROD.paramValue} Documentation_portal.admin"
            }

            else -> {
                reportBrokenLinks = "yes"
                reportShortTopics = "yes"
                oktaIssuer = GwConfigParams.OKTA_ISSUER.paramValue
                oktaScopes = "${GwConfigParams.OKTA_SCOPES.paramValue} NODE_Hawaii_Docs_Web.admin"
            }
        }
        val additionalScriptContent = when (operationMode) {
            GwDocCrawlerOperationModes.CRAWL.modeValue -> """
                if [[ "${propertyName.uppercase()}" == "NONE" ]]; then
                    echo "Indexing all documents"
                else
                    if [[ -z "$propertyValue" ]]; then
                        echo "No value provided for $propertyName"
                        exit 1
                    fi
                    
                    if [[ "${propertyName.uppercase()}" == "DOC_IDS" ]]; then
                        export DOC_IDS="$propertyValue"
                    elif [[ "${propertyName.uppercase()}" == "RELEASES" ]]; then
                        export RELEASES="$propertyValue"
                    elif [[ "${propertyName.uppercase()}" == "VERSIONS" ]]; then
                        export VERSIONS="$propertyValue"
                    else
                        echo "Incorrect property name"
                        echo "Provided name: $propertyName"
                        echo "Supported names: DOC_IDS, RELEASES, VERSIONS"
                        exit 1
                    fi
                fi
                    
                export DOC_S3_URL="$docS3Url"
                export BROKEN_LINKS_INDEX_NAME="broken-links"
                export SHORT_TOPICS_INDEX_NAME="short-topics"
                export REPORT_BROKEN_LINKS="$reportBrokenLinks"
                export REPORT_SHORT_TOPICS="$reportShortTopics"
            """.trimIndent()

            else -> ""
        }

        return ScriptBuildStep {
            name = "Run the doc crawler in the $operationMode mode"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash
                
                export OPERATION_MODE="$operationMode"
                ${Helpers.setAwsEnvVars(deployEnv)}
                export OKTA_ISSUER="$oktaIssuer"
                export OKTA_SCOPES="$oktaScopes"
                export ELASTICSEARCH_URLS="$elasticsearchUrls"
                export APP_BASE_URL="$appBaseUrl"
                export DOCS_INDEX_NAME="gw-docs"
                
                $additionalScriptContent
                
                doc_crawler
            """.trimIndent()
            dockerImage = GwDockerImages.DOC_CRAWLER_LATEST.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    fun createBuildReactLandingPagesBuildStep(): NodeJSBuildStep {
        return NodeJSBuildStep {
            name = "Build langin pages"
            id = Helpers.createIdStringFromName(this.name)
            shellScript = """
                    yarn
                    CI=true yarn test:landing-pages
                    yarn build
                """.trimIndent()
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        }
    }

    fun createBuildDocPortalServerAppBuildStep(): ScriptBuildStep {
        return ScriptBuildStep {
            name = "Test the doc site server"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                    #!/bin/sh
                    set -e
                    export NODE_ENV="production"
                    export OKTA_CLIENT_ID=mock
                    export OKTA_CLIENT_SECRET=mock
                    export GW_COMMUNITY_PARTNER_IDP="${GwConfigParams.GW_COMMUNITY_PARTNER_IDP.paramValue}"
                    export GW_COMMUNITY_CUSTOMER_IDP="${GwConfigParams.GW_COMMUNITY_CUSTOMER_IDP.paramValue}"
                    export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER.paramValue}"
                    export OKTA_ISSUER_APAC="issuerNotConfigured"
                    export OKTA_ISSUER_EMEA="issuerNotConfigured"
                    export OKTA_SCOPES=mock
                    export OKTA_ADMIN_GROUPS=mock
                    export OKTA_AUDIENCE=mock
                    export POWER_USERS=mock
                    export APP_BASE_URL=http://localhost:8081
                    export SESSION_KEY=mock
                    export DOC_S3_URL="${Helpers.getS3BucketUrl(GwDeployEnvs.STAGING.envName)}"
                    export PORTAL2_S3_URL="${Helpers.getS3BucketUrl(GwDeployEnvs.PORTAL2.envName)}"
                    export ELASTIC_SEARCH_URL="${Helpers.getElasticsearchUrl(GwDeployEnvs.STAGING.envName)}"
                    export DEPLOY_ENV="${GwDeployEnvs.STAGING.envName}"
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
                    yarn build
                    yarn test:server
                """.trimIndent()
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
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
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
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
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
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
            GwStaticFilesModes.S3_SITEMAP.modeName -> {
                sourceDir = "s3_sitemap"
                targetDir = "s3_sitemap"
            }

            GwStaticFilesModes.HTML5.modeName -> targetDir = "html5"
        }
        val deployCommand =
            "aws s3 sync \"$sourceDir\" s3://tenant-doctools-${atmosDeployEnv}-builds/${targetDir} --delete $excludedPatterns".trim()

        return ScriptBuildStep {
            name = "Deploy static files to the S3 bucket $deploymentMode"
            id = Helpers.createIdStringFromName(this.name)
            scriptContent = """
                #!/bin/bash 
                set -xe
                
                $awsEnvVars
                
                $deployCommand
            """.trimIndent()
            dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
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
            dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
        }
    }
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

    object GwCommitStatusPublisherBuildFeature : CommitStatusPublisher({
        publisher = bitbucketServer {
            url = "https://stash.guidewire.com"
            authType = password {
                userName = "%env.BITBUCKET_SERVICE_ACCOUNT_USERNAME%"
                password = "%env.BITBUCKET_ACCESS_TOKEN%"
            }
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
    val DocumentationPortalGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString(Helpers.md5("Documentation Portal git repo")),
        "ssh://git@stash.guidewire.com/doctools/documentation-portal.git",
        "main",
    )

    val DocumentationPortalConfigGitVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString(Helpers.md5("Documentation Portal Config git repo")),
        "ssh://git@stash.guidewire.com/doctools/documentation-portal-config.git",
        "main",
    )

    val DitaOtPluginsVcsRoot = createGitVcsRoot(
        Helpers.resolveRelativeIdFromIdString(Helpers.md5("DITA OT plugins repo")),
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
}

object GwVcsTriggers {
    fun createGitVcsTrigger(
        gitVcsRoot: GitVcsRoot,
        includedTriggerPaths: List<String>? = null,
        excludedTriggerPaths: List<String>? = null,
    ): VcsTrigger {
        val gitVcsTrigger = VcsTrigger {
            triggerRules = ""
        }
        includedTriggerPaths?.forEach {
            gitVcsTrigger.triggerRules += "+:root=${gitVcsRoot.id}:${it}\n"
        }
        excludedTriggerPaths?.forEach {
            gitVcsTrigger.triggerRules += "-:root=${gitVcsRoot.id}:${it}\n"
        }
        return gitVcsTrigger
    }
}

object AuditNpmPackages : BuildType({
    // The --recursive option was removed from the yarn audit:all script in package.json because it causes the "400 bad request" error.
    // It's a bug in yarn and we couldn't find a fix.
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
                    yarn && yarn audit:all
                """.trimIndent()
            dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        }
    }

    features {
        feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
        feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
    }

    triggers {
        trigger(
            GwVcsTriggers.createGitVcsTrigger(
                GwVcsRoots.DocumentationPortalGitVcsRoot,
                listOf(
                    GwTriggerPaths.PACKAGE_JSON.pathValue,
                    GwTriggerPaths.YARN_LOCK.pathValue,
                    GwTriggerPaths.SUBDIRS_PACKAGE_JSON.pathValue
                )
            )
        )
    }
})

object TestEverythingHelpers {
    const val CHANGED_FILES_ENV_VAR_NAME = "env.CHANGED_FILES"

    object ExportListOfChangedFilesIntoAnEnvVarStep : ScriptBuildStep({
        name = "Export list of changed files to $CHANGED_FILES_ENV_VAR_NAME"
        id = Helpers.md5(Helpers.createIdStringFromName(this.name))
        scriptContent = """
            #!/bin/bash
            
            export TEAMCITY_BUILD_CHANGEDFILES_FILE="%system.teamcity.build.changedFiles.file%"
            export TEAMCITY_BUILD_TIGGEREDBY="%teamcity.build.triggeredBy%"
            export ALL_TRIGGER_PATHS=${
            GwTestTriggerPaths.entries.joinToString(",") {
                it.pathValue
            }
        }
            echo TEAMCITY_BUILD_CHANGEDFILES_FILE ${'$'}TEAMCITY_BUILD_CHANGEDFILES_FILE
            echo TEAMCITY_BUILD_TIGGEREDBY ${'$'}TEAMCITY_BUILD_TIGGEREDBY
            echo ALL_TRIGGER_PATHS ${'$'}ALL_TRIGGER_PATHS
            
            node ci/buildConditions/evaluateBuildConditions.mjs "$CHANGED_FILES_ENV_VAR_NAME"
            
            echo "Saved files paths to $CHANGED_FILES_ENV_VAR_NAME with the value ${'$'}CHANGED_FILES"
        """.trimIndent()
        dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        dockerRunParameters = "--user 1000:1000"
    })

    object TestCodeFormat : ScriptBuildStep({
        name = "Run prettier and fail if it makes changes"
        id = Helpers.createIdStringFromName(this.name)

        scriptContent = """
        #!/bin/bash 
        set -e
        
        yarn
        yarn prettier
        
        if [[ -n "${'$'}(git status --porcelain)" ]]; then
            echo "Running Prettier would have updated your code. Run `yarn prettier` locally and commit your changes."
            exit 1
        else
            echo "Test successful! Running Prettier does not change the code."
            exit 0
        fi
    """.trimIndent()
        dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
    })

    object TestSettingsKts : MavenBuildStep({
        name = "Test settings.kts"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name)).toString()
        conditions {
            contains(CHANGED_FILES_ENV_VAR_NAME, GwTestTriggerPaths.TEAMCITY_SETTINGS_KTS.pathValue)
        }

        goals = "teamcity-configs:generate"
        pomLocation = ".teamcity/pom.xml"
        workingDir = ""
        runnerArgs = "-X"
    })

    object TestDoctoolsCore : ScriptBuildStep({
        name = "Test Doctools Core"
        id = Helpers.createIdStringFromName(this.name)
        conditions {
            contains(CHANGED_FILES_ENV_VAR_NAME, GwTestTriggerPaths.CORE.pathValue)
        }
        scriptContent = """
            #!/bin/bash
            set -xe
            
            export EXIT_CODE=0
            
            yarn
            yarn test:core || EXIT_CODE=${'$'}?
            
            exit ${'$'}EXIT_CODE
        """.trimIndent()
        dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        dockerRunParameters = "--user 1000:1000"
    })

    object BuildDoctoolsCore : ScriptBuildStep({
        name = "Build Doctools Core"
        id = Helpers.createIdStringFromName(this.name)
        conditions {
            contains(CHANGED_FILES_ENV_VAR_NAME, GwTestTriggerPaths.CORE.pathValue)
        }
        scriptContent = """
            #!/bin/bash
            set -xe
            
            export EXIT_CODE=0
            
            yarn
            yarn build:core || EXIT_CODE=${'$'}?
            
            exit ${'$'}EXIT_CODE
        """.trimIndent()
        dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
        dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        dockerRunParameters = "--user 1000:1000"
    })

    fun addTriggerConditionToStep(stepWithoutCondition: BuildStep, triggerPath: String): BuildStep {
        return stepWithoutCondition.apply {
            conditions {
                contains(CHANGED_FILES_ENV_VAR_NAME, triggerPath)
            }
        }
    }

    private val kubernetesTestConfigs: List<Pair<String, String>> = listOf(
        Pair(
            GwDeployEnvs.DEV.envName,
            GwTestTriggerPaths.AWS_S3_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.STAGING.envName,
            GwTestTriggerPaths.AWS_S3_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.PROD.envName,
            GwTestTriggerPaths.AWS_S3_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.PORTAL2.envName,
            GwTestTriggerPaths.AWS_S3_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.DEV.envName,
            GwTestTriggerPaths.LANDING_PAGES_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.STAGING.envName,
            GwTestTriggerPaths.LANDING_PAGES_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.PROD.envName,
            GwTestTriggerPaths.LANDING_PAGES_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.DEV.envName,
            GwTestTriggerPaths.SERVER_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.STAGING.envName,
            GwTestTriggerPaths.SERVER_KUBE.pathValue
        ),
        Pair(
            GwDeployEnvs.PROD.envName,
            GwTestTriggerPaths.SERVER_KUBE.pathValue
        )
    )

    val KubernetesTests: List<BuildStep> = kubernetesTestConfigs.map {
        addTriggerConditionToStep(
            GwBuildTypes.createTestKubernetesConfigFilesScriptBuildStep(it.first, it.second),
            it.second
        )
    }
}

private object TestDocPortalEverything : BuildType({
    name = "Test Doc Portal Everything"
    id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

    vcs {
        root(GwVcsRoots.DocumentationPortalGitVcsRoot)
        cleanCheckout = true
    }

    steps {
        step(TestEverythingHelpers.ExportListOfChangedFilesIntoAnEnvVarStep)
        step(TestEverythingHelpers.TestCodeFormat)
        step(TestEverythingHelpers.TestSettingsKts)
        step(TestEverythingHelpers.BuildDoctoolsCore)
        step(TestEverythingHelpers.TestDoctoolsCore)
        step(
            TestEverythingHelpers.addTriggerConditionToStep(
                stepWithoutCondition = GwBuildSteps.createBuildReactLandingPagesBuildStep(),
                triggerPath = GwTestTriggerPaths.LANDING_PAGES.pathValue
            )
        )
        step(
            TestEverythingHelpers.addTriggerConditionToStep(
                stepWithoutCondition = GwBuildSteps.createBuildDocPortalServerAppBuildStep(),
                triggerPath = GwTestTriggerPaths.SERVER.pathValue
            )
        )
        step(
            TestEverythingHelpers.addTriggerConditionToStep(
                stepWithoutCondition = GwBuildSteps.createBuildHtml5DependenciesStep(),
                triggerPath = GwTestTriggerPaths.HTML5.pathValue
            )
        )
        step(
            TestEverythingHelpers.addTriggerConditionToStep(
                stepWithoutCondition = GwBuildSteps.createBuildHtml5OfflineDependenciesStep(),
                triggerPath = GwTestTriggerPaths.HTML5.pathValue
            )
        )
        TestEverythingHelpers.KubernetesTests.map {
            step(it)
        }
    }

    triggers {
        trigger(
            GwVcsTriggers.createGitVcsTrigger(
                GwVcsRoots.DocumentationPortalGitVcsRoot
            )
        )
    }

    features {
        feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
        feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
    }
})

object Content {
    private val testKubernetesConfigFilesDev =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.DEV.envName,
            GwTriggerPaths.AWS_S3_KUBE.pathValue
        )
    private val testKubernetesConfigFilesStaging =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.STAGING.envName,
            GwTriggerPaths.AWS_S3_KUBE.pathValue
        )
    private val testKubernetesConfigFilesProd =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.PROD.envName,
            GwTriggerPaths.AWS_S3_KUBE.pathValue
        )
    private val testKubernetesConfigFilesPortal2 =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.PORTAL2.envName,
            GwTriggerPaths.AWS_S3_KUBE.pathValue
        )
    val rootProject = createRootProjectForContent()

    private fun createRootProjectForContent(): Project {
        return Project {
            name = "Content"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            steps {
                step(GwBuildSteps.createRunSitemapGeneratorStep(deployEnv, outputDir))
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deployEnv, GwStaticFilesModes.SITEMAP.modeName, outputDir
                    )
                )
                step(
                    GwBuildSteps.createDeployStaticFilesStep(
                        deployEnv, GwStaticFilesModes.S3_SITEMAP.modeName, outputDir
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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            steps {
                step(
                    GwBuildSteps.createRunDocCrawlerStep(
                        deployEnv,
                        GwDocCrawlerOperationModes.CLEAN_INDEX.modeValue,
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            // triggers {
            //     schedule {
            //         schedulingPolicy = daily {
            //             hour = 1
            //             minute = 1
            //         }
            //         triggerBuild = always()
            //         withPendingChangesOnly = false
            //     }
            // }
        }
    }

    private fun createUpdateSearchIndexProject(): Project {
        return Project {
            name = "Update search index"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            arrayOf(
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD
            ).forEach {
                buildType(createUpdateSearchIndexBuildType(it.envName))
            }
        }
    }

    private fun createUpdateSearchIndexBuildType(deployEnv: String): BuildType {
        return BuildType {
            name = "Update search index on $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            artifactRules = """
                    %teamcity.build.workingDir%/*.log => build_logs
                """.trimIndent()

            params {
                select(
                    "PROPERTY_NAME",
                    "DOC_IDS",
                    label = "Property name",
                    description = """
                            Choose the property that you want to use to limit the number of documents to index:
                            - Doc IDs - only documents with specific IDs are indexed
                            - Releases - only cloud documents that have at least one release from the property value field are indexed
                            - Versions - only self-managed documents that have at least one version from the property value field are indexed
                            - None - all documents are indexed. Think twice before selecting this option!
                        """.trimIndent(),
                    options = listOf(
                        "Doc IDs" to "DOC_IDS",
                        "Releases" to "RELEASES",
                        "Versions" to "VERSIONS",
                        "None (all docs)" to "NONE",
                    ),
                    display = ParameterDisplay.PROMPT,
                )
                text(
                    "PROPERTY_VALUE",
                    "",
                    label = "Property value",
                    description = "A comma-separated list of values. This field is ignored if you index all documents. Example for releases: Hakuba,Innsbruck",
                    display = ParameterDisplay.PROMPT,
                    allowEmpty = true
                )
            }

            steps {
                step(
                    GwBuildSteps.createRunDocCrawlerStep(
                        deployEnv,
                        GwDocCrawlerOperationModes.CRAWL.modeValue,
                        propertyName = "%PROPERTY_NAME%",
                        propertyValue = "%PROPERTY_VALUE%"
                    )
                )
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
        }
    }

    private fun createDeployContentStorageProject(): Project {
        return Project {
            name = "Deploy content storage"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            arrayOf(
                GwDeployEnvs.DEV, GwDeployEnvs.STAGING, GwDeployEnvs.PROD, GwDeployEnvs.PORTAL2
            ).forEach {
                buildType(createDeployContentStorageBuildType(it.envName))
            }
            buildType(testKubernetesConfigFilesDev)
            buildType(testKubernetesConfigFilesStaging)
            buildType(testKubernetesConfigFilesProd)
            buildType(testKubernetesConfigFilesPortal2)
        }
    }

    private fun createDeployContentStorageBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val contentStorageDeployEnvVars = Helpers.setContentStorageDeployEnvVars(deployEnv)
        val deployContentStorageBuildType = BuildType {
            name = "Deploy content storage to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
            maxRunningBuilds = 1

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
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
                }
            }

            features {
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            }
        }
        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                deployContentStorageBuildType.dependencies.snapshot(testKubernetesConfigFilesDev) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
                deployContentStorageBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(GwTriggerPaths.AWS_S3_KUBE.pathValue)
                    )
                )
            }

            GwDeployEnvs.STAGING.envName -> {
                deployContentStorageBuildType.dependencies.snapshot(testKubernetesConfigFilesStaging) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            GwDeployEnvs.PROD.envName -> {
                deployContentStorageBuildType.dependencies.snapshot(testKubernetesConfigFilesProd) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }

            GwDeployEnvs.PORTAL2.envName -> {
                deployContentStorageBuildType.dependencies.snapshot(testKubernetesConfigFilesPortal2) {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                }
            }
        }

        return deployContentStorageBuildType
    }


    object UploadPdfsForEscrowBuildType : BuildType({
        name = "Upload PDFs for Escrow"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
                    
                    cd %teamcity.build.checkoutDir%/ci/downloadPdfsForEscrow
                    ./installZipTool.sh && ./downloadPdfsForEscrow.sh
                """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
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
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
            }
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

    object SyncDocsFromStagingToDev : BuildType({
        name = "Sync docs from staging to dev"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        steps {
            step(GwBuildSteps.createSyncDataFromStagingS3BucketToDevS3BucketStep())
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

    object SyncElasticsearchIndexFromStagingToDev : BuildType({
        name = "Sync the Elasticsearch index from staging to dev"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
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
                dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
            }
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)
    })

}

object Database {
    // Test builds for config files are configured in settings.kts in the documentation-portal-config repo.
    // If you change the build IDs here, you also have to update them in the test builds.
    private const val ABSOLUTE_ID_PREFIX = "DocumentationTools_DocPortal_"
    private val testConfigDocsBuildType =
        AbsoluteId(ABSOLUTE_ID_PREFIX + Helpers.md5("Test ${GwConfigTypes.DOCS.typeName} config files"))
    private val testConfigSourcesBuildType =
        AbsoluteId(ABSOLUTE_ID_PREFIX + Helpers.md5("Test ${GwConfigTypes.SOURCES.typeName} config files"))
    private val testConfigBuildsBuildType =
        AbsoluteId(ABSOLUTE_ID_PREFIX + Helpers.md5("Test ${GwConfigTypes.BUILDS.typeName} config files"))
    private val validateDbDeploymentBuildTypeDev = createValidateDbDeploymentBuildType(GwDeployEnvs.DEV.envName)
    private val validateDbDeploymentBuildTypeStaging =
        createValidateDbDeploymentBuildType(GwDeployEnvs.STAGING.envName)
    private val validateDbDeploymentBuildTypeProd = createValidateDbDeploymentBuildType(GwDeployEnvs.PROD.envName)
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
            buildType(UploadLegacyConfigsToDbBuildType)
            buildType(DumpDbDataFromStaging)
            listOf(GwDeployEnvs.DEV, GwDeployEnvs.PROD).forEach {
                buildType(createRestoreDbDataBuildType(it.envName))
            }
            buildType(validateDbDeploymentBuildTypeDev)
            buildType(validateDbDeploymentBuildTypeStaging)
            buildType(validateDbDeploymentBuildTypeProd)
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
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_4_3_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"

                }
            }

            features {
                feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
                feature(GwBuildFeatures.GwDockerSupportBuildFeature)
                feature(GwBuildFeatures.GwSshAgentBuildFeature)
                feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
            }
        }

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                validateDbDeploymentBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(
                            GwTriggerPaths.DB.pathValue
                        )
                    )
                )
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
            maxRunningBuilds = 1

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
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
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_4_3_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
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
                deployDatabaseBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(
                            GwTriggerPaths.DB.pathValue
                        )
                    )
                )
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

    private object DumpDbDataFromStaging : BuildType({
        val atmosDeployEnv = Helpers.getAtmosDeployEnv(GwDeployEnvs.STAGING.envName)
        val awsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)
        name = "Dump database data from staging"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
        maxRunningBuilds = 1

        artifactRules = GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue

        // The VCS Root isn't used in build steps but it's linked here to support revision synchronization
        // in snapshot dependencies.
        vcs {
            root(GwVcsRoots.DocumentationPortalConfigGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            script {
                name = "Create a database dump"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                    #!/bin/bash 
                    set -eu
                                                    
                    # Set env variables
                    ${Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)}
                    export AWS_SECRET=${'$'}(aws secretsmanager get-secret-value --secret-id tenant-doctools-docportal)
                    export CONFIG_DB_NAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_name' <<< "${'$'}AWS_SECRET")
                    export CONFIG_DB_USERNAME=${'$'}(jq -r '.SecretString | fromjson | .config_db_username' <<< "${'$'}AWS_SECRET")
                    export CONFIG_DB_PASSWORD=${'$'}(jq -r '.SecretString | fromjson | .config_db_password' <<< "${'$'}AWS_SECRET")
                    export CONFIG_DB_HOST=${GwConfigParams.CONFIG_DB_HOST_STAGING.paramValue}
                    
                    
                    EXIT_CODE=0
                    aws eks update-kubeconfig --name atmos-${Helpers.getAtmosDeployEnv(GwDeployEnvs.STAGING.envName)} && kubectl config set-context --current --namespace=${GwAtmosLabels.POD_NAME.labelValue} && kubectl run ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} --image=${GwConfigParams.DB_CLIENT_IMAGE_NAME.paramValue} --env="PGPASSWORD=${'$'}CONFIG_DB_PASSWORD" --env="PGUSER=${'$'}CONFIG_DB_USERNAME" --env="PGHOST=${'$'}CONFIG_DB_HOST" --env="PGDATABASE=${'$'}CONFIG_DB_NAME" --command -- /bin/sleep "infinite" || EXIT_CODE=${'$'}?
                    
                    if [ "${'$'}EXIT_CODE" -eq 0 ]; then
                        SECONDS=0
                        while [ ${'$'}SECONDS -le 30 ]; do
                          status=${'$'}(kubectl get pods ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} -o jsonpath='{.status.phase}')
                          if [ "${'$'}status" == "Running" ]; then
                            kubectl exec ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} -- sh -c "apk update && apk add --no-cache ${GwConfigParams.DB_CLIENT_PACKAGE_NAME.paramValue} zip && pg_dump -Fd ${'$'}CONFIG_DB_NAME -j 5 -f ${'$'}CONFIG_DB_NAME && zip -r ${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} ${'$'}CONFIG_DB_NAME" && kubectl cp ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue}:/${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} ./${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} || EXIT_CODE=${'$'}?
                            break
                          else
                            echo "Waiting for the ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} pod to be ready"
                            sleep 5
                          fi
                        done
                    fi
                    
                    kubectl get pods | grep ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} && kubectl delete pod ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} || EXIT_CODE=${'$'}?
                   
                    exit ${'$'}EXIT_CODE
                """.trimIndent()
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
            }
            script {
                name = "Upload database dump to the S3 bucket"
                id = Helpers.createIdStringFromName(this.name)
                scriptContent = """
                #!/bin/bash
                set -xe
                
                $awsEnvVars
                
                aws s3 cp "${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue}" s3://tenant-doctools-${atmosDeployEnv}-builds/zip/
            """.trimIndent()
                dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
            }
        }

        features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

        dependencies {
            snapshot(UploadLegacyConfigsToDbBuildType) {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    })

    private fun createRestoreDbDataBuildType(deployEnv: String): BuildType {
        val dbRestoreAwsEnvVars: String
        val dbRestoreAtmosDeployEnv: String
        val dbRestoreConfigDbHost: String
        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                dbRestoreAwsEnvVars = Helpers.setAwsEnvVars(GwDeployEnvs.DEV.envName)
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
            name = "Restore database data on $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
            maxRunningBuilds = 1

            vcs {
                root(GwVcsRoots.DocumentationPortalConfigGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                script {
                    name = "Restore the db dump from staging on $deployEnv"
                    id = Helpers.createIdStringFromName(this.name)
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
                        aws eks update-kubeconfig --name atmos-$dbRestoreAtmosDeployEnv && kubectl config set-context --current --namespace=${GwAtmosLabels.POD_NAME.labelValue} && kubectl run ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} --image=${GwConfigParams.DB_CLIENT_IMAGE_NAME.paramValue} --env="PGPASSWORD=${'$'}CONFIG_DB_PASSWORD" --env="PGUSER=${'$'}CONFIG_DB_USERNAME" --env="PGHOST=${'$'}CONFIG_DB_HOST" --env="PGDATABASE=${'$'}CONFIG_DB_NAME" --command -- /bin/sleep "infinite" || EXIT_CODE=${'$'}?
                        
                        if [ "${'$'}EXIT_CODE" -eq 0 ]; then
                            SECONDS=0
                            while [ ${'$'}SECONDS -le 30 ]; do
                              status=${'$'}(kubectl get pods ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} -o jsonpath='{.status.phase}')
                              if [ "${'$'}status" == "Running" ]; then
                                kubectl cp ./${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue}:/${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} && kubectl exec ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} -- sh -c "apk update && apk add --no-cache ${GwConfigParams.DB_CLIENT_PACKAGE_NAME.paramValue} zip && unzip ./${GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue} && pg_restore --clean --if-exists -d ${'$'}CONFIG_DB_NAME ${'$'}CONFIG_DB_NAME" || EXIT_CODE=${'$'}?
                                break
                              else
                                echo "Waiting for the ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} pod to be ready"
                                sleep 5
                              fi
                            done
                        fi
                        
                        kubectl get pods | grep ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} && kubectl delete pod ${GwConfigParams.DB_CLIENT_POD_NAME.paramValue} || EXIT_CODE=${'$'}?
                       
                        exit ${'$'}EXIT_CODE
                    """.trimIndent()
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
                }
            }

            features.feature(GwBuildFeatures.GwDockerSupportBuildFeature)

            dependencies {
                dependency(DumpDbDataFromStaging) {
                    snapshot {
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }

                    artifacts {
                        cleanDestination = true
                        artifactRules = GwConfigParams.DB_DUMP_ZIP_PACKAGE_NAME.paramValue
                    }
                }
            }
        }

        /*
        In TeamCity 2022.04.5, there's no easy way to create a sequence of builds to run.
        In a composite build, you can only define snapshot dependencies, but you cannot control the order of triggering them.
        We want to load data to the database after the entire doc portal is deployed successfully.
        But we don't want to trigger the deployment of the entire doc portal every time we run a build for loading
        data. Therefore, we use the following solution:
         - A composite build that has snapshot dependencies on builds that deploy the database, server, and React landing
         pages. All these builds can run in parallel so we don't need to control the order.
         - A Finish Build Trigger without a snapshot dependency in the build for uploading legacy configs
         to staging the database and in the builds for syncing data from the staging database to dev and prod.

         The disadvantage of this solution is that you cannot see the progress of running the entire chain in one place.
         When the composite build is complete, the build with the Finish Build Trigger starts and it isn't linked
         in any way to the composite build.
         */

        when (deployEnv) {
            GwDeployEnvs.DEV.envName -> {
                syncDbDataBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalConfigGitVcsRoot,
                        listOf(GwTriggerPaths.TEAMCITY_CONFIG.pathValue)
                    )
                )
                syncDbDataBuildType.triggers.finishBuildTrigger {
                    buildType = DocPortal.deployDocPortalDev.id.toString()
                    successfulOnly = true
                }
            }

            GwDeployEnvs.PROD.envName -> {
                syncDbDataBuildType.triggers.finishBuildTrigger {
                    buildType = DocPortal.deployDocPortalProd.id.toString()
                    successfulOnly = true
                }
            }
        }

        return syncDbDataBuildType
    }

    // Legacy configs are uploaded only to the db on staging. Dev db and prod db sync data from staging.
    object UploadLegacyConfigsToDbBuildType : BuildType({
        name = "Upload legacy configs to ${GwDeployEnvs.STAGING.envName} database"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
        maxRunningBuilds = 1

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            root(
                GwVcsRoots.DocumentationPortalConfigGitVcsRoot,
                "+:.=> ${GwConfigParams.DOCUMENTATION_PORTAL_CONFIG_CHECKOUT_DIR.paramValue}"
            )
            cleanCheckout = true
        }

        artifactRules = "ci/uploadLegacyConfigsToDb/response*.json => /"
        steps {
            step(GwBuildSteps.MergeAllLegacyConfigsStep)
            step(GwBuildSteps.createUploadLegacyConfigsToS3BucketStep(GwDeployEnvs.STAGING.envName))
            nodeJS {
                name = "Call doc portal endpoints to trigger upload"
                id = Helpers.createIdStringFromName(this.name)
                shellScript = """
                        #!/bin/sh
                        set -e
                        
                        ${Helpers.setAwsEnvVars(GwDeployEnvs.STAGING.envName)}
                        export APP_BASE_URL="${Helpers.getTargetUrl(GwDeployEnvs.STAGING.envName)}"
                        export OKTA_ISSUER="${GwConfigParams.OKTA_ISSUER.paramValue}"
                        export OKTA_SCOPES="${GwConfigParams.OKTA_SCOPES.paramValue}"
                        
                        cd ci/uploadLegacyConfigsToDb
                        yarn
                        node uploadLegacyConfigsToDb.mjs
                        """.trimIndent()
                dockerImage = GwDockerImages.NODE_18_18_2.imageUrl
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

        /*
        In TeamCity 2022.04.5, there's no easy way to create a sequence of builds to run.
        In a composite build, you can only define snapshot dependencies, but you cannot control the order of triggering them.
        We want to load data to the database after the entire doc portal is deployed successfully.
        But we don't want to trigger the deployment of the entire doc portal every time we run a build for loading
        data. Therefore, we use the following solution:
         - A composite build that has snapshot dependencies on builds that deploy the database, server, and React landing
         pages. All these builds can run in parallel so we don't need to control the order.
         - A Finish Build Trigger without a snapshot dependency in the build for uploading legacy configs
         to staging the database and in the builds for syncing data from the staging database to dev and prod.

         The disadvantage of this solution is that you cannot see the progress of running the entire chain in one place.
         When the composite build is complete, the build with the Finish Build Trigger starts and it isn't linked
         in any way to the composite build.
         */
        triggers {
            finishBuildTrigger {
                buildType = DocPortal.deployDocPortalStaging.id.toString()
                successfulOnly = true
            }
        }
    })
}

object DocPortal {
    val deployDocPortalDev = createDeployDocPortalBuildType(GwDeployEnvs.DEV.envName)
    val deployDocPortalStaging = createDeployDocPortalBuildType(GwDeployEnvs.STAGING.envName)
    val deployDocPortalProd = createDeployDocPortalBuildType(GwDeployEnvs.PROD.envName)

    val rootProject = createRootProjectForDocPortal()

    private fun createRootProjectForDocPortal(): Project {
        return Project {
            name = "Doc Portal"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            buildType(deployDocPortalDev)
            buildType(deployDocPortalStaging)
            buildType(deployDocPortalProd)
        }
    }

    private fun createDeployDocPortalBuildType(deployEnv: String): BuildType {
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
            maxRunningBuilds = 1

            dependencies {
                snapshotDependencies.forEach {
                    snapshot(it) {
                        onDependencyFailure = FailureAction.FAIL_TO_START
                    }
                }
            }
        }
    }
}

object Frontend {
    private val testKubernetesConfigFilesDev =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.DEV.envName,
            GwTriggerPaths.LANDING_PAGES_KUBE.pathValue
        )
    private val testKubernetesConfigFilesStaging =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.STAGING.envName,
            GwTriggerPaths.LANDING_PAGES_KUBE.pathValue
        )
    private val testKubernetesConfigFilesProd =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.PROD.envName,
            GwTriggerPaths.LANDING_PAGES_KUBE.pathValue
        )
    private val runCheckmarxScan =
        GwBuildTypes.createRunCheckmarxScanBuildType(GwConfigParams.DOC_PORTAL_FRONTEND_DIR.paramValue)
    private val buildAndPublishDockerImageToDevEcrBuildType =
        GwBuildTypes.createBuildAndPublishDockerImageToDevEcrBuildType(
            GwDockerImageTags.DOC_PORTAL_FRONTEND.tagValue,
            GwDockerImages.DOC_PORTAL_FRONTEND.imageUrl,
            "Dockerfile",
            listOf(runCheckmarxScan, TestReactLandingPagesBuildType)
        )
    private val publishDockerImageToProdEcrBuildType = GwBuildTypes.createPublishDockerImageToProdEcrBuildType(
        GwDockerImageTags.DOC_PORTAL_FRONTEND.tagValue,
        GwDockerImages.DOC_PORTAL_FRONTEND.imageUrl,
        GwDockerImages.DOC_PORTAL_FRONTEND_PROD.imageUrl,
        listOf(buildAndPublishDockerImageToDevEcrBuildType)
    )
    val deployReactLandingPagesBuildTypeDev = createDeployReactLandingPagesBuildType(GwDeployEnvs.DEV.envName)
    val deployReactLandingPagesBuildTypeStaging =
        createDeployReactLandingPagesBuildType(GwDeployEnvs.STAGING.envName)
    val deployReactLandingPagesBuildTypeProd = createDeployReactLandingPagesBuildType(GwDeployEnvs.PROD.envName)
    val rootProject = createRootProjectForFrontend()

    private fun createRootProjectForFrontend(): Project {
        return Project {
            name = "Frontend"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            subProject(createReactLandingPagesProject())
            subProject(createNpmPackagesProject())
            subProject(createHtml5DependenciesProject())
        }
    }

    private fun createNpmPackagesProject(): Project {
        return Project {
            name = "NPM packages"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            arrayOf(
                Pair("theme", "docusaurus/themes/gw-theme-classic"),
                Pair("plugin-redoc", "docusaurus/plugins/gw-plugin-redoc"),
                Pair("docusaurus-security", "docusaurus/plugins/docusaurus-security")
            ).forEach {
                buildType(createPublishNpmPackageBuildType(it.first, it.second))
            }
        }
    }


    private fun createHtml5DependenciesProject(): Project {
        return Project {
            name = "HTML5 dependencies"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

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
            maxRunningBuilds = 1

            vcs {
                root(
                    GwVcsRoots.DocumentationPortalGitVcsRoot,
                )
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
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
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
                deployReactLandingPagesBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(
                            GwTriggerPaths.LANDING_PAGES.pathValue,
                            GwTriggerPaths.SCRIPTS_SRC_PAGES_GET_ROOT_BREADCRUMBS.pathValue,
                            GwTriggerPaths.SERVER_SRC_MODEL_ENTITY.pathValue,
                            GwTriggerPaths.SERVER_SRC_TYPES.pathValue
                        )
                    )
                )
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
            root(
                GwVcsRoots.DocumentationPortalGitVcsRoot
            )
            cleanCheckout = true
        }

        steps {
            GwBuildSteps.createBuildReactLandingPagesBuildStep()
        }

        features {
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
        }

        triggers {
            trigger(
                GwVcsTriggers.createGitVcsTrigger(
                    GwVcsRoots.DocumentationPortalGitVcsRoot,
                    listOf(
                        GwTriggerPaths.LANDING_PAGES.pathValue,
                        GwTriggerPaths.SHIMS.pathValue,
                        GwTriggerPaths.SCRIPTS_SRC_PAGES_GET_ROOT_BREADCRUMBS.pathValue,
                        GwTriggerPaths.SERVER_SRC_MODEL_ENTITY.pathValue,
                        GwTriggerPaths.SERVER_SRC_TYPES.pathValue
                    ),
                    listOf(
                        GwTriggerPaths.LANDING_PAGES_KUBE.pathValue,
                    )
                )
            )
        }
    })

    private fun createPublishNpmPackageBuildType(packageHandle: String, packagePath: String): BuildType {
        return BuildType {
            name = "Publish $packageHandle to Artifactory"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.createPublishNpmPackageStep(packageHandle))
            }

            // Supposedly, the build is triggered only on changes in package.json to publish a new package
            // only when its version changes, not on every change in the code.
            triggers {
                trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf("${packagePath}/package.json")
                    )
                )
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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
            maxRunningBuilds = 1

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
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
                trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(GwTriggerPaths.HTML5.pathValue)
                    )
                )
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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            vcs {
                root(GwVcsRoots.DocumentationPortalGitVcsRoot)
                root(GwVcsRoots.DitaOtPluginsVcsRoot, "+:.=>$ditaOutPluginsCheckoutDir")
                cleanCheckout = true
            }

            steps {
                step(GwBuildSteps.createBuildHtml5OfflineDependenciesStep())
                step(GwBuildSteps.createDeployHtml5OfflineDependenciesStep("%teamcity.build.checkoutDir%/$ditaOutPluginsCheckoutDir"))
            }

            triggers {
                trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(GwTriggerPaths.HTML5.pathValue)
                    )
                )
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
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.DEV.envName,
            GwTriggerPaths.SERVER_KUBE.pathValue
        )
    private val testKubernetesConfigFilesStaging =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.STAGING.envName,
            GwTriggerPaths.SERVER_KUBE.pathValue
        )
    private val testKubernetesConfigFilesProd =
        GwBuildTypes.createTestKubernetesConfigFilesBuildType(
            GwDeployEnvs.PROD.envName,
            GwTriggerPaths.SERVER_KUBE.pathValue
        )
    private val runCheckmarxScan =
        GwBuildTypes.createRunCheckmarxScanBuildType(GwConfigParams.DOC_PORTAL_DIR.paramValue)
    private val buildAndPublishDockerImageToDevEcrBuildType =
        GwBuildTypes.createBuildAndPublishDockerImageToDevEcrBuildType(
            GwDockerImageTags.DOC_PORTAL.tagValue,
            GwDockerImages.DOC_PORTAL.imageUrl,
            "Dockerfile.server",
            listOf(runCheckmarxScan, TestDocSiteServerApp)
        )
    private val publishDockerImageToProdEcrBuildType = GwBuildTypes.createPublishDockerImageToProdEcrBuildType(
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
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

            buildType(deployServerBuildTypeDev)
            buildType(deployServerBuildTypeStaging)
            buildType(deployServerBuildTypeProd)
            buildType(runCheckmarxScan)
            buildType(testKubernetesConfigFilesDev)
            buildType(testKubernetesConfigFilesStaging)
            buildType(testKubernetesConfigFilesProd)
            buildType(buildAndPublishDockerImageToDevEcrBuildType)
            buildType(publishDockerImageToProdEcrBuildType)
        }
    }

    private object TestDocSiteServerApp : BuildType({
        name = "Test doc site server app"
        id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))

        vcs {
            root(GwVcsRoots.DocumentationPortalGitVcsRoot)
            cleanCheckout = true
        }

        steps {
            step(GwBuildSteps.createBuildDocPortalServerAppBuildStep())
        }

        features {
            feature(GwBuildFeatures.GwCommitStatusPublisherBuildFeature)
            feature(GwBuildFeatures.GwDockerSupportBuildFeature)
            feature(GwBuildFeatures.createGwPullRequestsBuildFeature(GwVcsRoots.DocumentationPortalGitVcsRoot.branch.toString()))
        }

        triggers {
            trigger(
                GwVcsTriggers.createGitVcsTrigger(
                    GwVcsRoots.DocumentationPortalGitVcsRoot,
                    listOf(GwTriggerPaths.SERVER.pathValue),
                    listOf(GwTriggerPaths.SERVER_KUBE.pathValue)
                )
            )
        }
    })

    private fun createDeployServerBuildType(deployEnv: String): BuildType {
        val awsEnvVars = Helpers.setAwsEnvVars(deployEnv)
        val gatewayConfigFile = Helpers.getServerGatewayConfigFile(deployEnv)

        val atmosDeployEnv = Helpers.getAtmosDeployEnv(deployEnv)
        val serverDeployEnvVars = Helpers.setServerDeployEnvVars(deployEnv, GwDockerImageTags.DOC_PORTAL.tagValue)
        val deployServerBuildType = BuildType {
            name = "Deploy server to $deployEnv"
            id = Helpers.resolveRelativeIdFromIdString(Helpers.md5(this.name))
            maxRunningBuilds = 1

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
                        
                        echo ${'$'}(kubectl get pods --namespace=${GwAtmosLabels.POD_NAME.labelValue})
                        
                        eval "echo \"${'$'}(cat ${GwConfigParams.DOC_PORTAL_KUBE_DEPLOYMENT_FILE.paramValue})\"" > ${'$'}TMP_DEPLOYMENT_FILE
                        eval "echo \"${'$'}(cat ${gatewayConfigFile})\"" > ${'$'}TMP_GATEWAY_CONFIG_FILE
                                                
                        sed -ie "s/BUILD_TIME/${'$'}(date)/g" ${'$'}TMP_DEPLOYMENT_FILE
                        kubectl apply -f ${'$'}TMP_DEPLOYMENT_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}
                        kubectl apply -f ${'$'}TMP_GATEWAY_CONFIG_FILE --namespace=${GwAtmosLabels.POD_NAME.labelValue}                    
                    """.trimIndent()
                    dockerImage = GwDockerImages.ATMOS_DEPLOY_2_6_0.imageUrl
                    dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
                    dockerRunParameters = "-v /var/run/docker.sock:/var/run/docker.sock -v ${'$'}(pwd):/app:ro"
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
                deployServerBuildType.triggers.trigger(
                    GwVcsTriggers.createGitVcsTrigger(
                        GwVcsRoots.DocumentationPortalGitVcsRoot,
                        listOf(GwTriggerPaths.SERVER.pathValue)
                    )
                )
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


param ($envName = 'dev', $allowErrors = 'yes', $docPortalHome = 'C:\_git-repos\documentation-portal')
$env:DEPLOY_ENV = $envName
$env:PAGES_DIR = $docPortalHome + '\frontend\pages'
$env:TEMPLATES_DIR = $docPortalHome + '\frontend\templates'
$env:OUTPUT_DIR = $docPortalHome + '\server\public'
$env:DOCS_CONFIG_FILE = $docPortalHome + '\.teamcity\config\docs\docs.json'
$env:SEND_BOUNCER_HOME = $allowErrors
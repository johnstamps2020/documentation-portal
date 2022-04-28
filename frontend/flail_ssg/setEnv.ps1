param ($envName = 'int', $allowErrors = 'yes', $docPortalHome = 'C:\_git-repos\documentation-portal')
$env:DEPLOY_ENV = $envName
$env:PAGES_DIR = $docPortalHome + '\frontend\pages'
$env:OUTPUT_DIR = $docPortalHome + '\server\static\pages'
$env:OUTPUT_FORMAT = 'json'
$env:DOCS_CONFIG_FILE = $docPortalHome + '\apps\config_deployer\out\merge-all.json'
$env:SEND_BOUNCER_HOME = $allowErrors
$env:PYTHONPATH = $docPortalHome
$env:PAGE_SCHEMA_FILE = $docPortalHome + '\frontend\page-schema.json'
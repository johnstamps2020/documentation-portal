locals {
  app_name = "docportal"
  aurora_db_name = "tenant-doctools-docportal-${var.deploy_env}"
  database_name = jsondecode(data.aws_secretsmanager_secret_version.database_name.secret_string)["config_db_name"]
  database_username = jsondecode(data.aws_secretsmanager_secret_version.database_username.secret_string)["config_db_username"]
  database_password = jsondecode(data.aws_secretsmanager_secret_version.database_password.secret_string)["config_db_password"]
  atmos_cluster_name = "atmos-${var.deploy_env}"
  aws_secret_name = "tenant-doctools-docportal"
}

provider "aws" {
  alias = "primary"
  region = var.region
}

data "aws_secretsmanager_secret" "config_db_name" {
  name = local.aws_secret_name
}

data "aws_secretsmanager_secret_version" "database_name" {
  secret_id = data.aws_secretsmanager_secret.config_db_name.id
}


data "aws_secretsmanager_secret" "config_db_username" {
  name = local.aws_secret_name
}

data "aws_secretsmanager_secret_version" "database_username" {
  secret_id = data.aws_secretsmanager_secret.config_db_username.id
}

data "aws_secretsmanager_secret" "config_db_password" {
  name = local.aws_secret_name
}

data "aws_secretsmanager_secret_version" "database_password" {
  secret_id = data.aws_secretsmanager_secret.config_db_password.id
}

module "aurora_db" {
  source = "git::ssh://git@stash.guidewire.com/ccs/atmos-tfmodule-aurora.git?ref=v8.2.2"

  name = local.aurora_db_name
  atmos_cluster_name = local.atmos_cluster_name
  region = var.region
  star_system_name = var.star_system_name
  quadrant_name = var.quadrant_name
  app_name = local.app_name

  database_name = local.database_name
  username = local.database_username
  password = local.database_password

  replica_count = 1
  instance_type = "db.r6g.large"

  enable_datadog_subscription_filter = false
  skip_final_snapshot = true
  engine_version = "13.12"
  auto_minor_version_upgrade = true
  allow_major_version_upgrade = true
  apply_immediately = true
  deletion_protection = true

  tenant_name = var.pod_name
  department_code = var.dept_code
  created_by = var.pod_name
  environment_level = var.env_level
  gw_product = "Multi-tenantMicroservice"
  customer_code = "Multi-tenantMicroservice"
  tags = {
    "gwcp:v1:resource-type:provisioning-source": "https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal/browse/server/db/main.tf"
    "gwcp:v1:resource-type:managed-tool": "terraform",
    "gwcp:v1:cloud-ecosystem": "gwcp",
    "dba:v1:comment:NMV": "Database for storing configuration of the doc portal",
  }
}

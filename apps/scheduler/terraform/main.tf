locals {
    root = "${path.root}/../../.."
    deploy_folder = "${local.root}/common/deploy"
}

provider "aws" {
    region = "ap-southeast-2"
}
module "cloudwatch" {
    source = "../../../infra/terraform/shared/cloudwatch"
    rule_name = "vdtn359-news-scheduler-cleanup-trigger"
    lambda_function_arn = module.lambda.function_arn
    schedule_expression = "rate(2 hours)"
}

module "lambda" {
    source = "git::https://github.com/tuan231195/terraform-modules.git//modules/aws-lambda?ref=master"
    handler = "index.handler"
    source_path = "${local.deploy_folder}/apps/scheduler/dist"
    runtime = var.runtimes
    layer_config = {
        compatible_runtimes = [var.runtimes]
        source_dir   = local.deploy_folder
        source_type  = "nodejs"
    }
    function_name = "vdtn359-news-scheduler"
    timeout = 900
    memory_size = 1024
    tags = {
        hash = var.build_hash
        version = jsondecode(file("${path.module}/../package.json")).version
    }
    environment = {
        variables = {
            NODE_ENV = "production"
            NODE_CONFIG_ENV = "production"
            ES_USERNAME = "vdtn359"
            ES_PASSWORD = data.secrethub_secret.es_password.value
            FIREBASE_PRIVATE_KEY = data.secrethub_secret.firebase_private_key.value
            LOGZ_TOKEN = data.secrethub_secret.logz_token.value
            REDIS_PASSWORD = data.secrethub_secret.redis_password.value
            NODE_PATH = "/opt/nodejs/node_modules:/var/runtime/node_modules:/var/runtime:/var/task:/opt/nodejs/apps/scheduler/node_modules"
        }
    }
}

module "alarm" {
    source = "../../../infra/terraform/shared/alarm"
    function_name = module.lambda.function_name
}

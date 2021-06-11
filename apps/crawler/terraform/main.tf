provider "aws" {
    region = "ap-southeast-2"
}
module "cloudwatch" {
    source = "../../../infra/terraform/shared/cloudwatch"
    rule_name = "vdtn359-news-crawler-trigger"
    lambda_function_arn = module.lambda.function_arn
    schedule_expression = "cron(0/20 20-15 ? * * *)"
}

resource "aws_lambda_layer_version" "lambda_layer" {
    filename    = "${path.module}/../produles/nodejs.zip"
    source_code_hash = filebase64sha256("${path.module}/../produles/nodejs.zip")
    layer_name  = "vdtn359-news-crawler-lambda-layer"

    compatible_runtimes = [var.runtimes]
}

module "lambda" {
    source = "github.com/claranet/terraform-aws-lambda"
    function_name = "vdtn359-news-crawler"
    handler = "index.handler"
    runtime = var.runtimes
    timeout = 900
    memory_size = 1024
    layers = [aws_lambda_layer_version.lambda_layer.arn]
    source_path = "${path.module}/../dist"
    tags = {
        version = jsondecode(file("${path.module}/../package.json")).version
    }
    environment = {
        variables = {
            NODE_ENV = "production"
            NODE_CONFIG_ENV = "production"
            SENTRY_REPORTING_DSN = data.secrethub_secret.sentry_dsn.value
            FIREBASE_PRIVATE_KEY = data.secrethub_secret.firebase_private_key.value
            LOGZ_TOKEN = data.secrethub_secret.logz_token.value
            REDIS_PASSWORD = data.secrethub_secret.redis_password.value
        }
    }
}

module "alarm" {
    source = "../../../infra/terraform/shared/alarm"
    function_name = module.lambda.function_name
}

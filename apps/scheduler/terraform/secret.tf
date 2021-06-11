locals {
  secrethub_dir = "vdtn359/start/vdtn359-news"
}

provider "secrethub" {
}

data "secrethub_secret" "sentry_dsn" {
  path = "${local.secrethub_dir}/sentry"
}

data "secrethub_secret" "firebase_private_key" {
  path = "${local.secrethub_dir}/firebase"
}

data "secrethub_secret" "logz_token" {
  path = "${local.secrethub_dir}/logz-token"
}

data "secrethub_secret" "redis_password" {
  path = "${local.secrethub_dir}/redis"
}

data "secrethub_secret" "es_password" {
  path = "${local.secrethub_dir}/es-password"
}

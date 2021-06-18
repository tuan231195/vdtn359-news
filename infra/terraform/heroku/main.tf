provider "heroku" {
  version = "~> 2.0"
  api_key = data.secrethub_secret.heroku_token.value
}

resource "heroku_app" "web_app" {
  name   = "vdtn359-news"
  region = "us"
  stack = "container"
  config_vars = {
    FIREBASE_PRIVATE_KEY=data.secrethub_secret.firebase_private_key.value
    SENTRY_REPORTING_DSN=data.secrethub_secret.sentry_dsn.value
    ES_USERNAME=var.es_username
    ES_PASSWORD=data.secrethub_secret.es_password.value
    REDIS_PASSWORD=data.secrethub_secret.redis_password.value
    LOGZ_TOKEN=data.secrethub_secret.logz_token.value
  }
}

resource "heroku_formation" "news-web" {
  app = heroku_app.web_app.name
  type = "web"
  quantity = 1
  size = "free"
}

resource "heroku_formation" "news-worker" {
  app = heroku_app.web_app.name
  type = "worker"
  quantity = 1
  size = "free"
}

locals {
  secrethub_dir = "vdtn359/start/vdtn359-news"
}

provider "secrethub" {
}

data "secrethub_secret" "digitalocean_token" {
  path = "${local.secrethub_dir}/digitalocean-token"
}

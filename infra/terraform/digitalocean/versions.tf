terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
    secrethub = {
      source = "secrethub/secrethub"
      version = ">= 1.2.0"
    }
  }
  required_version = ">= 0.13"
}


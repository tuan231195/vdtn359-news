terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    heroku = {
      source = "heroku/heroku"
    }
    secrethub = {
      source = "secrethub/secrethub"
      version = ">= 1.2.0"
    }
  }
  required_version = ">= 0.13"
}

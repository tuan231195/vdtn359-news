terraform {
  backend "s3" {
    encrypt = true
    bucket = "vdtn359-news-terraform"
    key = "crawler/terraform.tfstate"
    region = "ap-southeast-2"
  }
}

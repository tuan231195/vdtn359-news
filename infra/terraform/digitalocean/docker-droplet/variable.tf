variable "ssh_public_key" {
  description = "DO SSH Public Key used for Provisioning"
}

variable "ssh_private_key" {
  description = "DO SSH Private Key used for Provisioning"
}

variable "user_name" {}

variable "image" {
  description = "DO SSH Key used for Provisioning"
}

variable "region" {
  description = "DO Region"
}

variable "size" {
  description = "DO instance size"
}

variable "private_networking" {
  description = "Enable Private Networking"
  default     = false
}

variable "backups" {
  description = "Enable Backups"
  default     = false
}

variable "ipv6" {
  description = "Enable IPv6"
  default     = false
}

variable "node_type" {
  description = "Type of Node"
}

variable "node_name" {
  description = "Docket name"
}

variable "user_data" {
  description = "Cloud Init User Data"
  default = ""
}

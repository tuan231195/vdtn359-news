variable "user_name" {
  default = "vdtn359"
}

variable "ssh_key_pair" {
  type = object({
    private: string,
    public: string
  })
}

variable "droplet_image" {}

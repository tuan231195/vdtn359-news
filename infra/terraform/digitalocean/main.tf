provider "digitalocean" {
  token = data.secrethub_secret.digitalocean_token.value
}

locals {
  node_id = module.vdtn359_droplet.node_id
  node_ip = module.vdtn359_droplet.node_ipv4_address
  node_names = module.vdtn359_droplet.node_name
}

module "vdtn359_droplet" {
  source = "./docker-droplet"
  image = var.droplet_image
  node_name = "vdtn359"
  node_type = "ubuntu"
  region = "sgp1"
  size = "s-1vcpu-1gb"
  ssh_private_key = var.ssh_key_pair.private
  ssh_public_key = var.ssh_key_pair.public
  user_name = var.user_name
}

resource "digitalocean_firewall" "default" {
  droplet_ids = [module.vdtn359_droplet.node_id]
  inbound_rule {
    protocol = "icmp"
    source_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  inbound_rule {
    protocol = "tcp"
    port_range = "22"
    source_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  inbound_rule {
    protocol = "tcp"
    port_range = "9999"
    source_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  outbound_rule {
    protocol = "icmp"
    destination_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  outbound_rule {
    protocol = "tcp"
    port_range = "1-65535"
    destination_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  outbound_rule {
    protocol = "udp"
    port_range = "1-65535"
    destination_addresses = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  name = "Firewall"
}


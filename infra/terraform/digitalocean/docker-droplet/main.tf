resource "digitalocean_ssh_key" "ssh_key" {
  name       = "SSH Key for ${var.node_name}"
  public_key = file(var.ssh_public_key)
}

resource "digitalocean_floating_ip" "static_ip" {
  region = var.region
}

resource "digitalocean_floating_ip_assignment" "static_ip_assigment" {
  droplet_id = digitalocean_droplet.droplet_node.id
  ip_address = digitalocean_floating_ip.static_ip.ip_address
}

resource "digitalocean_droplet" "droplet_node" {
  ssh_keys           = [digitalocean_ssh_key.ssh_key.fingerprint]
  image              = var.image
  region             = var.region
  size               = var.size
  private_networking = var.private_networking
  backups            = var.backups
  ipv6               = var.ipv6
  name               = "${var.region}-${var.node_type}-${var.node_name}"
  user_data          = var.user_data != "" ? var.user_data : null
}

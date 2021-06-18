output "node_id" {
  value = digitalocean_droplet.droplet_node.id
}

output "node_ipv4_address" {
  value = digitalocean_floating_ip.static_ip.ip_address
}

output "node_name" {
  value = digitalocean_droplet.droplet_node.name
}

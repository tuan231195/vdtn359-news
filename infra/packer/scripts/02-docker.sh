#!/usr/bin/env bash
set -e
sudo  DEBIAN_FRONTEND=noninteractive apt-get -y install docker.io
sudo service docker start
usermod -aG docker vdtn359

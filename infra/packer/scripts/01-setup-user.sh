#!/usr/bin/env bash
set -e
addgroup vdtn359
adduser vdtn359 --ingroup vdtn359 --gecos "" --shell /bin/bash --disabled-password
usermod -aG sudo vdtn359
echo "vdtn359 ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/99_sudo_include_file
sed -i -e '/^Port/s/^.*$/Port 4444/' /etc/ssh/sshd_config
sed -i -e '/^PermitRootLogin/s/^.*$/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i -e '$aAllowUsers vdtn359' /etc/ssh/sshd_config

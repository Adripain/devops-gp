#!/usr/bin/env bash
set -eu

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y ca-certificates curl git docker.io docker-compose-plugin python3

systemctl enable docker
systemctl start docker
usermod -aG docker vagrant || true

cd /workspace/devops-gp
docker compose config >/tmp/devops-gp-compose.yml

echo "Linux node is ready."
echo "Run the stack with:"
echo "  cd /workspace/devops-gp && docker compose up -d --build"

#!/usr/bin/env bash
set -eu

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y ca-certificates curl git docker.io docker-compose-plugin python3

systemctl enable docker
systemctl start docker
LINUX_SSH_USER="${LINUX_SSH_USER:-vagrant}"
usermod -aG docker "$LINUX_SSH_USER" || true

PROJECT_DIR="${PROJECT_DIR:-/workspace/devops-gp}"

cd "$PROJECT_DIR"
docker compose config >/tmp/devops-gp-compose.yml

echo "Linux node is ready."
echo "Run the stack with:"
echo "  cd $PROJECT_DIR && docker compose up -d --build"

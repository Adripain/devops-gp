terraform {
  required_version = ">= 1.5.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

locals {
  project_name = "task-manager-devops"
}

resource "local_file" "deployment_notes" {
  filename = "${path.module}/generated-deployment-notes.txt"
  content  = <<EOT
Project: ${local.project_name}

This simple Terraform module documents the local deployment target for the demo.
The application itself is deployed with Docker Compose:

  docker compose up --build

Services:
- frontend: http://localhost:8080
- nginx load balancer and API: http://localhost:3000
- prometheus: http://localhost:9090
- grafana: http://localhost:3001
EOT
}

output "project_name" {
  value = local.project_name
}

output "deployment_notes_file" {
  value = local_file.deployment_notes.filename
}

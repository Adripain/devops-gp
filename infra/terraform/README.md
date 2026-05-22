# Terraform

This intentionally small Terraform module gives the project an IaC deliverable without requiring a cloud account.

Run:

```bash
cd infra/terraform
terraform init
terraform apply
```

It creates `generated-deployment-notes.txt` with the local Docker Compose deployment information.

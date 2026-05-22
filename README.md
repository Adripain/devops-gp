# Task Manager DevOps Project

A small, demo-ready Task Manager web app built for a 4-hour DevOps group project.

## Stack

- Frontend: React + Vite + Nginx
- Backend: Node.js + Express
- Database: PostgreSQL
- Containers: Docker + Docker Compose
- CI/CD: GitHub Actions
- IaC: Terraform
- Monitoring: Prometheus + Grafana

## Architecture

```text
Browser
  |
  v
Frontend container (React static app on Nginx, port 8080)
  |
  v
Backend container (Express REST API, port 3000)
  |
  v
PostgreSQL container (persistent volume)

Prometheus scrapes backend /metrics
Grafana reads Prometheus and provisions a dashboard automatically
```

## Repository Structure

```text
.
├── backend/                  # Express API, PostgreSQL access, Prometheus metrics
├── frontend/                 # React app served by Nginx
├── infra/terraform/          # Basic Terraform IaC deliverable
├── monitoring/
│   ├── prometheus/           # Prometheus scrape config
│   └── grafana/provisioning/ # Datasource and dashboard provisioning
├── .github/workflows/ci.yml  # Build/test containers in GitHub Actions
└── docker-compose.yml
```

## Run Locally

Requirements:

- Docker
- Docker Compose

Start everything:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:8080
- Backend health: http://localhost:3000/health
- Backend metrics: http://localhost:3000/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

Grafana login:

- Username: `admin`
- Password: `admin`

The dashboard is provisioned at `Dashboards > Task Manager > Task Manager Overview`.

## API

Base URL: `http://localhost:3000/api`

```http
GET    /tasks
GET    /tasks/:id
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

Task shape:

```json
{
  "id": 1,
  "title": "Prepare demo",
  "description": "Create a task and show metrics",
  "status": "todo",
  "created_at": "2026-05-22T08:00:00.000Z"
}
```

Allowed status values:

- `todo`
- `in_progress`
- `done`

Create a task with curl:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Prepare demo","description":"Show CRUD, metrics and dashboard","status":"todo"}'
```

## Demo Steps

1. Run `docker compose up --build`.
2. Open http://localhost:8080.
3. Create a task.
4. Edit its status to `In progress`, then `Done`.
5. Delete a task.
6. Open http://localhost:3000/metrics and show `tasks_created_total`.
7. Open Grafana at http://localhost:3001 and show the provisioned dashboard.
8. Open Prometheus at http://localhost:9090 and query `up`.

## Development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

When running outside Docker, set backend database environment variables or use `DATABASE_URL`.

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Terraform

The Terraform deliverable is intentionally local and cloud-free.

```bash
cd infra/terraform
terraform init
terraform apply
```

This creates a generated deployment notes file describing the local Compose deployment.

## CI/CD

GitHub Actions runs on pushes to `main`, pull requests, and manual dispatch.

- installs dependencies
- runs backend tests
- runs frontend tests
- validates the Compose file
- validates Terraform formatting and configuration
- builds backend and frontend Docker images
- publishes Docker images to GitHub Container Registry on `main`

Published images:

```text
ghcr.io/adripain/devops-gp-backend:latest
ghcr.io/adripain/devops-gp-frontend:latest
```

No external secret is required for GHCR publishing because the workflow uses the built-in `GITHUB_TOKEN`.

# Ansible

This playbook automates the local Docker Compose deployment for the demo.

Run from the repository root:

```bash
ansible-playbook -i infra/ansible/inventory.ini infra/ansible/deploy-local.yml
```

It validates the Compose file, builds the containers, and starts the stack with:

- React frontend
- Nginx load balancer
- two Express backend instances
- PostgreSQL
- Prometheus
- Grafana

## VirtualBox VM Deployment

The two-VM deployment uses a dynamic inventory:

```bash
ansible-playbook -i infra/ansible/inventory-vms.py infra/ansible/site-vms.yml
```

The inventory reads its values from:

```text
infra/virtualbox/config.json
```

Use that file to change VM IPs, users, passwords, paths, boxes, CPU, memory, and demo ports.

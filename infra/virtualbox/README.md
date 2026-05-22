# VirtualBox Lab

This folder adds the two-VM part expected by the practical work:

- `linux-node`: Ubuntu VM, runs Docker and can deploy the Task Manager stack.
- `windows-node`: Windows VM, managed by Ansible through WinRM.

## Requirements

- VirtualBox
- Vagrant
- Ansible on the host machine

Install Vagrant if it is missing:

```bash
brew install --cask vagrant
```

## Start The VMs

From this folder:

```bash
cd infra/virtualbox
vagrant up
```

If the default Windows box is unavailable, choose another Windows box from Vagrant Cloud and run:

```bash
WINDOWS_BOX=<your-windows-box> vagrant up windows-node
```

## Verify

```bash
vagrant status
vagrant ssh linux-node
```

The expected private IPs are:

- Linux: `192.168.56.10`
- Windows: `192.168.56.20`

## Deploy With Ansible

From the repository root:

```bash
ansible-galaxy collection install -r infra/ansible/requirements.yml
ansible-playbook -i infra/ansible/inventory-vms.ini infra/ansible/site-vms.yml
```

This deploys the Docker Compose application on the Linux VM and configures a small IIS status page on the Windows VM.

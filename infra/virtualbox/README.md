# VirtualBox Lab

This folder adds the two-VM part expected by the practical work:

- `linux-node`: Ubuntu VM, runs Docker and can deploy the Task Manager stack.
- `windows-node`: Windows VM, managed by Ansible through WinRM.

## Configuration Variables

All VM values are centralized in:

```text
infra/virtualbox/config.json
```

Edit this file to change:

- VM names and hostnames
- Linux and Windows Vagrant boxes
- private IP addresses
- CPU and memory
- WinRM credentials
- Docker Compose project path inside the Linux VM
- demo ports

The Vagrantfile and Ansible inventory both read this configuration.

You can also override common values at runtime:

```bash
LINUX_IP=192.168.56.30 WINDOWS_IP=192.168.56.40 vagrant up
WINDOWS_BOX=<your-windows-box> WINDOWS_PASSWORD=<password> vagrant up windows-node
```

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

The default private IPs are defined in `config.json`:

- Linux: `192.168.56.10`
- Windows: `192.168.56.20`

## Deploy With Ansible

From the repository root:

```bash
ansible-galaxy collection install -r infra/ansible/requirements.yml
ansible-playbook -i infra/ansible/inventory-vms.py infra/ansible/site-vms.yml
```

This deploys the Docker Compose application on the Linux VM and configures a small IIS status page on the Windows VM.

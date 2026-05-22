#!/usr/bin/env python3
import json
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "infra" / "virtualbox" / "config.json"


def env_or_config(env_name, value):
    return os.environ.get(env_name, value)


def main():
    config = json.loads(CONFIG_PATH.read_text())
    lab = config["virtualbox"]
    linux = lab["linux"]
    windows = lab["windows"]

    inventory = {
        "linux": {
            "hosts": [linux["name"]]
        },
        "windows": {
            "hosts": [windows["name"]]
        },
        "_meta": {
            "hostvars": {
                linux["name"]: {
                    "ansible_host": env_or_config("LINUX_IP", linux["ip"]),
                    "ansible_user": env_or_config("LINUX_SSH_USER", linux["ssh_user"]),
                    "ansible_ssh_private_key_file": str(
                        ROOT
                        / "infra"
                        / "virtualbox"
                        / ".vagrant"
                        / "machines"
                        / linux["name"]
                        / "virtualbox"
                        / "private_key"
                    ),
                    "ansible_python_interpreter": linux["python_interpreter"]
                },
                windows["name"]: {
                    "ansible_host": env_or_config("WINDOWS_IP", windows["ip"]),
                    "ansible_user": env_or_config("WINDOWS_USER", windows["winrm_user"]),
                    "ansible_password": env_or_config("WINDOWS_PASSWORD", windows["winrm_password"]),
                    "ansible_connection": "winrm",
                    "ansible_port": env_or_config("WINDOWS_WINRM_PORT", windows["winrm_port"]),
                    "ansible_winrm_transport": env_or_config(
                        "WINDOWS_WINRM_TRANSPORT",
                        windows["winrm_transport"]
                    ),
                    "ansible_winrm_server_cert_validation": "ignore"
                }
            }
        }
    }

    print(json.dumps(inventory))


if __name__ == "__main__":
    main()

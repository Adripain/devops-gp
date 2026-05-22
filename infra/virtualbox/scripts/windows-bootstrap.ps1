$ErrorActionPreference = "Stop"

$StatusDirectory = if ($env:STATUS_DIRECTORY) { $env:STATUS_DIRECTORY } else { "C:\devops-gp" }

Set-Item -Path WSMan:\localhost\Service\AllowUnencrypted -Value $true
Set-Item -Path WSMan:\localhost\Service\Auth\Basic -Value $true

New-Item -Path $StatusDirectory -ItemType Directory -Force | Out-Null

Set-Content -Path "$StatusDirectory\README.txt" -Value @"
Windows node is ready.

This VM is used as a Windows target managed by Ansible through WinRM.
The Linux VM runs the Docker Compose application stack.
"@

Write-Host "Windows node is ready."

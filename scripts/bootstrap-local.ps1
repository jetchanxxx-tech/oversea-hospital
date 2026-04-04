$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location ..

if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
  }
}

if (-not (Test-Path "apps")) { New-Item -ItemType Directory -Path "apps" | Out-Null }
if (-not (Test-Path "scripts")) { New-Item -ItemType Directory -Path "scripts" | Out-Null }
if (-not (Test-Path "seed")) { New-Item -ItemType Directory -Path "seed" | Out-Null }

Write-Host "Step 1/4: Create Next.js web app (apps/web)"
if (-not (Test-Path "apps/web")) {
  npx -y create-next-app@latest apps/web --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --no-turbo --yes
}

Write-Host "Step 2/4: Create NestJS API (apps/api)"
if (-not (Test-Path "apps/api")) {
  npx -y @nestjs/cli new apps/api --skip-git --package-manager npm
}

Write-Host "Step 3/4: Create Strapi CMS (apps/cms)"
if (-not (Test-Path "apps/cms")) {
  npx -y create-strapi-app@latest apps/cms --quickstart
}

Write-Host "Step 4/4: Prepare local MySQL (no Docker)"
Write-Host "1) Install and start MySQL 8 locally"
Write-Host "2) Create databases/users (run in MySQL Workbench or mysql client):"
Write-Host "   CREATE DATABASE IF NOT EXISTS oversea_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
Write-Host "   CREATE DATABASE IF NOT EXISTS oversea_api CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
Write-Host "   CREATE USER IF NOT EXISTS 'oversea'@'%' IDENTIFIED BY 'oversea';"
Write-Host "   GRANT ALL PRIVILEGES ON oversea_cms.* TO 'oversea'@'%';"
Write-Host "   GRANT ALL PRIVILEGES ON oversea_api.* TO 'oversea'@'%';"
Write-Host "   FLUSH PRIVILEGES;"


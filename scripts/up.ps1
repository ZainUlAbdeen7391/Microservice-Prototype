# Starts the stack with every value (including API_GATEWAY_PORT, which Docker
# needs before any container/SDK code can run) sourced live from Infisical -
# nothing gets written to a local file.
#
# Requires the Infisical CLI: npm install -g @infisical/cli

$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) {
    Write-Error ".env not found. Copy .env.example to .env and fill in your Infisical bootstrap credentials (client id/secret, project id, environment) first."
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $parts = $_ -split '=', 2
    if ($parts.Length -eq 2) {
        [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
    }
}

# The npm-installed `infisical` shim ships broken on Windows (its bin/infisical
# file is empty - see https://github.com/Infisical/cli issues). Resolve the
# real infisical.exe directly instead of relying on the shim.
$infisical = $null
$shimCmd = Get-Command infisical.exe -ErrorAction SilentlyContinue
if ($shimCmd) {
    $infisical = $shimCmd.Source
} else {
    $npmRoot = (npm root -g).Trim()
    $candidate = Join-Path $npmRoot "@infisical\cli\bin\infisical.exe"
    if (Test-Path $candidate) {
        $infisical = $candidate
    }
}

if (-not $infisical) {
    Write-Error "Infisical CLI not found. Install it with: npm install -g @infisical/cli"
    exit 1
}

if ($env:INFISICAL_SITE_URL) {
    $env:INFISICAL_DOMAIN = $env:INFISICAL_SITE_URL
}

$token = & $infisical login --method=universal-auth `
    --client-id=$env:INFISICAL_CLIENT_ID `
    --client-secret=$env:INFISICAL_CLIENT_SECRET `
    --silent --plain

if (-not $token) {
    Write-Error "Infisical login failed."
    exit 1
}

$env:INFISICAL_TOKEN = $token

& $infisical run --projectId=$env:INFISICAL_PROJECT_ID --env=$env:INFISICAL_ENVIRONMENT -- docker compose up --build

# Fox Fuel Resource Loader - Build Script
# Creates a single Windows executable using PyInstaller
#
# Usage: .\build_exe.ps1
# Output: dist\FoxFuelResourceLoader.exe

param(
    [switch]$Clean,
    [switch]$Debug
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Fox Fuel Resource Loader Builder" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Always clean dist/build/spec for a fresh build (prevents stale artifacts)
Write-Host "Cleaning previous build artifacts..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  Removed: dist\" -ForegroundColor Gray
}
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "  Removed: build\" -ForegroundColor Gray
}
Get-ChildItem -Filter "*.spec" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Force $_.FullName
    Write-Host "  Removed: $($_.Name)" -ForegroundColor Gray
}

# Clean tmp/ if it has stale staging artifacts (optional with -Clean flag)
if ($Clean) {
    Write-Host "Deep clean: removing tmp/ staging artifacts..." -ForegroundColor Yellow
    if (Test-Path "tmp") {
        Remove-Item -Recurse -Force "tmp"
        Write-Host "  Removed: tmp\" -ForegroundColor Gray
    }
}

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Python not found. Please install Python 3.9+ and add to PATH." -ForegroundColor Red
    exit 1
}

# Create virtual environment if not exists
$VenvPath = Join-Path $ScriptDir ".venv"
if (-not (Test-Path $VenvPath)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv $VenvPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Created: .venv" -ForegroundColor Green
} else {
    Write-Host "Using existing virtual environment: .venv" -ForegroundColor Green
}

# Activate venv
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
$ActivateScript = Join-Path $VenvPath "Scripts\Activate.ps1"
. $ActivateScript

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: pip upgrade failed, continuing..." -ForegroundColor Yellow
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
python -m pip install -r requirements.txt --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "  Dependencies installed" -ForegroundColor Green

# Check if tkinterdnd2 installed correctly
Write-Host "Checking tkinterdnd2..." -ForegroundColor Yellow
$dndCheck = python -c "import tkinterdnd2; print('OK')" 2>&1
if ($dndCheck -eq "OK") {
    Write-Host "  tkinterdnd2: OK (drag-drop enabled)" -ForegroundColor Green
    $HasDnd = $true
} else {
    Write-Host "  tkinterdnd2: Not available (using Browse button fallback)" -ForegroundColor Yellow
    $HasDnd = $false
}

# Build with PyInstaller
Write-Host "Building executable with PyInstaller..." -ForegroundColor Yellow

$PyInstallerArgs = @(
    "--onefile",
    "--windowed",
    "--name", "FoxFuelResourceLoader",
    "--distpath", "dist",
    "--workpath", "build",
    "--specpath", "."
)

# Add icon if exists
$IconPath = Join-Path $ScriptDir "icon.ico"
if (Test-Path $IconPath) {
    $PyInstallerArgs += "--icon", $IconPath
    Write-Host "  Using custom icon: icon.ico" -ForegroundColor Green
}

# Add hidden imports for tkinterdnd2 if available
if ($HasDnd) {
    $PyInstallerArgs += "--hidden-import", "tkinterdnd2"

    # Find tkdnd library path and add as data
    $tkdndPath = python -c "import tkinterdnd2; import os; print(os.path.dirname(tkinterdnd2.__file__))" 2>&1
    if ($tkdndPath -and (Test-Path $tkdndPath)) {
        # Copy tkdnd to be included
        $PyInstallerArgs += "--add-data", "$tkdndPath;tkinterdnd2"
    }
}

# Add the ingest_pipeline module
$PyInstallerArgs += "--hidden-import", "ingest_pipeline"
$PyInstallerArgs += "--add-data", "ingest_pipeline.py;."

# Debug mode
if ($Debug) {
    $PyInstallerArgs += "--debug", "all"
    Write-Host "  Debug mode enabled" -ForegroundColor Yellow
}

# Main script
$PyInstallerArgs += "resource_loader.py"

Write-Host "  Running: pyinstaller $($PyInstallerArgs -join ' ')" -ForegroundColor Gray
pyinstaller @PyInstallerArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: PyInstaller build failed" -ForegroundColor Red
    exit 1
}

# Check output
$ExePath = Join-Path $ScriptDir "dist\FoxFuelResourceLoader.exe"
if (Test-Path $ExePath) {
    $ExeSize = (Get-Item $ExePath).Length / 1MB
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "BUILD SUCCESSFUL" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output: $ExePath" -ForegroundColor Cyan
    Write-Host "Size: $([math]::Round($ExeSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To use:" -ForegroundColor Yellow
    Write-Host "  1. Double-click FoxFuelResourceLoader.exe" -ForegroundColor White
    Write-Host "  2. The exe must remain inside the repo (tools\resource_loader\dist\)" -ForegroundColor White
    Write-Host "  3. Or copy to Desktop and run from there" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "ERROR: Build completed but exe not found at expected location" -ForegroundColor Red
    exit 1
}

# Final cleanup: remove build/ (always) and spec (unless Debug)
Write-Host "Final cleanup..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "  Removed: build\" -ForegroundColor Gray
}
if (-not $Debug) {
    Get-ChildItem -Filter "*.spec" -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item -Force $_.FullName
        Write-Host "  Removed: $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host "Done!" -ForegroundColor Green

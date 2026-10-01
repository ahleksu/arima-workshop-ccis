# Set up the ARIMA workshop on Windows (PowerShell 5.1 or later, also PowerShell 7).
#
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1
#
# Steps: find Python 3.10 to 3.13, create .venv, install requirements.txt,
# register a Jupyter kernel, and run scripts\check_env.py.
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Write-Step([string]$Message) {
    $script:CurrentStep = $Message
    Write-Host ""
    Write-Host "==> $Message"
}

function Test-Supported([string[]]$Command) {
    # $Command is the launcher plus its arguments, for example @("py", "-3.12").
    try {
        $exe = $Command[0]
        $rest = @()
        if ($Command.Length -gt 1) { $rest = $Command[1..($Command.Length - 1)] }
        & $exe @rest -c "import sys; sys.exit(0 if (3, 10) <= sys.version_info[:2] <= (3, 13) else 1)" 2>$null
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    }
}

function Invoke-Checked([string]$Exe, [string[]]$Arguments) {
    & $Exe @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed with exit code ${LASTEXITCODE}: $Exe $($Arguments -join ' ')" }
}

$script:CurrentStep = "starting"
try {
    Write-Step "Find Python 3.10 to 3.13"
    $candidates = @(
        @("py", "-3.13"), @("py", "-3.12"), @("py", "-3.11"), @("py", "-3.10"),
        @("python3"), @("python")
    )
    $python = $null
    foreach ($candidate in $candidates) {
        if ((Get-Command $candidate[0] -ErrorAction SilentlyContinue) -and (Test-Supported $candidate)) {
            $python = $candidate
            break
        }
    }

    Write-Step "Create the virtual environment in .venv"
    if (Test-Path ".venv") {
        Write-Host ".venv already exists. Reusing it."
    } elseif ($python) {
        Write-Host "Using: $($python -join ' ')"
        $rest = @()
        if ($python.Length -gt 1) { $rest = $python[1..($python.Length - 1)] }
        Invoke-Checked $python[0] ($rest + @("-m", "venv", ".venv"))
    } else {
        Write-Host "No Python 3.10 to 3.13 found."
        Write-Host "Install one from https://www.python.org/downloads/ (tick 'Add python.exe to PATH') and run this script again."
        throw "Python 3.10 to 3.13 is required"
    }

    $venvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
    if (-not (Test-Path $venvPython)) {
        throw "Cannot find $venvPython. Delete the .venv folder and run this script again."
    }

    Write-Step "Install the required packages"
    Invoke-Checked $venvPython @("-m", "pip", "install", "--quiet", "--upgrade", "pip")
    $required = Get-Content "requirements.txt" | Where-Object { $_ -notmatch "^\s*pmdarima" }
    $requiredFile = Join-Path ([System.IO.Path]::GetTempPath()) "arima-workshop-required.txt"
    Set-Content -Path $requiredFile -Value $required -Encoding ASCII
    Invoke-Checked $venvPython @("-m", "pip", "install", "--quiet", "-r", $requiredFile)
    Remove-Item $requiredFile -ErrorAction SilentlyContinue

    Write-Step "Install the optional package pmdarima"
    $optional = (Get-Content "requirements.txt" | Where-Object { $_ -match "^\s*pmdarima" } | Select-Object -First 1)
    & $venvPython -m pip install --quiet $optional
    if ($LASTEXITCODE -eq 0) {
        Write-Host "pmdarima installed."
    } else {
        Write-Host "pmdarima did not install. This is fine. Notebook 04 skips it."
    }

    Write-Step "Register the Jupyter kernel"
    Invoke-Checked $venvPython @("-m", "ipykernel", "install", "--user", "--name", "arima-workshop", "--display-name", "ARIMA Workshop")

    Write-Step "Run the environment check"
    Invoke-Checked $venvPython @("scripts\check_env.py")

    Write-Host ""
    Write-Host "Setup finished. Start the notebooks with:"
    Write-Host ""
    Write-Host "    .\.venv\Scripts\jupyter lab"
    Write-Host ""
    Write-Host "Open the notebooks folder and pick the 'ARIMA Workshop' kernel if Jupyter asks."
} catch {
    Write-Host ""
    Write-Host "Setup failed during: $script:CurrentStep" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "You can run the notebooks on Google Colab instead. See README.md."
    exit 1
}

@echo off
rem Set up the ARIMA workshop on Windows from cmd.
rem
rem     setup.bat
rem
rem This file starts setup.ps1 with a one-time execution policy bypass.
rem PowerShell 5.1 ships with every supported version of Windows.

where powershell >nul 2>nul
if errorlevel 1 (
    echo PowerShell was not found. Run the notebooks on Google Colab instead. See README.md.
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
exit /b %errorlevel%

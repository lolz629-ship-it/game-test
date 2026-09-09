@echo off
setlocal
cd /d "%~dp0"
set "VERDANT_NODE="
if exist "%~dp0runtime\node.exe" set "VERDANT_NODE=%~dp0runtime\node.exe"
if not defined VERDANT_NODE for %%N in (node.exe) do set "VERDANT_NODE=%%~$PATH:N"
if not defined VERDANT_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "VERDANT_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined VERDANT_NODE (
 echo Node.js 18 or newer is required. Install it from https://nodejs.org then open Play.cmd again.
 pause
 exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch.ps1" -NodePath "%VERDANT_NODE%"
if errorlevel 1 pause

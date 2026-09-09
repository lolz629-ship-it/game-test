@echo off
cd /d "%~dp0"
if exist "Verdant Engine.exe" (
 start "" "Verdant Engine.exe"
) else (
 echo Download the desktop release from https://github.com/lolz629-ship-it/game-test/releases/latest
 pause
)

@echo off
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:47831/api/quit' -Method Post -Headers @{ Origin = 'http://127.0.0.1:47831' } -UseBasicParsing | Out-Null; Write-Host 'Verdant Engine stopped. You can replace the game folder now.' } catch { Write-Host 'The game is already stopped or could not be reached.' }"
pause

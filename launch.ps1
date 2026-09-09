param([string]$NodePath)
$gameUrl = 'http://127.0.0.1:47831'
try { $gameResponse = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 2 -UseBasicParsing } catch { $gameResponse = $null }
if (-not $gameResponse) {
  Start-Process -FilePath $NodePath -ArgumentList ('"' + (Join-Path $PSScriptRoot 'server.mjs') + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
  for ($gameAttempt = 0; $gameAttempt -lt 20; $gameAttempt++) {
    Start-Sleep -Milliseconds 250
    try { $gameResponse = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 1 -UseBasicParsing; break } catch {}
  }
}
if (-not $gameResponse -or $gameResponse.Content -notmatch '<title>Verdant Engine</title>') { throw 'The game could not start, or its local port is occupied.' }
Start-Process $gameUrl

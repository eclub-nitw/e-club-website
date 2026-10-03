#!/bin/sh
# Rebuild and restart the production server on :3100 (kills whatever listens there first, via PowerShell).
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }"
npm run build 2>&1 | grep -E "rror|Finished|Failed" 
(nohup npx next start -p 3100 > /tmp/next.log 2>&1 &)
sleep 6
curl -s -o /dev/null -w "server %{http_code}\n" http://localhost:3100/

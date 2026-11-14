Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🍛 Launching RasoiPulse (Backend + Frontend)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Write-Host "`n[1/2] Starting Backend Express on http://localhost:8000..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k", "cd /d `"$backendPath`" && node src/index.js"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Frontend Vite on http://localhost:5173..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k", "cd /d `"$frontendPath`" && npm run dev"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "✅ Both servers have been launched in separate windows!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔍 Backend:  http://localhost:8000/api/health" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

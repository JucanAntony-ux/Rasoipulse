@echo off
title Launch RasoiPulse
echo ========================================================
echo 🍛 Launching RasoiPulse (Backend + Frontend)
echo ========================================================
echo.

echo [1/2] Starting Express API Server on http://localhost:8000 ...
start "RasoiPulse Backend API (8000)" cmd /k "cd /d "%~dp0backend" && node src/index.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "RasoiPulse Frontend (5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo ✅ Both servers are now running in separate windows!
echo 🌐 Frontend Dashboard: http://localhost:5173
echo 🔍 Backend API Health: http://localhost:8000/api/health
echo ========================================================
echo.
pause

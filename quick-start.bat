@echo off
echo ================================================
echo DesignFlow Quick Start
echo ================================================
echo.

echo This will start the development environment.
echo Press Ctrl+C to stop.
echo.
pause

echo Starting Backend Server...
echo.
start cmd /k "npm run server"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
echo.
start cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo Both servers are starting...
echo ================================================
echo.
echo Backend:  http://localhost:5175
echo Frontend: http://localhost:5173
echo.
echo Login: admin@designflow.com / password123
echo.
pause

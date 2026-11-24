@echo off
echo ========================================================
echo FINTRACE Standalone UI Preview Launcher
echo ========================================================
echo Launching local lightweight web server...
echo.

where python >nul 2>nul
if %errorlevel% == 0 (
    echo Starting Python HTTP server on port 3000...
    start http://localhost:3000
    python -m http.server 3000
    exit /b
)

where npx >nul 2>nul
if %errorlevel% == 0 (
    echo Starting static server via npx serve...
    start http://localhost:3000
    npx serve -l 3000 .
    exit /b
)

echo Opening index.html directly in your default browser...
start index.html

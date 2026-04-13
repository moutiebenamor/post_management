@echo off
echo 🚀 Starting Poste Project...

REM Check if MongoDB service is running
sc query "MongoDB" | find "RUNNING" >nul
if errorlevel 1 (
    echo ⚠️  MongoDB service is not running. Starting MongoDB...
    net start MongoDB
    if errorlevel 1 (
        echo ❌ Failed to start MongoDB. Please check your MongoDB installation.
        pause
        exit /b 1
    )
)

echo 📦 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🌐 Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ✅ Both servers started!
echo 📦 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul


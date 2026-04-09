@echo off
title AI Confidence Transparency Layer

echo ====================================================
echo Starting AI Confidence Transparency Layer Services...
echo ====================================================

:: Start the Python FastAPI backend in a new window
echo Starting Backend Database on Port 8080...
start "Backend" cmd /k "cd backend && echo Starting Uvicorn Server... && uvicorn main:app --reload --port 8080"

:: Start the React frontend in a new window
echo Starting React Frontend...
start "Frontend" cmd /k "cd frontend && echo Starting Vite Dev Server... && npm run dev"

echo.
echo Both services have been launched in separate windows!
echo - Backend will be available at: http://localhost:8080
echo - Frontend will be available at: http://localhost:5173 (usually)
echo.
echo You can safely close this launcher window.
pause

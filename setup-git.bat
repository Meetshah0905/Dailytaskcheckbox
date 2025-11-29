@echo off
echo Setting up Git for Dailytaskcheckbox repository...
echo.

cd /d "%~dp0"

echo Step 1: Initializing Git...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: RoutineFlow app with Netlify deployment config"

echo.
echo Step 4: Please add your GitHub remote manually:
echo   git remote add origin https://github.com/YOUR_USERNAME/Dailytaskcheckbox.git
echo.
echo Step 5: Then push to GitHub:
echo   git branch -M main
echo   git push -u origin main
echo.
echo NOTE: Replace YOUR_USERNAME with your actual GitHub username!
echo.
pause


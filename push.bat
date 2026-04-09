@echo off
echo Initializing Git...
"C:\Program Files\Git\cmd\git.exe" init

echo Adding files...
"C:\Program Files\Git\cmd\git.exe" add .

echo Committing...
"C:\Program Files\Git\cmd\git.exe" commit -m "Initialize beginner friendly simple Todo App"

echo Setting branch to main...
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo Adding your GitHub repository link...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/tayyabali77865-tech/Todo-App.git

echo Pushing to GitHub (A login popup might appear!)...
"C:\Program Files\Git\cmd\git.exe" push -u origin main --force

echo.
echo Process complete. Press any key to exit.
pause

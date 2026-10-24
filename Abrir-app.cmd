@echo off
cd /d "%~dp0"
set "taskNode=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%taskNode%" set "taskNode=node"
if not exist "node_modules" (
  echo Instale Node.js 24 ou superior e execute npm install antes de abrir.
  pause
  exit /b 1
)
start "" http://127.0.0.1:4173
"%taskNode%" scripts/preview.mjs
pause

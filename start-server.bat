@echo off
echo Iniciando PHP MCP Protocol Server...
echo.

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Erro: Node.js nao encontrado. Por favor, instale o Node.js.
  exit /b 1
)

REM Verificar se o PHP está instalado
where php >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Erro: PHP nao encontrado. Por favor, instale o PHP e verifique se esta no PATH.
  exit /b 1
)

REM Definir variáveis de ambiente
set MCP_PORT=7654
set DEBUG=true

REM Iniciar o servidor
node index.js

pause

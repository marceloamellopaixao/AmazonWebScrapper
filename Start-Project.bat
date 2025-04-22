@echo off
chcp 65001 >nul 2>&1
title Amazon Product Scraper - Inicialização Automática
color 0B

echo =====================================
echo  [✓] Amazon Product Scraper - Setup
echo =====================================
echo.

:: Verificar Node.js
echo [ℹ] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% equ 1 (
    echo [✗] ERRO: Node.js não encontrado!
    echo [ℹ] Por favor, instale manualmente em https://nodejs.org/ antes de continuar.
    pause
    exit /b
) else (
    echo [✓] Node.js já está instalado.
)

echo.

:: Verificar npm
echo [ℹ] Verificando npm...
where npm >nul 2>&1
if %errorlevel% equ 1 (
    echo [↻] Instalando npm via Node.js...
    echo [ℹ] (Isso pode demorar alguns minutos.)
    node -e "require('child_process').execSync('npm install -g npm', { stdio: 'inherit' })"
    if errorlevel 1 (
        echo [✗] ERRO ao instalar npm!
        pause
        exit /b
    )
    echo.
    echo [✓] npm instalado! Pode ser necessário abrir um novo terminal.
) else (
    echo [✓] npm já está instalado.
)

:: Verificar Bun
echo.
echo [ℹ] Verificando Bun...
where bun >nul 2>&1
if %errorlevel% equ 1 (
    echo [↻] Instalando Bun via npm...
    npm install -g bun
    echo [✓] Bun instalado! Pode ser necessário abrir um novo terminal.
) else (
    echo [✓] Bun já está instalado.
)

:: Instalar dependências do backend
echo.
echo [ℹ] Instalando dependências do backend...
cd api
if exist "node_modules" (
    echo [✓] Dependências do backend já estão instaladas.
) else (
    bun install
    if errorlevel 1 (
        echo [✗] ERRO ao instalar dependências do backend!
        pause
        exit /b
    )
)
cd ..

:: Instalar dependências do frontend
echo.
echo [ℹ] Instalando dependências do frontend...
cd frontend
if exist "node_modules" (
    echo [✓] Dependências do frontend já estão instaladas.
) else (
    npm install
    if errorlevel 1 (
        echo [✗] ERRO ao instalar dependências do frontend!
        pause
        exit /b
    )
)
cd ..

:: Iniciar servidores
echo.
echo [↻] Iniciando servidores...
start "Backend" /D api bun run index.ts
start "Frontend" /D frontend npm run dev

:: Aguardar inicialização
echo.
echo [ℹ] Aguardando servidores iniciarem (15 segundos)...
timeout /t 15 >nul

:: Abrir navegador
echo.
echo [↗] Abrindo navegador...
start http://localhost:5173

:: Final
echo.
echo ================================================
echo  [✓] 🚀 APLICAÇÃO RODANDO COM SUCESSO!
echo  [ℹ] Backend: http://localhost:3000
echo  [ℹ] Frontend: http://localhost:5173
echo ================================================
echo.
echo [⚠] Pressione qualquer tecla para parar os servidores e encerrar...
echo.

:: Loop para esperar a entrada do usuário
pause >nul
echo [✗] Parando servidores...
timeout /t 15 >nul

:: Parar os servidores
taskkill /IM "node.exe" /F >nul 2>&1
taskkill /IM "bun.exe" /F >nul 2>&1

echo [✓] Servidores parados. 
echo [ℹ] Sistema Fechando em 5 segundos.
timeout /t 5 >nul
exit /b
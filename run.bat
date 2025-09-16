@echo off
echo ========================================
echo    Hospital API - Backend
echo ========================================
echo.
echo Compilando proyecto...
call mvn clean compile
if %errorlevel% neq 0 (
    echo Error en la compilacion. Verifica que tengas Java 17+ instalado.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor...
echo La API estara disponible en: http://localhost:8080
echo Para detener el servidor presiona Ctrl+C
echo.
call mvn spring-boot:run












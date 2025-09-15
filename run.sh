#!/bin/bash

echo "========================================"
echo "    Hospital API - Backend"
echo "========================================"
echo

echo "Compilando proyecto..."
mvn clean compile
if [ $? -ne 0 ]; then
    echo "Error en la compilación. Verifica que tengas Java 17+ instalado."
    exit 1
fi

echo
echo "Iniciando servidor..."
echo "La API estará disponible en: http://localhost:8080"
echo "Para detener el servidor presiona Ctrl+C"
echo
mvn spring-boot:run

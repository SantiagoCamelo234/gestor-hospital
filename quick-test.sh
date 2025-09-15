#!/bin/bash

echo "========================================"
echo "    Test Rapido de la API"
echo "========================================"
echo

echo "1. Registrando usuario admin..."
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","rol":"ADMIN"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "2. Haciendo login..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "Token obtenido: $TOKEN"
echo

echo "3. Creando paciente..."
curl -X POST http://localhost:8080/api/pacientes \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"nombre":"Juan","apellido":"Perez","documento":"12345678","telefono":"555-0101"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "4. Listando pacientes..."
curl -X GET http://localhost:8080/api/pacientes \
  -H "Authorization: $TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

echo "5. Probando chatbot..."
curl -X POST http://localhost:8080/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"message":"Hola, ¿como puedo agendar una cita?"}' \
  -w "\nStatus: %{http_code}\n\n"

echo
echo "========================================"
echo "    Test completado"
echo "========================================"

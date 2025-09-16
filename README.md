# Hospital API - Backend

API REST para sistema hospitalario desarrollada con Spring Boot y estructuras de datos personalizadas.

## 🚀 Características

- **Autenticación JWT** con roles (ADMIN, MEDICO, PACIENTE)
- **Estructuras de datos personalizadas**: Trie, BST, PriorityQueue, DoublyLinkedList, HashMap, Stack
- **CRUD completo** para Pacientes, Médicos, Citas y Consultas
- **Chatbot inteligente** para pacientes
- **Sistema de Undo** con historial de acciones
- **Reportes y estadísticas**
- **Manejo de excepciones** robusto

## 🛠️ Tecnologías

- Java 17+
- Spring Boot 3.x
- Spring Data JPA
- H2 Database (en memoria)
- Maven

## 📋 Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Instalación y Ejecución

### 1. Clonar/Extraer el proyecto
```bash
# Si tienes git
git clone <url-del-repositorio>

# O extraer el ZIP en una carpeta
```

### 2. Navegar al directorio
```bash
cd hospital-api-backend
```

### 3. Compilar el proyecto
```bash
mvn clean compile
```

### 4. Ejecutar la aplicación
```bash
mvn spring-boot:run
```

### 5. Verificar que funciona
Abrir en el navegador: http://localhost:8080/api/hello

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Pacientes
- `POST /api/pacientes` - Crear paciente
- `GET /api/pacientes` - Listar pacientes (con paginación y ordenamiento BST)
- `GET /api/pacientes/search?nombre=...` - Búsqueda con Trie
- `GET /api/pacientes/{id}` - Obtener paciente
- `PUT /api/pacientes/{id}` - Actualizar paciente
- `DELETE /api/pacientes/{id}` - Eliminar paciente

### Médicos
- `POST /api/medicos` - Crear médico
- `GET /api/medicos` - Listar médicos
- `GET /api/medicos?especialidad=...` - Filtrar por especialidad
- `GET /api/medicos/{id}` - Obtener médico
- `PUT /api/medicos/{id}` - Actualizar médico
- `DELETE /api/medicos/{id}` - Eliminar médico

### Citas
- `POST /api/citas` - Agendar cita (usa PriorityQueue)
- `GET /api/citas/next` - Siguiente cita por prioridad
- `GET /api/citas?pacienteId=...` - Citas por paciente
- `POST /api/citas/{id}/atender` - Atender cita
- `DELETE /api/citas/{id}` - Cancelar cita

### Consultas Médicas
- `POST /api/pacientes/{id}/consultas` - Agregar consulta
- `GET /api/pacientes/{id}/consultas` - Historial (DoublyLinkedList)

### Chatbot
- `POST /api/chatbot/chat` - Chatear con el bot
- `GET /api/chatbot/help` - Ayuda del chatbot
- `GET /api/chatbot/topics` - Temas disponibles

### Sistema
- `POST /api/system/undo` - Deshacer última acción
- `GET /api/system/actions` - Historial de acciones

### Reportes
- `GET /api/reportes/estadisticas` - Estadísticas del hospital
- `GET /api/reportes/recomendaciones?pacienteId=...` - Recomendaciones

## 🧪 Testing

### Usar Postman/Insomnia
1. Importar el archivo `test-endpoints.json`
2. Configurar variable `baseUrl` = `http://localhost:8080`
3. Ejecutar tests en orden (empezar por autenticación)

### Flujo de prueba básico
1. **Registrar usuario**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` (copiar el token)
3. **Crear paciente**: `POST /api/pacientes` (usar token en Authorization header)
4. **Probar otros endpoints**

## 🔧 Estructuras de Datos Implementadas

- **CustomTrie**: Búsqueda de nombres de pacientes
- **CustomBST**: Ordenamiento alfabético de pacientes
- **CustomBinaryHeapPriorityQueue**: Cola de prioridad para citas
- **CustomDoublyLinkedList**: Historial médico
- **CustomHashMap**: Búsquedas rápidas por ID
- **CustomStack**: Sistema de undo

## 📁 Estructura del Proyecto

```
src/main/java/com/hospiapp/backend/
├── controllers/          # Controladores REST
├── services/            # Lógica de negocio
├── repositories/        # Acceso a datos
├── domain/             # Entidades JPA
├── dto/                # Objetos de transferencia
├── datastructures/     # Estructuras personalizadas
├── exception/          # Manejo de excepciones
├── utils/              # Utilidades
└── security/           # Configuración de seguridad
```

## 🐛 Solución de Problemas

### Error: "Token inválido o expirado"
- Asegúrate de hacer login primero y usar el token en el header Authorization
- El token se genera en `/api/auth/login`

### Error: "Puerto en uso"
- Cambiar puerto en `application.properties`: `server.port=8081`

### Error de compilación
- Verificar que tienes Java 17+
- Ejecutar `mvn clean install`

## 📞 Contacto

Para dudas sobre la implementación, contactar al desarrollador del backend.

---
**Nota**: Esta API está diseñada para desarrollo local. Para producción se requieren configuraciones adicionales de seguridad y base de datos.












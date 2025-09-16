# 🏥 HospiApp - Sistema de Gestión Hospitalaria

## 🚀 Instrucciones de Inicio Rápido

### Prerrequisitos
- Java 11 o superior
- Node.js 14 o superior
- Maven 3.6 o superior

### 1. Iniciar el Backend (Spring Boot)
```bash
# En la raíz del proyecto
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 2. Iniciar el Frontend (Lite-Server)
```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev

# O usar los scripts incluidos
# Windows:
start-frontend.bat

# Linux/Mac:
chmod +x start-frontend.sh
./start-frontend.sh
```

El frontend estará disponible en: `http://localhost:3000`

## 📱 Acceso a la Aplicación

### Página Principal
- **URL**: http://localhost:3000
- **Descripción**: Página de bienvenida con información del sistema

### Autenticación
- **URL**: http://localhost:3000/login.html
- **Usuarios de Prueba**:
  - **Admin**: admin / admin123
  - **Médico**: doctor1 / doctor123
  - **Paciente**: patient1 / patient123

### Paneles por Rol

#### 👑 Panel de Administración
- **URL**: http://localhost:3000/admin-panel.html
- **Funcionalidades**:
  - Dashboard con estadísticas en tiempo real
  - Gestión completa de pacientes, médicos, citas y consultas
  - Reportes y análisis del sistema
  - Gestión de usuarios y configuración

#### 👨‍⚕️ Panel de Médico
- **URL**: http://localhost:3000/medico.html
- **Funcionalidades**:
  - Visualización de citas asignadas
  - Gestión de estados de citas
  - Consulta de información de pacientes
  - Historial médico de pacientes
  - Actualización de perfil profesional

#### 👤 Panel de Paciente
- **URL**: http://localhost:3000/paciente.html
- **Funcionalidades**:
  - Agendar nuevas citas médicas
  - Visualizar citas programadas
  - Consultar historial médico personal
  - Actualizar información personal
  - Chatbot de asistencia

## 🔧 Características Técnicas

### Frontend
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- **Servidor**: Lite-Server (desarrollo)
- **Responsive**: Diseño adaptativo para móviles y desktop
- **APIs**: Integración completa con backend Spring Boot

### Backend
- **Tecnologías**: Spring Boot, Spring Security, JPA/Hibernate
- **Base de Datos**: H2 (en memoria)
- **Autenticación**: JWT (JSON Web Tokens)
- **Estructuras de Datos**: Implementaciones personalizadas (BST, Trie, HashMap, etc.)

## 📊 Funcionalidades Principales

### Gestión de Pacientes
- ✅ CRUD completo de pacientes
- ✅ Búsqueda por nombre (Trie)
- ✅ Ordenamiento alfabético (BST)
- ✅ Validaciones de datos

### Gestión de Médicos
- ✅ CRUD completo de médicos
- ✅ Filtrado por especialidad
- ✅ Gestión de perfiles profesionales

### Sistema de Citas
- ✅ Programación de citas con prioridades
- ✅ Cola de prioridades (Binary Heap)
- ✅ Gestión de estados (Pendiente, Atendida, Cancelada)
- ✅ Filtros por fecha y prioridad

### Consultas Médicas
- ✅ Registro de consultas médicas
- ✅ Historial médico (Doubly Linked List)
- ✅ Búsqueda por ID (HashMap)
- ✅ Autocompletado de diagnósticos (Trie)

### Sistema de Reportes
- ✅ Estadísticas en tiempo real
- ✅ Reportes por tipo de entidad
- ✅ Recomendaciones personalizadas

### Chatbot Inteligente
- ✅ Asistente virtual con IA
- ✅ Respuestas contextuales
- ✅ Temas médicos especializados

## 🛠️ Desarrollo

### Estructura del Proyecto
```
backend/
├── src/main/java/com/hospiapp/backend/
│   ├── controllers/     # Controladores REST
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos
│   ├── domain/          # Entidades del dominio
│   ├── datastructures/  # Estructuras personalizadas
│   └── security/        # Configuración de seguridad
└── static/              # Frontend estático
    ├── css/            # Estilos
    ├── js/             # JavaScript
    └── *.html          # Páginas
```

### APIs Disponibles
- **Autenticación**: `/api/auth/*`
- **Pacientes**: `/api/pacientes/*`
- **Médicos**: `/api/medicos/*`
- **Citas**: `/api/citas/*`
- **Consultas**: `/api/consultas/*`
- **Reportes**: `/api/reportes/*`
- **Sistema**: `/api/system/*`
- **Chatbot**: `/api/chatbot/*`

## 🐛 Solución de Problemas

### Error de Conexión Frontend-Backend
1. Verificar que el backend esté ejecutándose en puerto 8080
2. Comprobar la consola del navegador para errores CORS
3. Verificar que las URLs de API sean correctas

### Problemas de Autenticación
1. Limpiar localStorage del navegador
2. Verificar que el token JWT sea válido
3. Comprobar la configuración CORS del backend

### Errores de Base de Datos
1. Verificar que H2 esté configurada correctamente
2. Comprobar las migraciones de datos
3. Revisar los logs del backend

## 📈 Próximas Mejoras

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Temas personalizables
- [ ] Internacionalización (i18n)
- [ ] Tests automatizados
- [ ] Dockerización
- [ ] Despliegue en la nube

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 👨‍💻 Desarrollado por

Equipo HospiApp - Sistema de Gestión Hospitalaria Integral

---

**¡El sistema está listo para usar! 🎉**

Para cualquier consulta o problema, revisar los logs del backend o la consola del navegador.











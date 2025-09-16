# HospiApp Frontend

Sistema de gestión hospitalaria con interfaz web moderna desarrollado con HTML5, CSS3, JavaScript y Bootstrap 5.

## 🚀 Características

- **Interfaz Responsive**: Diseño adaptativo para dispositivos móviles y desktop
- **Autenticación Completa**: Login y registro con validación en tiempo real
- **Paneles Especializados**: Interfaces específicas para Administradores, Médicos y Pacientes
- **Gestión Integral**: CRUD completo para pacientes, médicos, citas y consultas
- **Notificaciones**: Sistema de notificaciones toast para feedback del usuario
- **Integración API**: Conexión completa con el backend Spring Boot

## 📁 Estructura del Proyecto

```
static/
├── index.html              # Página de bienvenida
├── login.html              # Autenticación (login/registro)
├── admin-panel.html        # Panel de administración
├── medico.html             # Panel de médico
├── paciente.html           # Panel de paciente
├── css/
│   ├── login.css          # Estilos de autenticación
│   ├── admin.css          # Estilos del panel admin
│   ├── medico.css         # Estilos del panel médico
│   └── paciente.css       # Estilos del panel paciente
├── js/
│   ├── login.js           # Lógica de autenticación
│   ├── admin.js           # Funcionalidades del admin
│   ├── medico.js          # Funcionalidades del médico
│   └── paciente.js        # Funcionalidades del paciente
└── README.md              # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Lógica de la aplicación
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Bootstrap Icons**: Iconografía consistente
- **Chart.js**: Gráficos y visualizaciones
- **Fetch API**: Comunicación con el backend

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (para lite-server)
- Backend HospiApp ejecutándose en puerto 8080

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# O iniciar servidor normal
npm start
```

### Acceso
- **URL**: http://localhost:3000
- **Página principal**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html

## 👥 Roles y Funcionalidades

### 🔐 Autenticación
- Login con validación en tiempo real
- Registro de nuevos usuarios
- Redirección automática según rol
- Manejo de tokens JWT
- Validación de sesiones

### 👑 Administrador
- **Dashboard**: Estadísticas en tiempo real
- **Gestión de Pacientes**: CRUD completo con búsqueda
- **Gestión de Médicos**: Administración de especialistas
- **Gestión de Citas**: Programación y seguimiento
- **Gestión de Consultas**: Registro de consultas médicas
- **Gestión de Usuarios**: Administración de cuentas
- **Reportes**: Estadísticas y análisis
- **Sistema**: Logs y configuración

### 👨‍⚕️ Médico
- **Dashboard**: Estadísticas personales
- **Mis Citas**: Gestión de citas asignadas
- **Pacientes**: Información de pacientes
- **Consultas**: Registro de consultas
- **Perfil**: Gestión de datos personales

### 👤 Paciente
- **Dashboard**: Información personal
- **Mis Citas**: Visualización y gestión
- **Historial**: Consultas médicas anteriores
- **Perfil**: Datos personales
- **Chatbot**: Asistente virtual

## 🔧 Configuración

### Variables de Entorno
El frontend se conecta automáticamente al backend en:
- **URL Base**: http://localhost:8080/api
- **Puerto Frontend**: 3000

### Personalización
- **Colores**: Modificar variables CSS en los archivos de estilos
- **APIs**: Actualizar constantes en los archivos JavaScript
- **Validaciones**: Ajustar reglas en las funciones de validación

## 📱 Responsive Design

El frontend está optimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔒 Seguridad

- Validación de tokens JWT
- Sanitización de inputs
- Validación del lado cliente
- Redirección automática en caso de sesión expirada

## 🐛 Solución de Problemas

### Error de Conexión
- Verificar que el backend esté ejecutándose
- Comprobar la URL del API en las constantes
- Revisar la consola del navegador para errores

### Problemas de Autenticación
- Limpiar localStorage del navegador
- Verificar que el token sea válido
- Comprobar la configuración CORS del backend

## 📈 Mejoras Futuras

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Temas personalizables
- [ ] Internacionalización (i18n)
- [ ] Tests automatizados

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 👨‍💻 Desarrollado por

Equipo HospiApp - Sistema de Gestión Hospitalaria











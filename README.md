# Sistema de Reservas Angular 19

Un sistema modular de reservas de espacios comunitarios desarrollado con Angular 19, utilizando componentes standalone, signals y Tailwind CSS.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular basada en:

- **Módulos independientes**: Usuarios, Reservas, Espacios, Autenticación, admin
- **Casos de uso encapsulados**: Lógica de negocio separada en servicios
- **Controladores HTTP**: Servicios que consumen la API REST
- **Componentes standalone**: Sin módulos tradicionales de Angular
- **Signals**: Para manejo reactivo del estado

## 🚀 Características

- ✅ Autenticación de usuarios (solo tipo "usuario", no admin)
- ✅ Listado y filtrado de espacios disponibles
- ✅ Visualización detallada de espacios con calendario
- ✅ Creación y gestión de reservas
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Componentes modulares y reutilizables
- ✅ Manejo de estado con Angular Signals

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                  # Servicios y modelos centrales
│   │   ├── models/            # Interfaces y tipos
│   │   ├── services/          # Servicios HTTP
│   │   ├── guards/            # Guards de autenticación
│   │   └── interceptors/      # Interceptores HTTP
│   ├── features/              # Módulos de funcionalidades
│   │   ├── auth/              # Autenticación
│   │   ├── admin/             # Componentes de adminsitrador
│   │   ├── espacios/          # Gestión de espacios
│   │   ├── reservas/          # Gestión de reservas
│   │   └── usuarios/          # Perfil de usuario
│   ├── shared/                # Componentes compartidos
│   │   └── components/        # Navbar, etc.
│   ├── app.component.ts       # Componente raíz
│   └── app.routes.ts          # Configuración de rutas
└── environments/              # Configuración de entornos
```

## 🛠️ Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Tailwind CSS**: Framework de estilos
- **Angular Signals**: Manejo reactivo del estado
- **Standalone Components**: Arquitectura sin módulos
- **RxJS**: Programación reactiva

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Angular CLI 19

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Cruzhit0/reservas-front.git
cd angular-reservas
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la URL de la API en \`src/environments/environment.ts\`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

4. Ejecuta el servidor de desarrollo:
```bash
ng serve
```

5. Abre tu navegador en \`http://localhost:4200\`

## 🔌 API Endpoints

El sistema consume los siguientes endpoints:

### Autenticación
- \`POST /api/auth/login\` - Iniciar sesión
- \`POST /api/auth/register\` - Registrar usuario

### Espacios
- \`GET /api/espacios\` - Listar espacios
- \`GET /api/espacios/:tipo\` - Espacios por tipo
- \`GET /api/espacios/disponibilidad/:id\` - Verificar disponibilidad
- \`GET /api/espacios/:id/calendario\` - Calendario de reservas

### Reservas
- \`POST /api/reservas\` - Crear reserva
- \`GET /api/reservas/mis-reservas\` - Mis reservas
- \`DELETE /api/reservas/:id\` - Cancelar reserva

### Usuarios
- \`GET /api/usuarios/perfil\` - Perfil del usuario

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Registro de usuarios 
- Inicio de sesión
- Protección de rutas con guards
- Interceptor para tokens JWT

### 2. Gestión de Espacios
- Listado de espacios disponibles
- Filtrado por tipo (salón, auditorio, sala)
- Vista detallada con información completa
- Calendario de disponibilidad

### 3. Sistema de Reservas
- Creación de reservas
- Visualización de reservas propias
- Cancelación de reservas futuras
- Estados de reserva 

### 4. Interfaz de Usuario
- Diseño responsive
- Navegación intuitiva
- Feedback visual para acciones
- Manejo de estados de carga y error


## 🚀 Comandos Útiles

```bash
# Desarrollo
ng serve

# Build para producción
ng build --prod

# Ejecutar tests
ng test

# Generar componente
ng generate component features/nueva-feature/components/nuevo-componente --standalone

# Generar servicio
ng generate service core/services/nuevo-servicio
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit tus cambios (\`git commit -am 'Agrega nueva funcionalidad'\`)
4. Push a la rama (\`git push origin feature/nueva-funcionalidad\`)
5. Abre un Pull Request


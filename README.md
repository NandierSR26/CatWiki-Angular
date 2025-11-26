# CatWiki Angular

Una aplicación web desarrollada en Angular 21 para explorar y descubrir información sobre diferentes razas de gatos. La aplicación incluye funcionalidades de autenticación, búsqueda de razas, perfiles de usuario y navegación detallada por cada raza.

## 🚀 Características

- **Autenticación completa**: Login, registro y gestión de perfiles
- **Exploración de razas**: Catálogo completo con información detallada
- **Búsqueda avanzada**: Encuentra razas por nombre y características
- **Perfil de usuario**: Gestión personalizada de favoritos y estadísticas
- **Diseño responsive**: Optimizado para todos los dispositivos
- **Arquitectura modular**: Código organizado y mantenible

## 🛠️ Tecnologías

- **Angular 21**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **Signals**: Gestión de estado moderna
- **Karma + Jasmine**: Testing unitario (101 tests)
- **Standalone Components**: Arquitectura moderna de Angular

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.19.0 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (para clonar el repositorio)

### Verificar versiones:
```bash
node --version
npm --version
git --version
```

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/NandierSR26/CatWiki-Angular.git
cd CatWiki-Angular
```

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

**Nota**: El flag `--legacy-peer-deps` es necesario para resolver conflictos de dependencias en Angular 21.

### 3. Configurar el entorno (opcional)

Si necesitas configurar variables de entorno específicas, edita el archivo:
```
src/environments/environment.ts
```

## 🚦 Comandos disponibles

### Desarrollo

```bash
# Levantar servidor de desarrollo
npm start
# o
ng serve

# La aplicación estará disponible en: http://localhost:4200
```

### Testing

```bash
# Ejecutar todos los tests (101 tests unitarios)
npm test
# o
ng test

# Ejecutar tests con cobertura
ng test --code-coverage

# Ejecutar tests en modo headless (CI)
ng test --watch=false --browsers=ChromeHeadless
```

### Build

```bash
# Build de desarrollo
ng build

# Build de producción
ng build --configuration=production
```

## 🏃‍♂️ Guía rápida de inicio

1. **Clona e instala**:
   ```bash
   git clone https://github.com/NandierSR26/CatWiki-Angular.git
   cd CatWiki-Angular
   npm install --legacy-peer-deps
   ```

2. **Inicia el desarrollo**:
   ```bash
   npm start
   ```

3. **Abre tu navegador**:
   - Ve a: `http://localhost:4200`
   - La aplicación se recargará automáticamente al hacer cambios

4. **Ejecuta los tests**:
   ```bash
   npm test
   ```

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/           # Módulo de autenticación
│   │   │   ├── pages/      # Login, Register, Profile
│   │   │   ├── services/   # AuthService, LoginService, etc.
│   │   │   ├── guards/     # Guards de protección de rutas
│   │   │   └── interfaces/ # Tipos e interfaces
│   │   ├── cats/           # Módulo de gatos
│   │   │   ├── pages/      # Landing, Search, Breed pages
│   │   │   ├── services/   # CatService, CatImagesService
│   │   │   └── interfaces/ # ICatBreed, etc.
│   │   └── ui/             # Componentes compartidos
│   └── environments/       # Configuraciones de entorno
```

## 🧪 Testing

El proyecto incluye una suite completa de **101 tests unitarios**:

- ✅ **35 tests** - LoginPage (testing exhaustivo)
- ✅ **21 tests** - RegisterPage (testing básico)
- ✅ **21 tests** - ProfilePage (orientado a servicios)
- ✅ **14 tests** - BreedPage (funcionalidades principales)
- ✅ **5 tests** - CatsLandingPage
- ✅ **5 tests** - SearchPage

### Cobertura incluye:
- Inicialización de componentes
- Validación de formularios
- Integración con servicios
- Manejo de errores
- Navegación entre páginas
- Gestión de estado con signals

## 🌐 Funcionalidades principales

### Autenticación
- **Login**: `/auth/login` - Iniciar sesión
- **Registro**: `/auth/register` - Crear cuenta nueva
- **Perfil**: `/auth/profile` - Gestión de perfil personal

### Exploración de gatos
- **Inicio**: `/` - Página principal con carrusel de razas
- **Búsqueda**: `/cats/search` - Buscar razas específicas
- **Detalles**: `/cats/breed/:id` - Información detallada de cada raza

## 🐛 Solución de problemas

### Error de dependencias
```bash
npm install --legacy-peer-deps
```

### Error de puerto ocupado
```bash
ng serve --port 4201
```

### Limpiar caché y reinstalar
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error de testing (platform-browser-dynamic)
```bash
npm install @angular/platform-browser-dynamic --save --legacy-peer-deps
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la sección de **Solución de problemas**
2. Verifica que tienes las versiones correctas de Node.js y npm
3. Asegúrate de usar `--legacy-peer-deps` al instalar
4. Ejecuta `npm test` para verificar que todo funcione

## 📄 Información adicional

- **Angular CLI**: [Documentación oficial](https://angular.dev/tools/cli)
- **Proyecto generado con**: Angular CLI versión 21.0.0
- **Tests**: Karma + Jasmine
- **Arquitectura**: Standalone Components con Signals

---

**¡Happy coding! 🐱✨**

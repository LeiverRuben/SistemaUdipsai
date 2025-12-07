# Sistema de Gestión Clínica y Estimulación Cognitiva UDIPSAI

Este proyecto es una plataforma web desarrollada para la **Unidad de Diagnóstico Investigación Psicopedagógica con Apoyo a la Inclusión (UDIPSAI)** de la Universidad Católica de Cuenca. Su objetivo es gestionar usuarios, administrar tests psicológicos y ofrecer herramientas de estimulación cognitiva a través de juegos interactivos.

## 🚀 Características Principales

### 1. Módulo de Autenticación y Login
- **Acceso seguro**: Login mediante cédula y contraseña.
- **Personalización**:
  - Imagen de portada personalizada (`portada-login.png`) con diseño corporativo "contain" para evitar distorsiones.
  - Títulos y descripciones actualizados según requerimientos institucionales:
    - *Título*: "Unidad de diagnostico investigación psicopedagogica con apoyo a la inclusión".
    - *Subtítulo*: "Inventario de test y juegos udipsai".

### 2. Dashboard Principal
- Panel de control intuitivo con acceso rápido a las diferentes secciones del sistema.
- Menú lateral de navegación persistente.

### 3. Módulo de Juegos (Estimulación Cognitiva)
Este módulo ha sido optimizado para garantizar la compatibilidad y experiencia de usuario:
- **Juegos Incluidos**:
  - **Estimulación**: Actividades generales de estimulación.
  - **Palabras**: Juego específico de vocabulario y lenguaje.
- **Modo Pantalla Externa (Launcher)**:
  - Debido a restricciones de seguridad modernas (políticas de *iframes* y cabeceras de seguridad en Vercel), los juegos se ejecutan en una ventana independiente segura.
  - Al seleccionar un juego, el sistema presenta una tarjeta de "Modo Pantalla Externa".
  - El botón "Iniciar Juego" redirige dinámicamente a la URL correcta del juego seleccionado:
    - *Estimulación*: `https://proyecto-vinculacion.vercel.app/`
    - *Palabras*: `https://sistemajuegodepalabras.vercel.app/`
- **Descargas**: Opción para descargar versiones de escritorio de las actividades.
- **Pantalla Completa**: Funcionalidad para maximizar el área de trabajo.

### 4. Gestión de Tests
- Interfaz para la visualización y administración de tests psicopedagógicos.

### 5. Administración de Usuarios
- (Solo Admin) Panel para gestionar el acceso de terapeutas y pacientes.
- Funciones de cambio de contraseña y configuración.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Diseño responsivo), JavaScript (Vanilla).
- **Backend**: Node.js, Express.
- **Base de Datos**: (Especificar si usa MongoDB/MySQL - basado en la estructura parece usar controladores).
- **Seguridad**: Autenticación basada en Tokens (JWT).

## 📋 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/LeiverRuben/SistemaUdipsai.git
   ```

2. **Instalar dependencias**:
   ```bash
   cd SistemaUdipsai
   npm install
   ```

3. **Configuración**:
   - Asegúrese de tener las variables de entorno configuradas (crear archivo `.env` si es necesario con las credenciales de BD y claves secretas).

4. **Ejecutar el servidor**:
   ```bash
   npm start
   # O para desarrollo
   npm run dev
   ```

5. **Acceder**:
   - Abra su navegador en `http://localhost:3000` (o el puerto configurado).

## 📄 Notas de la Última Actualización

- **Corrección de Visualización de Juegos**: Se solucionó el error "refused to connect" en el juego de "Palabras" implementando el modo de lanzamiento externo. Esto asegura que los juegos funcionen correctamente independientemente de las restricciones de *Cross-Origin* del navegador.
- **Actualización de Identidad Visual**: Se renovó la pantalla de login con los textos oficiales de la unidad y la nueva imagen corporativa.

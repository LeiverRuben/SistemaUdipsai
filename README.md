# 📘 Sistema de Gestión Clínica y Estimulación Cognitiva - UDIPSAI

Plataforma integral desarrollada para la **Unidad de Diagnóstico e Investigación Psicopedagógica con Apoyo a la Inclusión (UDIPSAI)**. Este sistema gestiona usuarios, administra baterías de tests psicológicos y provee herramientas de estimulación cognitiva mediante juegos interactivos, asegurando un entorno seguro y profesional.

---

## 🚀 Características Principales y Funcionalidades Implementadas

El sistema ha sido construido modularmente para facilitar su mantenimiento y escalabilidad. A continuación, se detallan las funcionalidades clave y las decisiones técnicas tomadas ("Los Pasos Realizados"):

### 1. 🔐 Módulo de Autenticación y Seguridad (Auth)
- **Login Seguro**: Implementación de autenticación mediante **JWT (JSON Web Tokens)**.
- **Hashing de Contraseñas**: Uso de `bcryptjs` para encriptar las contraseñas en la base de datos, garantizando que ninguna contraseña se almacene en texto plano.
- **Políticas de Seguridad Web**: Se implementaron cabeceras HTTP estrictas (`Cross-Origin-Opener-Policy` y `Cross-Origin-Embedder-Policy`) en `server.js` para mitigar vulnerabilidades y permitir el uso seguro de recursos compartidos.

### 2. 🎮 Módulo de Juegos y Estimulación Cognitiva
Debido a las modernas restricciones de seguridad de los navegadores (políticas de *Same-Origin*), se implementó una solución robusta para la integración de juegos externos:
- **Launcher de Pantalla Externa**: Los juegos "Estimulación" y "Palabras" se ejecutan en ventanas independientes seguras, evitando errores de "conexión rechazada" (refused to connect).
- **Control de Navegación**: El sistema gestiona las URL dinámicas para redirigir al usuario al entorno de juego correcto alojado en Vercel.

### 3. 👥 Gestión de Usuarios y Roles
- **Roles Diferenciados**:
  - **Admin**: Acceso total, incluyendo "Gestión Usuarios" y "Subir Recursos".
  - **Usuario/Terapeuta**: Acceso restringido a las herramientas clínicas y tests.
- **Seeders Automáticos (Semillas)**: El sistema incluye un script de inicialización (`config/usuariosIniciales.js`) que verifica y crea usuarios base automáticamente al arrancar el servidor si no existen, facilitando el despliegue inicial.

### 4. 📂 Gestión de Recursos Clínicos
- **Subida de Archivos**: Uso de `multer` para permitir a los administradores subir documentos y recursos PDF.
- **Repositorio Digital**: Interfaz dedicada para visualizar y descargar guías y manuales.

### 5. 💻 Interfaz de Usuario (Frontend)
- **Diseño Responsivo**: HTML5 y CSS3 puro con diseño adaptable.
- **Identidad Corporativa**: Personalización completa del login y dashboard con los colores y logos oficiales de la UDIPSAI.

---

## 🛠️ Arquitectura del Proyecto

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada a Node.js:

| Directorio | Descripción |
| :--- | :--- |
| **`config/`** | Configuraciones globales. Contiene `db.js` (conexión BD) y usuarios iniciales. |
| **`controllers/`** | Lógica de negocio. `userController.js`, `recursoController.js`, etc. Aquí reside la inteligencia del sistema. |
| **`models/`** | Definición de esquemas de base de datos usando **Sequelize** (ORM). |
| **`routes/`** | Definición de endpoints API (`/api/auth`, `/api/usuarios`, etc.). |
| **`middleware/`** | Funciones intermedias para validación de tokens y seguridad. |
| **`public/`** | Archivos estáticos del Frontend (HTML, CSS, JS del cliente, imágenes). |
| **`server.js`** | Punto de entrada. Configura Express, CORS, headers de seguridad y arranca la BD. |

---

## 📦 Dependencias y Tecnología

El núcleo del sistema se basa en las siguientes librerías clave (ver `package.json`):

- **Backend**:
  - `express`: Framework servidor web.
  - `sequelize` & `mysql2`: ORM para gestión de base de datos SQL.
  - `jsonwebtoken`: Manejo de sesiones sin estado.
  - `bcryptjs`: Seguridad y criptografía.
  - `multer`: Manejo de subida de archivos (multipart/form-data).
  - `cors` & `dotenv`: Configuración de entorno y acceso cruzado.
- **Desarrollo**:
  - `nodemon`: Reinicio automático del servidor durante el desarrollo.

---

## ⚙️ Instalación y Configuración

### Prerrequisitos
- **Node.js** (v18 o superior recomendado)
- **Base de Datos MySQL** (Local o Remota)

### Paso 1: Clonar e Instalar
```bash
git clone https://github.com/LeiverRuben/SistemaUdipsai.git
cd SistemaUdipsai
npm install
```

### Paso 2: Configuración de Base de Datos
El archivo de conexión se encuentra en `config/db.js`.
> ⚠️ **Nota Importante**: Actualmente las credenciales pueden estar definidas directamente en el código. Se recomienda crear un archivo `.env` en la raíz con las siguientes variables para mayor seguridad:

```env
DB_NAME=sistema_udipsai
DB_USER=root
DB_PASS=TU_CONTRASEÑA
DB_HOST=localhost
JWT_SECRET=tu_secreto_super_seguro
```

### Paso 3: Ejecución
Para desarrollo (con recarga automática):
```bash
npm run dev
```

Para producción:
```bash
npm start
```
El servidor iniciará por defecto en `http://localhost:3000`.

---

## 📝 Notas para el Encargado de Documentación

1. **Variables de Entorno**: Verificar si el servidor de despliegue requiere configurar el puerto (`PORT`) en el archivo `.env`.
2. **Carpetas de Carga**: Asegurarse de que la carpeta `public/uploads` (u otras rutas definidas en `multer`) tenga permisos de escritura en el servidor de producción.
3. **Persistencia**: Si se usa Docker o un servicio en la nube, asegurar que la base de datos tenga un volumen persistente.

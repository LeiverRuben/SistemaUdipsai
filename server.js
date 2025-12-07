import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import os from "os"; //detectar la IP

import { sequelize } from "./config/db.js";
import { Usuario } from "./models/Usuario.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { USUARIOS_INICIALES } from "./config/usuariosIniciales.js";

dotenv.config();
const app = express();

// Necesario para rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. SEGURIDAD (Obligatorio para Juegos Web/Godot)
// ==========================================
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);

// Ruta Raíz -> Login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "login.html"));
});

// ==========================================
// 2. FUNCIÓN AUTO-SEMILLA (Crea usuarios al inicio)
// ==========================================
const inicializarSistema = async () => {
  console.log("⚙️  Verificando integridad del sistema...");

  try {
    let cambios = 0;
    for (const u of USUARIOS_INICIALES) {
      // Buscamos si el usuario ya existe por cédula
      const usuarioExistente = await Usuario.findOne({ where: { cedula: u.cedula } });

      if (!usuarioExistente) {
        // Si no existe, lo creamos
        const hash = await bcrypt.hash(u.cedula, 10);
        await Usuario.create({
          ...u,
          password: hash,
          debe_cambiar_pass: true
        });
        console.log(`[NUEVO] Usuario creado: ${u.nombre}`);
        cambios++;
      } else {
        // Si existe, verificamos si el rol es correcto (Auto-corrección)
        if (usuarioExistente.rol !== u.rol) {
          usuarioExistente.rol = u.rol;
          await usuarioExistente.save();
          console.log(`[CORREGIDO] Rol actualizado para: ${u.nombre}`);
          cambios++;
        }
      }
    }

    if (cambios === 0) console.log("✅ Sistema al día. No se requirieron cambios.");
    else console.log(`✨ Se aplicaron ${cambios} actualizaciones automáticas.`);

  } catch (error) {
    console.error("❌ Error crítico en inicialización:", error);
  }
};

// ==========================================
// 3. ARRANQUE DEL SERVIDOR
// ==========================================
sequelize.sync({ alter: true }).then(async () => {
  console.log("✅ Base de datos conectada");

  // Ejecutamos la carga automática de datos
  await inicializarSistema();

  // Escuchamos en 0.0.0.0 para permitir conexiones externas
  app.listen(3000, '0.0.0.0', () => {
    console.log("\n🚀 SERVIDOR CORRIENDO EXITOSAMENTE");
    console.log("---------------------------------------");
    console.log("💻 Local:   http://localhost:3000");

    // Truco para mostrar tu IP de red automáticamente
    const networks = os.networkInterfaces();
    for (const name of Object.keys(networks)) {
      for (const net of networks[name]) {
        if (net.family === 'IPv4' && !net.internal) {

          // FILTRO INTELIGENTE:
          // Si empieza con 192.168.56, suele ser VirtualBox (lo marcamos diferente)
          if (net.address.startsWith("192.168.56")) {
            console.log(`🔌 Virtual: http://${net.address}:3000 (Solo para VMs)`);
          } else {
            // Esta es la buena para compartir
            console.log(`🌐 Red WiFi: http://${net.address}:3000  <-- ¡Esta es para compartir!`);
          }
        }
      }
    }
    console.log("---------------------------------------\n");
  });
});
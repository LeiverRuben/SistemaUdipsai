import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import os from "os";

import { sequelize } from "./config/db.js";
import { Usuario } from "./models/Usuario.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { USUARIOS_INICIALES } from "./config/usuariosIniciales.js";
import recursoRoutes from "./routes/recursoRoutes.js"; // <--- IMPORTAR
import { Recurso } from "./models/Recurso.js"; // <--- IMPORTAR MODELO

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. SEGURIDAD
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/recursos", recursoRoutes); // <--- NUEVA RUTA API

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "login.html"));
});

// ==========================================
// 2. FUNCIÓN AUTO-SEMILLA (SOLO CREA, NO SOBREESCRIBE)
// ==========================================
const inicializarSistema = async () => {
  console.log("⚙️  Verificando usuarios iniciales...");

  try {
    let creados = 0;
    for (const u of USUARIOS_INICIALES) {
      // Buscamos si el usuario ya existe por cédula
      const usuarioExistente = await Usuario.findOne({ where: { cedula: u.cedula } });

      // SI NO EXISTE -> LO CREAMOS
      if (!usuarioExistente) {
        const hash = await bcrypt.hash(u.cedula, 10);
        await Usuario.create({
          ...u,
          password: hash,
          debe_cambiar_pass: true
        });
        console.log(`[NUEVO] Usuario creado: ${u.nombre}`);
        creados++;
      }

      // ELIMINAMOS LA PARTE "ELSE" QUE SOBREESCRIBÍA TUS CAMBIOS
      // Ahora, si el usuario existe, el sistema lo deja tranquilo tal como tú lo editaste.
    }

    if (creados === 0) console.log("✅ Base de datos lista. No hay usuarios nuevos por agregar.");
    else console.log(`✨ Se crearon ${creados} usuarios nuevos.`);

  } catch (error) {
    console.error("❌ Error en inicialización:", error);
  }
};

// ==========================================
// 3. ARRANQUE DEL SERVIDOR
// ==========================================
sequelize.sync({ alter: true }).then(async () => {
  console.log("✅ Base de datos conectada");

  await inicializarSistema();

  app.listen(3000, '0.0.0.0', () => {
    console.log("\n🚀 SERVIDOR CORRIENDO EXITOSAMENTE");
    console.log("---------------------------------------");
    console.log("💻 Local:   http://localhost:3000");

    const networks = os.networkInterfaces();
    for (const name of Object.keys(networks)) {
      for (const net of networks[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          // Filtro visual para identificar la red real
          if (net.address.startsWith("192.168.56")) {
            // Ignoramos redes virtuales en el log para no confundir
          } else {
            console.log(`🌐 Red:     http://${net.address}:3000`);
          }
        }
      }
    }
    console.log("---------------------------------------\n");
  });
});
import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";
import { Usuario } from "../models/Usuario.js";

// Lista de usuarios
const usuarios = [
    { cedula: "0105360887", nombre: "Gabriela Angelita Jara Saldaña", rol: "admin" },
    { cedula: "0103159067", nombre: "Zobeida Ximena Parra Ordóñez", rol: "admin" },
    { cedula: "0302230602", nombre: "Fernando Ismael Lucero Asmal", rol: "admin" },
    { cedula: "1104010960", nombre: "Dunia Cecilia Coello Luna", rol: "admin" },
    { cedula: "0102698669", nombre: "María de Lourdes Cedillo Armijos", rol: "admin" },
    { cedula: "0105706105", nombre: "Dayana Carolina Gárate Rugel", rol: "admin" },
    { cedula: "0302929872", nombre: "Carmen Noemí Espinoza Parra", rol: "admin" },
    { cedula: "0102428620", nombre: "Esperanza Magaly Aguirre Cuesta", rol: "admin" }
];

const crearUsuarios = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ BD conectada.");

        for (const u of usuarios) {
            const hash = await bcrypt.hash(u.cedula, 10);

            const existente = await Usuario.findOne({ where: { cedula: u.cedula } });
            if (existente) {
                existente.nombre = u.nombre;
                existente.rol = u.rol;
                existente.password = hash;
                await existente.save();
                console.log(`⚠ Actualizado: ${u.cedula} -> ${u.nombre}`);
            } else {
                await Usuario.create({
                    cedula: u.cedula,
                    nombre: u.nombre,
                    password: hash,
                    rol: u.rol
                });
                console.log(`✔ Creado: ${u.cedula} -> ${u.nombre}`);
            }

            if (u.cedula === "0105360887") console.log("➡ Gabriela (ADMIN PRINCIPAL) procesada");
        }

        console.log("✅ Todos los usuarios han sido procesados.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al crear/actualizar usuarios:", error);
        process.exit(1);
    }
};

crearUsuarios();

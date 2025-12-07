import bcrypt from "bcryptjs";
import { Usuario } from "../models/Usuario.js";
import { USUARIOS_INICIALES } from "../config/usuariosIniciales.js"; // Importamos la lista externa
import { sequelize } from "../config/db.js"; // IMPORTANTE: Necesario para la función obtenerRoles

// ==========================================
// 1. LISTAR USUARIOS
// ==========================================
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["id", "cedula", "nombre", "rol", "createdAt"] // No enviamos el password
        });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

// ==========================================
// 2. ELIMINAR UN USUARIO
// ==========================================
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params; // Recibimos el ID por URL

    try {
        const borrado = await Usuario.destroy({ where: { id } });
        if (borrado) {
            res.json({ mensaje: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

// ==========================================
// 3. RESTAURAR BASE DE DATOS (SEED MANUAL)
// ==========================================
// Esta función lee la lista externa y resetea a todos los usuarios a su estado original
export const restaurarUsuariosBase = async (req, res) => {
    let creados = 0;

    try {
        for (const u of USUARIOS_INICIALES) {
            // Encriptamos la cédula para que sea la contraseña
            const hash = await bcrypt.hash(u.cedula, 10);

            // UPSERT: Busca por cédula (clave única).
            // Si existe -> Lo actualiza (resetea password, rol y bandera).
            // Si no existe -> Lo crea.
            const [user, created] = await Usuario.upsert({
                cedula: u.cedula,
                nombre: u.nombre,
                rol: u.rol,
                password: hash,
                debe_cambiar_pass: true // Forzamos el cambio de contraseña
            });

            if (created) creados++;
        }

        res.json({
            mensaje: "Restauración forzada completada. Contraseñas y roles reseteados.",
            totalProcesados: USUARIOS_INICIALES.length,
            nuevosUsuarios: creados
        });

    } catch (error) {
        console.error("Error en seed:", error);
        res.status(500).json({ error: "Error al restaurar base de usuarios" });
    }
};

// ==========================================
// 4. RESETEAR CONTRASEÑA INDIVIDUAL (ADMIN)
// ==========================================
export const resetearPasswordUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Encriptamos la CÉDULA para que sea la nueva contraseña
        const hash = await bcrypt.hash(usuario.cedula, 10);

        usuario.password = hash;
        usuario.debe_cambiar_pass = true; // Importante: Pide cambio al entrar

        await usuario.save();

        res.json({ mensaje: `Contraseña restablecida correctamente para ${usuario.nombre}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al restablecer contraseña" });
    }
};

// ==========================================
// 5. CREAR USUARIO (MANUALMENTE POR ADMIN)
// ==========================================
export const crearUsuarioAdmin = async (req, res) => {
    const { nombre, cedula, rol } = req.body;
    try {
        // Verificar duplicados
        const existe = await Usuario.findOne({ where: { cedula } });
        if (existe) return res.status(400).json({ error: "Esa cédula ya está registrada" });

        // Contraseña inicial = Cédula
        const hash = await bcrypt.hash(cedula, 10);

        const nuevo = await Usuario.create({
            nombre,
            cedula,
            rol,
            password: hash,
            debe_cambiar_pass: true
        });

        res.json({ mensaje: "Usuario creado exitosamente", usuario: nuevo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
};

// ==========================================
// 6. EDITAR USUARIO (NOMBRE Y ROL)
// ==========================================
export const editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, rol } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        usuario.nombre = nombre;
        usuario.rol = rol;
        await usuario.save();

        res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al editar usuario" });
    }
};

// ==========================================
// 7. OBTENER ROLES ÚNICOS (Para el autocompletado)
// ==========================================
export const obtenerRoles = async (req, res) => {
    try {
        // Busca todos los roles distintos que existen en la tabla
        const roles = await Usuario.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('rol')), 'rol']],
            raw: true
        });

        // Convierte el resultado en un array simple: ['admin', 'psicologo', 'nuevoRol']
        const listaRoles = roles.map(r => r.rol);
        res.json(listaRoles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener roles" });
    }
};
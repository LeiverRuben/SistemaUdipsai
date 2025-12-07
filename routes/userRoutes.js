import express from "express";
import {
    obtenerUsuarios,
    eliminarUsuario,
    restaurarUsuariosBase,
    resetearPasswordUsuario,
    crearUsuarioAdmin,
    editarUsuario,
    obtenerRoles  // <--- Importante: Esta es la nueva función
} from "../controllers/userController.js";

const router = express.Router();

// GET: Ver todos los usuarios
router.get("/", obtenerUsuarios);

// GET: Obtener lista de roles únicos (Para el autocompletado)
router.get("/roles/lista", obtenerRoles);

// POST: Crear un nuevo usuario (desde el panel de admin)
router.post("/", crearUsuarioAdmin);

// PUT: Editar un usuario existente (nombre y rol)
router.put("/:id", editarUsuario);

// DELETE: Borrar un usuario por ID
router.delete("/:id", eliminarUsuario);

// POST: Restaurar base de datos completa (Seed)
router.post("/seed", restaurarUsuariosBase);

// PUT: Resetear contraseña individual a la cédula
router.put("/:id/reset", resetearPasswordUsuario);

export default router;
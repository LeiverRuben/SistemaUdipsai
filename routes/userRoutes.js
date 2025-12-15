import express from "express";
import {
    obtenerUsuarios,
    eliminarUsuario,
    restaurarUsuariosBase,
    resetearPasswordUsuario,
    crearUsuarioAdmin,
    editarUsuario,
    obtenerRoles,
    actualizarNombreRol // <--- NUEVA IMPORTACIÓN
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", obtenerUsuarios);
router.get("/roles/lista", obtenerRoles);
router.post("/", crearUsuarioAdmin);
router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/seed", restaurarUsuariosBase);
router.put("/:id/reset", resetearPasswordUsuario);

// NUEVA RUTA PARA GESTIÓN DE ROLES
router.put("/roles/migrar", actualizarNombreRol);

export default router;
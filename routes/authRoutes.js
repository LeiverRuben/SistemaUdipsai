import express from "express";
import { login, registrar, cambiarPassword, actualizarPasswordVoluntario } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/registrar", registrar);
router.put("/cambiar-contrasena", cambiarPassword);
router.put("/actualizar-password", actualizarPasswordVoluntario);
export default router; 

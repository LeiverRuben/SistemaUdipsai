import express from "express";
import { cambiarContraseña } from "../controllers/authController.js";

const router = express.Router();

router.put("/", cambiarContraseña);

export default router;
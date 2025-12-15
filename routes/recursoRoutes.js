import express from "express";
import multer from "multer";
import path from "path";
import { subirRecurso, obtenerRecursos, eliminarRecurso, reemplazarArchivo } from "../controllers/recursoController.js";

const router = express.Router();

// CONFIGURACIÓN DE MULTER (Dónde guardar)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/descargas/'); // Carpeta destino
    },
    filename: (req, file, cb) => {
        // Evitar nombres duplicados usando la fecha
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// RUTAS
router.get("/", obtenerRecursos);
router.post("/subir", upload.single('archivo'), subirRecurso); // 'archivo' es el name del input HTML
router.delete("/:id", eliminarRecurso);
router.put("/reemplazar/:id", upload.single('archivo'), reemplazarArchivo);

export default router;
import { Recurso } from "../models/Recurso.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. SUBIR RECURSO
export const subirRecurso = async (req, res) => {
    try {
        const { titulo, descripcion, tipo } = req.body;
        const archivo = req.file; // Multer nos da esto

        if (!archivo) {
            return res.status(400).json({ error: "Debes seleccionar un archivo ZIP o EXE." });
        }

        // Guardar en Base de Datos
        const nuevoRecurso = await Recurso.create({
            titulo,
            descripcion,
            tipo,
            archivo: archivo.filename // Nombre con el que se guardó
        });

        res.json({ mensaje: "Recurso subido correctamente", recurso: nuevoRecurso });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al subir el recurso" });
    }
};

// 2. LISTAR RECURSOS
export const obtenerRecursos = async (req, res) => {
    try {
        const recursos = await Recurso.findAll({ order: [['createdAt', 'DESC']] });
        res.json(recursos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener recursos" });
    }
};

// 3. ELIMINAR RECURSO (Borra de BD y del Disco)
export const eliminarRecurso = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await Recurso.findByPk(id);
        if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });

        // Borrar archivo físico
        const rutaArchivo = path.join(__dirname, '../public/descargas', recurso.archivo);
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo);
        }

        // Borrar de BD
        await recurso.destroy();
        res.json({ mensaje: "Recurso eliminado y archivo borrado." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar" });
    }
};
// 4. REEMPLAZAR ARCHIVO (Mantiene el mismo ID y metadata)
export const reemplazarArchivo = async (req, res) => {
    const { id } = req.params;
    const nuevoArchivo = req.file; // Multer nos da el archivo subido

    if (!nuevoArchivo) {
        return res.status(400).json({ error: "Debes seleccionar un nuevo archivo." });
    }

    try {
        const recurso = await Recurso.findByPk(id);
        if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });

        // 1. Borrar archivo físico viejo
        const rutaVieja = path.join(__dirname, '../public/descargas', recurso.archivo);
        if (fs.existsSync(rutaVieja)) {
            fs.unlinkSync(rutaVieja);
        }

        // 2. Actualizar el registro con el nuevo nombre de archivo
        recurso.archivo = nuevoArchivo.filename;
        await recurso.save();

        res.json({ mensaje: `Archivo de ${recurso.titulo} reemplazado correctamente.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al reemplazar el archivo." });
    }
};
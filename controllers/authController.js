import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

// ===============================
// 1. REGISTRO DE USUARIOS
// ===============================
export async function registrar(req, res) {
  const { nombre, cedula, password, rol } = req.body;

  try {
    // Verificar si la cédula ya existe
    const existente = await Usuario.findOne({ where: { cedula } });
    if (existente) {
      return res.status(400).json({ error: "La cédula ya está registrada" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario (debe_cambiar_pass es true por defecto en el modelo)
    const nuevo = await Usuario.create({
      nombre,
      cedula,
      password: hash,
      rol: rol || "psicologo"
    });

    res.json({ mensaje: "Usuario creado correctamente", usuario: nuevo });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno al registrar" });
  }
}

// ===============================
// 2. LOGIN DE USUARIOS
// ===============================
export async function login(req, res) {
  const { cedula, password } = req.body;

  try {
    // Buscar por cédula
    const usuario = await Usuario.findOne({ where: { cedula } });

    if (!usuario) {
      return res.status(400).json({ error: "Cédula o contraseña incorrecta" });
    }

    // Validar contraseña
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(400).json({ error: "Cédula o contraseña incorrecta" });
    }

    // --- VERIFICACIÓN DE CAMBIO OBLIGATORIO ---
    // Si la bandera está en TRUE, obligamos al usuario a cambiarla
    if (usuario.debe_cambiar_pass) {
      return res.json({
        status: "CHANGE_PASSWORD",
        userId: usuario.id,
        mensaje: "Por seguridad, debes cambiar tu contraseña inicial."
      });
    }

    // --- LOGIN EXITOSO ---
    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || "udipsai_secret",
      { expiresIn: "2h" }
    );

    res.json({
      status: "OK",
      mensaje: "Login exitoso",
      token,
      datosUsuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
}

// ===============================
// 3. CAMBIO OBLIGATORIO (PRIMER INICIO)
// ===============================
// Esta función NO pide la contraseña anterior porque asumimos que viene del flujo de login forzado
export async function cambiarPassword(req, res) {
  const { id, nuevaPassword } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña
    const hash = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar contraseña y APAGAR la bandera
    usuario.password = hash;
    usuario.debe_cambiar_pass = false;

    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada correctamente. Ahora puedes iniciar sesión." });

  } catch (error) {
    console.error("Error al cambiar password:", error);
    res.status(500).json({ error: "Error interno al cambiar contraseña" });
  }
}

// ===============================
// 4. CAMBIO VOLUNTARIO (CONFIGURACIÓN)
// ===============================
// Esta función SÍ pide la contraseña anterior por seguridad
export async function actualizarPasswordVoluntario(req, res) {
  const { id, passwordActual, nuevaPassword } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // 1. VALIDAR QUE LA CONTRASEÑA ACTUAL SEA CORRECTA
    const valid = await bcrypt.compare(passwordActual, usuario.password);
    if (!valid) {
      return res.status(400).json({ error: "La contraseña actual es incorrecta" });
    }

    // 2. ENCRIPTAR LA NUEVA
    const hash = await bcrypt.hash(nuevaPassword, 10);
    usuario.password = hash;
    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada exitosamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
}
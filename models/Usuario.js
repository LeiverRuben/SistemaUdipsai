import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rol: {
    // CAMBIO IMPORTANTE:
    // Antes era ENUM("admin", "psicologo").
    // Ahora es STRING para permitir roles nuevos dinámicos.
    type: DataTypes.STRING,
    defaultValue: "psicologo",
    allowNull: false
  },

  debe_cambiar_pass: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});
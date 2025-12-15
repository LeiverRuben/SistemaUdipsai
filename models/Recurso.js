import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Recurso = sequelize.define("Recurso", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    titulo: { type: DataTypes.STRING, allowNull: false },

    descripcion: { type: DataTypes.STRING, allowNull: true },

    tipo: {
        type: DataTypes.ENUM('test', 'juego', 'otro'),
        allowNull: false
    },

    archivo: { type: DataTypes.STRING, allowNull: false }, // Guardará "Test5.zip"

    fechaSubida: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
import { sequelize } from "../config/db.js";
import { Usuario } from "../models/Usuario.js";

const cedulasAEliminar = [
    // pon aquí las cédulas que quieras borrar (ej. "0302896531")
    "0105360887",
    "0103159067",
    "0302230602",
    "1104010960",
    "0102698669",
    "0105706105",
    "0302929872",
    "0102428620"
];

const eliminar = async () => {
    try {
        await sequelize.authenticate();
        console.log("BD conectada. Eliminando...");

        for (const ced of cedulasAEliminar) {
            const eliminado = await Usuario.destroy({ where: { cedula: ced } });
            console.log(`${ced} -> ${eliminado ? "ELIMINADO" : "NO EXISTÍA"}`);
        }

        console.log("Operación finalizada.");
        process.exit(0);
    } catch (err) {
        console.error("Error eliminando usuarios:", err);
        process.exit(1);
    }
};

eliminar();
